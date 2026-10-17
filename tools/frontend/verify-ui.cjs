const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000/";
const root = process.cwd();
const checks = [],
  errors = [],
  external = [],
  writes = [],
  captures = [],
  contrasts = [],
  layoutMetrics = [];
const sha = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const assert = (ok, message) => {
  if (!ok) throw Error(message);
};
async function check(name, action) {
  try {
    await action();
    checks.push({ name, passed: true });
  } catch (e) {
    checks.push({ name, passed: false, error: e.message });
  }
}
function lum(rgb) {
  const c = rgb
    .map((v) => v / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
async function capture(page, name, options = {}) {
  const rel = `docs/design/previews/shared-ui/${name}.png`;
  fs.mkdirSync(path.dirname(rel), { recursive: true });
  await page.screenshot({ path: rel, ...options });
  captures.push({ path: rel, sha256: sha(rel), visually_reviewed: false });
}
async function contrast(action, mode, name, state, minimum) {
  await action.evaluate(async (e) => {
    await Promise.all(e.getAnimations().map((a) => a.finished.catch(() => {})));
  });
  const colors = await action.evaluate((e) => {
    function background(node) {
      if (!node) return "rgb(255, 255, 255)";
      const color = getComputedStyle(node).backgroundColor;
      return color === "rgba(0, 0, 0, 0)" || color === "transparent"
        ? background(node.parentElement)
        : color;
    }
    return { fg: getComputedStyle(e).color, bg: background(e) };
  });
  const rgb = (value) =>
    value
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number);
  const a = lum(rgb(colors.fg)),
    b = lum(rgb(colors.bg));
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  contrasts.push({
    mode,
    name,
    state,
    ratio: Number(ratio.toFixed(2)),
    minimum,
    passed: ratio >= minimum,
  });
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
  });
  const context = await browser.newContext({ colorScheme: "light" });
  context.on("page", (p) => {
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    p.on("request", (r) => {
      if (!r.url().startsWith(base)) external.push(r.url());
      if (!["GET", "HEAD"].includes(r.method()))
        writes.push({ url: r.url(), method: r.method() });
    });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const button = (name) => page.getByRole("button", { name, exact: true });
  const activeName = () =>
    page.evaluate(() => document.activeElement?.textContent?.trim());
  try {
    await check(
      "UI preview is real HTTP 200, labelled and excluded from indexing",
      async () => {
        const response = await page.goto(base + "ui-preview");
        await page.waitForFunction(
          () => !document.querySelector("#appearance").disabled,
        );
        assert(response.status() === 200, "HTTP status");
        assert((await page.locator("h1").count()) === 1, "Heading count");
        assert(
          (
            await page.locator("meta[name=robots]").getAttribute("content")
          ).includes("noindex"),
          "Index policy",
        );
      },
    );
    await check(
      "Default action buttons do not submit; disabled/busy semantics are native",
      async () => {
        assert(
          (await button("Start learning").getAttribute("type")) === "button",
          "Accidental submit default",
        );
        assert(
          await button("Unavailable").isDisabled(),
          "Disabled action enabled",
        );
        const busy = button("Saving example…");
        assert(
          (await busy.isDisabled()) &&
            (await busy.getAttribute("aria-busy")) === "true",
          "Busy state",
        );
        for (const name of [
          "Start learning",
          "Explore courses",
          "View syllabus",
          "Delete draft",
        ]) {
          await button(name).click();
          assert(
            (await page
              .getByRole("status")
              .filter({ hasText: "Local action preview" })
              .count()) === 1,
            "Feedback missing",
          );
        }
      },
    );
    await check(
      "Empty form reports and associates errors, then focuses the first invalid field",
      async () => {
        await button("Check example").click();
        await page.locator("form").getByRole("alert").waitFor();
        assert(
          (await page.locator("form").getByRole("alert").count()) === 1,
          "No error summary",
        );
        for (const label of ["Your name", "Email address", "Study goal"]) {
          const input = page.getByLabel(label, { exact: false });
          assert(
            (await input.getAttribute("aria-invalid")) === "true",
            label + " not invalid",
          );
          const ids = (await input.getAttribute("aria-describedby")).split(" ");
          for (const id of ids)
            assert(
              (await page.locator(`[id="${id}"]`).count()) === 1,
              "Broken field reference",
            );
        }
        await page.waitForFunction(
          () => document.activeElement?.getAttribute("name") === "fullName",
        );
      },
    );
    await check(
      "Email correction and valid local form recover without a request",
      async () => {
        await page.getByLabel("Your name", { exact: false }).fill("अनया Rao");
        await page
          .getByLabel("Email address", { exact: false })
          .fill("invalid");
        await page
          .getByLabel("Study goal", { exact: false })
          .selectOption("exam");
        await button("Check example").click();
        assert(
          (await page
            .getByLabel("Email address", { exact: false })
            .getAttribute("aria-invalid")) === "true",
          "Invalid email accepted",
        );
        await page
          .getByLabel("Email address", { exact: false })
          .fill("learner@example.com");
        await page
          .getByLabel("Study note", { exact: true })
          .fill("Focus on fractions.\nफिर अभ्यास करें।");
        await button("Check example").click();
        await page
          .getByRole("status")
          .filter({ hasText: "No data was sent or saved." })
          .waitFor();
        assert(
          (await page.locator("form").getByRole("alert").count()) === 0,
          "Old errors retained",
        );
        assert(
          (await page
            .getByRole("status")
            .filter({ hasText: "No data was sent or saved." })
            .count()) === 1,
          "Success absent",
        );
      },
    );
    await check(
      "Checkbox keyboard interaction and native read-only/disabled fields work",
      async () => {
        const c = page.getByRole("checkbox", {
          name: "Show learning reminders in this example",
        });
        await c.focus();
        await page.keyboard.press("Space");
        assert(await c.isChecked(), "Space did not toggle");
        assert(
          await page.getByLabel("Disabled example").isDisabled(),
          "Disabled input",
        );
        assert(
          (await page
            .getByLabel("Read-only example")
            .getAttribute("readonly")) !== null,
          "Read-only input",
        );
      },
    );
    await check(
      "Form reset clears fields, errors and success feedback",
      async () => {
        await button("Reset form").click();
        await page
          .getByRole("status")
          .filter({ hasText: "No data was sent or saved." })
          .waitFor({ state: "hidden" });
        assert(
          (await page
            .getByLabel("Your name", { exact: false })
            .inputValue()) === "",
          "Name retained",
        );
        assert(
          (await page.locator("form").getByRole("alert").count()) === 0,
          "Error retained",
        );
        assert(
          (await page
            .getByRole("status")
            .filter({ hasText: "No data was sent or saved." })
            .count()) === 0,
          "Success retained",
        );
      },
    );
    await check(
      "Tabs have linked panels, roving focus, arrows/Home/End and disabled skipping",
      async () => {
        const learn = page.getByRole("tab", { name: "Learn", exact: true });
        await learn.focus();
        await page.keyboard.press("ArrowRight");
        assert((await activeName()) === "Practice", "Next tab focus");
        await page.keyboard.press("End");
        assert(
          (await activeName()) === "Notes",
          "Disabled last tab not skipped",
        );
        await page.keyboard.press("ArrowRight");
        assert((await activeName()) === "Learn", "Wrapping");
        await page.keyboard.press("ArrowLeft");
        assert((await activeName()) === "Notes", "Reverse wrapping");
        await page.keyboard.press("Home");
        assert((await activeName()) === "Learn", "Home");
        const tabs = page.getByRole("tab");
        assert(
          (await page.locator("[role=tab][aria-selected=true]").count()) === 1,
          "Selected tab count",
        );
        assert(
          (await page.locator('[role=tab][tabindex="0"]').count()) === 1,
          "Roving tabindex",
        );
        assert(
          (await page.locator("[role=tabpanel]:visible").count()) === 1,
          "Panel visibility",
        );
        for (const tab of await tabs.all()) {
          const id = await tab.getAttribute("aria-controls");
          assert(
            (await page.locator(`[id="${id}"]`).count()) === 1,
            "Panel link",
          );
        }
      },
    );
    await check("Hidden tab content retains local form input", async () => {
      await page.getByRole("tab", { name: "Notes", exact: true }).click();
      await page.getByLabel("Tab note").fill("Keep this note");
      await page.getByRole("tab", { name: "Learn", exact: true }).click();
      await page.getByRole("tab", { name: "Notes", exact: true }).click();
      assert(
        (await page.getByLabel("Tab note").inputValue()) === "Keep this note",
        "Input lost",
      );
    });
    for (const [trigger, title, last] of [
      ["Open dialog", "Review example", "Cancel"],
      ["Open drawer", "Study checklist", "Done"],
    ]) {
      await check(
        title +
          ": focus contained, background inert, Escape restores focus/scroll",
        async () => {
          await button(trigger).click();
          const dialog = page.getByRole("dialog", { name: title });
          await dialog.waitFor();
          assert(
            await dialog
              .getByRole("button", { name: "Close", exact: true })
              .evaluate((e) => e === document.activeElement),
            "Initial focus",
          );
          assert(
            (await page.evaluate(() => document.body.style.overflow)) ===
              "hidden",
            "Scroll not locked",
          );
          await button("Start learning").evaluate((e) => e.focus());
          assert(
            await dialog.evaluate((e) => e.contains(document.activeElement)),
            "Background focus escaped",
          );
          await dialog
            .getByRole("button", { name: "Close", exact: true })
            .focus();
          await page.keyboard.press("Shift+Tab");
          assert((await activeName()) === last, "Reverse trap");
          await page.keyboard.press("Tab");
          assert((await activeName()) === "Close", "Forward trap");
          await page.keyboard.press("Escape");
          await dialog.waitFor({ state: "hidden" });
          assert(
            await button(trigger).evaluate((e) => e === document.activeElement),
            "Trigger focus not restored",
          );
          assert(
            (await page.evaluate(() => document.body.style.overflow)) === "",
            "Scroll not restored",
          );
        },
      );
      await check(
        title + ": visible close and repeated opening remain synchronized",
        async () => {
          for (let i = 0; i < 2; i++) {
            await button(trigger).click();
            const dialog = page.getByRole("dialog", { name: title });
            await dialog
              .getByRole("button", { name: "Close", exact: true })
              .click();
            await dialog.waitFor({ state: "hidden" });
          }
          assert(
            (await page.locator("dialog[open]").count()) === 0,
            "Layer stuck open",
          );
        },
      );
    }
    await check(
      "Dialog confirmation and drawer Done close through controlled state",
      async () => {
        await button("Open dialog").click();
        await page
          .getByLabel("Example note", { exact: true })
          .fill("Local note");
        await page
          .getByRole("dialog")
          .getByRole("button", { name: "Confirm preview" })
          .click();
        await page.locator("dialog[open]").waitFor({ state: "hidden" });
        await button("Open drawer").click();
        await page
          .getByRole("dialog")
          .getByRole("button", { name: "Done", exact: true })
          .click();
        await page.locator("dialog[open]").waitFor({ state: "hidden" });
        assert(
          (await page.locator("dialog[open]").count()) === 0,
          "Drawer not closed",
        );
      },
    );
    const samples = [
      ["Start learning", 4.5],
      ["Explore courses", 4.5],
      ["View syllabus", 4.5],
      ["Delete draft", 4.5],
      ["Unavailable", 4.5],
    ];
    for (const mode of ["light", "dark"]) {
      await page.selectOption("#appearance", mode);
      await page.waitForFunction(
        (m) => document.documentElement.dataset.theme === m,
        mode,
      );
      await page.mouse.move(0, 0);
      for (const [name, min] of samples) {
        await contrast(button(name), mode, name, "rest", min);
      }
      await contrast(
        button("Saving example…"),
        mode,
        "Saving example…",
        "busy",
        4.5,
      );
      for (const [name, min] of samples.filter(
        ([name]) => name !== "Unavailable",
      )) {
        const action = button(name);
        await action.hover();
        await contrast(action, mode, name, "hover", min);
        await page.mouse.down();
        try {
          await contrast(action, mode, name, "pressed", min);
        } finally {
          await page.mouse.up();
        }
      }
      await page.mouse.move(0, 0);
      await check(
        mode + ": hover and keyboard focus stay visible",
        async () => {
          await button("Start learning").hover();
          assert(
            (await button("Start learning").evaluate(
              (e) => getComputedStyle(e).boxShadow,
            )) !== "none",
            "Hover missing",
          );
          await button("Start learning").focus();
          await page.keyboard.press("Tab");
          assert(
            (await button("Explore courses").evaluate(
              (e) => getComputedStyle(e).outlineWidth,
            )) === "3px",
            "Focus missing",
          );
        },
      );
      for (const width of [320, 360, 390, 768, 820, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await check(
          `${mode} ${width}px: viewport and responsive action targets`,
          async () => {
            assert(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
              "Page overflow",
            );
            for (const name of [
              "Start learning",
              "Explore courses",
              "Check example",
              "Open dialog",
              "Open drawer",
            ]) {
              const box = await button(name).boundingBox();
              assert(
                box.height >= (width < 768 ? 44 : 32) &&
                  box.width >= (width < 768 ? 44 : 32),
                "Small target: " + name,
              );
            }
            const geometry = await page.evaluate(() => {
              const intro = document.querySelector('section[aria-labelledby="studio-title"]').getBoundingClientRect();
              const name = document.querySelector('input[name="fullName"]');
              const email = document.querySelector('input[name="email"]');
              const label = document.querySelector(`label[for="${CSS.escape(name.id)}"]`);
              return {
                left: intro.left,
                right: innerWidth - intro.right,
                name: name.getBoundingClientRect().toJSON(),
                email: email.getBoundingClientRect().toJSON(),
                labelLeft: label.getBoundingClientRect().left,
                font: getComputedStyle(name).fontSize,
              };
            });
            assert(geometry.left <= 24.5 && geometry.right <= 24.5, "Excessive page gutters");
            assert(Math.abs(geometry.left - geometry.right) < 1, "Uneven page gutters");
            assert(Math.abs(geometry.name.x - geometry.labelLeft) < 1, "Label and input misaligned");
            if (width >= 1120) assert(Math.abs(geometry.name.y - geometry.email.y) < 1, "Paired inputs misaligned");
            if (width >= 768) {
              assert(geometry.name.height <= 33, "Desktop input remains bulky");
              assert(geometry.font === "13px", "Desktop field typography");
            }
          },
        );
        layoutMetrics.push(
          await page.evaluate(
            ({ mode, width }) => ({
              mode,
              width,
              pageHeight: document.documentElement.scrollHeight,
              heroHeight: document
                .querySelector('section[aria-labelledby="studio-title"]')
                .getBoundingClientRect().height,
              actionHeight: [...document.querySelectorAll("button")]
                .find((e) => e.textContent === "Start learning")
                ?.getBoundingClientRect().height,
            }),
            { mode, width },
          ),
        );
        if ([390, 768, 1024, 1440].includes(width)) {
          await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
          await capture(page, `${mode}-${width}`, { fullPage: true });
        }
      }
      await page.setViewportSize({ width: 900, height: 900 });
      await page.mouse.move(0, 0);
      await page.evaluate(() => document.activeElement?.blur());
      const actionCard = page.getByRole("region", {
        name: "Make your next move",
      });
      await actionCard.scrollIntoViewIfNeeded();
      for (const state of ["rest", "hover", "pressed"]) {
        if (state !== "rest") await button("Start learning").hover();
        if (state === "pressed") await page.mouse.down();
        try {
          await button("Start learning").evaluate(async (e) => {
            await Promise.all(
              e.getAnimations().map((a) => a.finished.catch(() => {})),
            );
          });
          const rel = `docs/design/previews/shared-ui/buttons-${mode}-${state}.png`;
          await actionCard.screenshot({ path: rel });
          captures.push({
            path: rel,
            sha256: sha(rel),
            visually_reviewed: false,
          });
        } finally {
          if (state === "pressed") await page.mouse.up();
        }
      }
      await page.mouse.move(0, 0);
      await page.setViewportSize({ width: 1440, height: 900 });
      await button("Open dialog").click();
      await check(mode + ": compact desktop dialog and aligned header", async () => {
        const dialog = page.getByRole("dialog", { name: "Review example" });
        const box = await dialog.boundingBox();
        const title = await dialog.getByRole("heading").boundingBox();
        const close = await dialog.getByRole("button", { name: "Close", exact: true }).boundingBox();
        assert(box.width <= 441, "Dialog exceeds compact width");
        assert(Math.abs(title.y + title.height / 2 - close.y - close.height / 2) < 1, "Modal title/close misaligned");
      });
      await capture(page, `dialog-${mode}-1440`);
      await page.keyboard.press("Escape");
      await page.setViewportSize({ width: 390, height: 900 });
      await button("Open dialog").click();
      await capture(page, `dialog-${mode}-390`);
      await page.keyboard.press("Escape");
      await button("Open drawer").click();
      await capture(page, `drawer-${mode}-390`);
      await page.keyboard.press("Escape");
      await check(
        mode + ": text zoom reflows without page overflow",
        async () => {
          await page.setViewportSize({ width: 320, height: 900 });
          await page.evaluate(
            () => (document.documentElement.style.fontSize = "200%"),
          );
          try {
            assert(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
              "Zoom overflow",
            );
          } finally {
            await page.evaluate(() =>
              document.documentElement.style.removeProperty("font-size"),
            );
          }
        },
      );
      await check(
        mode +
          ": modal fits narrow landscape viewport with a usable close action",
        async () => {
          await page.setViewportSize({ width: 640, height: 360 });
          await button("Open dialog").click();
          const d = page.getByRole("dialog", { name: "Review example" });
          const b = await d.boundingBox();
          assert(
            b.x >= 0 &&
              b.y >= 0 &&
              b.x + b.width <= 641 &&
              b.y + b.height <= 361,
            "Clipped dialog",
          );
          await d.getByRole("button", { name: "Close", exact: true }).click();
        },
      );
    }
    await check(
      "All observed button contrast pairs and interaction states pass",
      async () =>
        assert(
          contrasts.every((p) => p.passed),
          "Contrast failure",
        ),
    );
    await check(
      "Reduced motion stops spinner and skeleton animations",
      async () => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        const motions = await page
          .locator("[aria-busy=true] span, [aria-hidden=true] span")
          .evaluateAll((es) =>
            es.map((e) => getComputedStyle(e).animationName),
          );
        assert(
          motions.length && motions.every((n) => n === "none"),
          "Animation retained",
        );
      },
    );
    await check(
      "Touch tablets in both themes retain readable controls and usable modal layers",
      async () => {
        const touch = await browser.newContext({
          viewport: { width: 1024, height: 900 },
          hasTouch: true,
          isMobile: true,
        });
        try {
          const p = await touch.newPage();
          await p.goto(base + "ui-preview");
          await p.waitForFunction(
            () => !document.querySelector("#appearance").disabled,
          );
          const action = p.getByRole("button", {
            name: "Start learning",
            exact: true,
          });
          for (const mode of ["light", "dark"]) {
            await p.locator("#appearance").selectOption(mode);
            for (const width of [768, 1024]) {
              await p.setViewportSize({ width, height: width === 768 ? 1024 : 768 });
              await p.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
              assert(await p.evaluate(() => matchMedia('(pointer: coarse)').matches), "Tablet lost touch media emulation");
              assert((await action.boundingBox()).height >= 44, "Small touch action");
              assert((await p.getByLabel("Your name", { exact: false }).evaluate((e) => getComputedStyle(e).fontSize)) === "16px", "Touch input text too small");
              assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Tablet page overflow");
              // Viewport capture preserves touch emulation during screenshots in this Chrome build.
              await capture(p, `tablet-${mode}-${width}`);
              for (const kind of ["dialog", "drawer"]) {
                await p.getByRole("button", { name: `Open ${kind}`, exact: true }).click();
                const layer = p.getByRole("dialog");
                const box = await layer.boundingBox();
                assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= width + 1, "Tablet modal clipped");
                await layer.getByRole("button", { name: "Close", exact: true }).click();
                assert(await p.getByRole("button", { name: `Open ${kind}`, exact: true }).evaluate((e) => e === document.activeElement), "Tablet focus restoration");
              }
            }
          }
        } finally {
          await touch.close();
        }
      },
    );
    await check("Sample form/actions never issue a write request", async () =>
      assert(writes.length === 0, "Unexpected write request"),
    );
  } catch (error) {
    checks.push({
      name: "Suite completion",
      passed: false,
      error: error.message,
    });
  } finally {
    const report = {
      checked_at_utc: new Date().toISOString(),
      browser: browser.version(),
      url: base + "ui-preview",
      scope:
        "Production HTTP; Chrome keyboard/viewport/media emulation, not physical-device or screen-reader certification",
      checks,
      contrasts,
      layout_metrics: layoutMetrics,
      page_errors: errors,
      external_requests: external,
      write_requests: writes,
      captures,
      source_sha256: {},
      passed:
        checks.every((c) => c.passed) &&
        contrasts.every((c) => c.passed) &&
        !errors.length &&
        !external.length &&
        !writes.length,
    };
    for (const dir of [
      "apps/web/src/components/ui",
      "apps/web/src/app/(public)/ui-preview",
    ])
      for (const file of fs.readdirSync(dir)) {
        const rel = dir + "/" + file;
        if (/\.(tsx?|css)$/.test(file))
          report.source_sha256[rel] = sha(path.join(root, rel));
      }
    for (const rel of [
      "apps/web/src/styles/tokens.css",
      "apps/web/src/app/(public)/page.tsx",
      "apps/web/package-lock.json",
      "tools/frontend/verify-ui.cjs",
    ])
      report.source_sha256[rel] = sha(path.join(root, rel));
    fs.writeFileSync(
      "docs/design/SHARED-UI-CHECKS.json",
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(
      JSON.stringify({
        passed: report.passed,
        checks: checks.length,
        contrasts: contrasts.length,
        failed: checks.filter((c) => !c.passed),
        errors,
        external,
        writes,
      }),
    );
    await browser.close();
    if (!report.passed) process.exitCode = 1;
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
