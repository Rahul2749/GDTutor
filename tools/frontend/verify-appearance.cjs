// Run from the repository root with PLAYWRIGHT_MODULE and CHROME_PATH configured.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000/";
const root = process.cwd();
const reportPath =
  process.env.APPEARANCE_REPORT || "docs/design/APPEARANCE-CHECKS.json";
const captureDirectory =
  process.env.APPEARANCE_CAPTURE_DIR || "docs/design/previews/theme-foundation";
const designTokens = JSON.parse(
  fs.readFileSync("docs/design/UI-DESIGN-TOKENS.json", "utf8"),
);
const expectedDarkCanvas =
  "rgb(" +
  designTokens.palette.canvas.dark
    .slice(1)
    .match(/../g)
    .map((v) => parseInt(v, 16))
    .join(", ") +
  ")";
const key = "gdtutor.appearance";
const sha = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const checks = [],
  contrasts = [],
  errors = [],
  external = [],
  captures = [];
const assert = (condition, message) => {
  if (!condition) throw Error(message);
};
async function check(name, action) {
  try {
    await action();
    checks.push({ name, passed: true });
  } catch (e) {
    checks.push({ name, passed: false, error: e.message });
  }
}
async function theme(page, expected) {
  await page.waitForFunction(
    (t) => document.documentElement.dataset.theme === t,
    expected,
  );
}
async function ready(page) {
  await page.locator("#appearance").waitFor();
  await page.waitForFunction(
    () => !document.querySelector("#appearance").disabled,
  );
}
async function choose(page, value) {
  await ready(page);
  await page.selectOption("#appearance", value);
}
async function inspect(page) {
  return page.evaluate(() => {
    const s = getComputedStyle(document.documentElement),
      c = document.querySelector("#appearance").getBoundingClientRect();
    const names = [
      "canvas",
      "surface",
      "raised",
      "ink",
      "muted",
      "line",
      "control",
      "primary",
      "on-primary",
      "primary-soft",
      "secondary",
      "secondary-soft",
      "highlight",
      "highlight-soft",
      "focus",
      "success",
      "success-soft",
      "danger",
      "danger-soft",
      "disabled-ink",
      "disabled-surface",
    ];
    return {
      colors: Object.fromEntries(
        names.map((n) => [n, s.getPropertyValue("--color-" + n).trim()]),
      ),
      overflow: document.documentElement.scrollWidth > innerWidth,
      control: c.height,
      controlWidth: c.width,
      theme: document.documentElement.dataset.theme,
      colorScheme: s.colorScheme,
    };
  });
}
function normalize(hex) {
  const s = hex.trim().toLowerCase();
  return s.length === 4
    ? "#" +
        s
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")
    : s;
}
function luminance(hex) {
  hex = normalize(hex);
  const c = hex
    .replace("#", "")
    .match(/../g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function ratio(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
  });
  const context = await browser.newContext({ colorScheme: "dark" });
  context.on("page", (p) => {
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    p.on("request", (r) => {
      if (!r.url().startsWith(base)) external.push(r.url());
    });
  });
  const page = await context.newPage();
  try {
    await check(
      "Fresh visit uses System and the device dark palette",
      async () => {
        const response = await page.goto(base);
        assert(response.status() === 200, "Root HTTP status");
        await ready(page);
        await theme(page, "dark");
        assert(
          (await page.inputValue("#appearance")) === "system",
          "Initial preference",
        );
        assert(
          (await page.evaluate((k) => localStorage.getItem(k), key)) === null,
          "No forced explicit preference",
        );
      },
    );
    await check(
      "Explicit Light persists after reload and overrides device changes",
      async () => {
        await choose(page, "light");
        await theme(page, "light");
        await page.reload();
        await ready(page);
        await theme(page, "light");
        await page.emulateMedia({ colorScheme: "light" });
        await page.emulateMedia({ colorScheme: "dark" });
        await theme(page, "light");
        assert(
          (await page.inputValue("#appearance")) === "light",
          "Reload selection",
        );
      },
    );
    await check(
      "System responds live to dark and light device changes",
      async () => {
        await choose(page, "system");
        await theme(page, "dark");
        await page.emulateMedia({ colorScheme: "light" });
        await theme(page, "light");
        await page.emulateMedia({ colorScheme: "dark" });
        await theme(page, "dark");
      },
    );
    await check(
      "New page and cross-tab changes share the saved preference",
      async () => {
        const other = await context.newPage();
        await other.goto(base);
        await ready(other);
        await choose(other, "dark");
        await theme(page, "dark");
        await page.waitForFunction(
          () => document.querySelector("#appearance").value === "dark",
        );
        await choose(other, "light");
        await theme(page, "light");
        await other.close();
      },
    );
    await check(
      "Clearing or removing the preference in another tab restores System",
      async () => {
        const other = await context.newPage();
        await other.goto(base);
        await ready(other);
        await choose(other, "light");
        await other.evaluate((k) => localStorage.removeItem(k), key);
        await theme(page, "dark");
        await page.waitForFunction(
          () => document.querySelector("#appearance").value === "system",
        );
        await choose(other, "light");
        await theme(page, "light");
        await other.evaluate(() => localStorage.clear());
        await theme(page, "dark");
        await other.close();
      },
    );
    await check(
      "Invalid stored values fall back to System without script errors",
      async () => {
        await page.evaluate(
          (k) => localStorage.setItem(k, "invalid-preference"),
          key,
        );
        await page.reload();
        await ready(page);
        await theme(page, "dark");
        assert(
          (await page.inputValue("#appearance")) === "system",
          "Invalid preference accepted",
        );
      },
    );
    await check(
      "Keyboard can focus and change the native appearance selector",
      async () => {
        await page.reload();
        await ready(page);
        await page.keyboard.press("Tab");
        assert(
          await page
            .locator("#appearance")
            .evaluate((e) => e === document.activeElement),
          "Keyboard focus",
        );
        const outline = await page
          .locator("#appearance")
          .evaluate((e) => getComputedStyle(e).outlineWidth);
        assert(parseFloat(outline) >= 3, "Focus outline missing");
        await page.keyboard.press("Home");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        await theme(page, "dark");
        assert(
          (await page.inputValue("#appearance")) === "dark",
          "Keyboard selection",
        );
      },
    );
    const palette = designTokens.palette;
    const mapping = {
      canvas: "canvas",
      surface: "surface",
      raised: "raised",
      ink: "ink",
      muted: "muted",
      line: "line",
      control: "control",
      primary: "primary",
      "on-primary": "on-primary",
      "primary-soft": "soft-primary",
      secondary: "teal",
      "secondary-soft": "soft-teal",
      highlight: "amber",
      "highlight-soft": "soft-amber",
    };
    for (const mode of ["light", "dark"]) {
      await choose(page, mode);
      await theme(page, mode);
      const state = await inspect(page);
      await check(
        mode + " semantic palette matches the current Compact Blue proposal",
        async () => {
          for (const [token, source] of Object.entries(mapping))
            assert(
              normalize(state.colors[token]) ===
                normalize(palette[source][mode]),
              token + " mismatch",
            );
          assert(state.colorScheme === mode, "Native color scheme");
        },
      );
      for (const [fg, bg, min] of [
        ["ink", "canvas", 4.5],
        ["ink", "surface", 4.5],
        ["ink", "raised", 4.5],
        ["muted", "canvas", 4.5],
        ["muted", "surface", 4.5],
        ["muted", "raised", 4.5],
        ["primary", "surface", 4.5],
        ["primary", "primary-soft", 4.5],
        ["on-primary", "primary", 4.5],
        ["secondary", "secondary-soft", 4.5],
        ["highlight", "highlight-soft", 4.5],
        ["success", "success-soft", 4.5],
        ["danger", "danger-soft", 4.5],
        ["disabled-ink", "disabled-surface", 4.5],
        ["control", "surface", 3],
        ["focus", "surface", 3],
        ["focus", "canvas", 3],
      ]) {
        const value = ratio(state.colors[fg], state.colors[bg]);
        contrasts.push({
          mode,
          foreground: fg,
          background: bg,
          ratio: Number(value.toFixed(2)),
          minimum: min,
          passed: value >= min,
        });
      }
      for (const width of [320, 360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await check(
          `${mode} at ${width}px: no overflow and responsive control target`,
          async () => {
            const s = await inspect(page);
            assert(!s.overflow, "Horizontal overflow");
            assert(
              s.control >= (width < 768 ? 44 : 32) &&
                s.controlWidth >= (width < 768 ? 44 : 32),
              "Small control",
            );
          },
        );
        if (width === 390 || width === 1440) {
          const rel = `${captureDirectory}/${mode}-${width}.png`;
          fs.mkdirSync(path.dirname(rel), { recursive: true });
          await page.screenshot({ path: rel, fullPage: true });
          captures.push({
            path: rel,
            sha256: sha(rel),
            visually_reviewed: false,
          });
        }
      }
      await page.setViewportSize({ width: 320, height: 900 });
      await check(
        mode + " with 200% base text size at 320px reflows",
        async () => {
          await page.evaluate(
            () => (document.documentElement.style.fontSize = "200%"),
          );
          try {
            assert(!(await inspect(page)).overflow, "Zoom overflow");
          } finally {
            await page.evaluate(() =>
              document.documentElement.style.removeProperty("font-size"),
            );
          }
        },
      );
    }
    await check(
      "All 34 observed opaque token contrast pairs meet their targets",
      async () =>
        assert(
          contrasts.every((c) => c.passed),
          "Contrast failure",
        ),
    );
    await check(
      "Reduced motion and forced-colors keep focus usable",
      async () => {
        await page.emulateMedia({
          reducedMotion: "reduce",
          forcedColors: "active",
        });
        await page.locator("#appearance").focus();
        const state = await page.evaluate(() => {
          const e = document.createElement("div");
          e.style.transition = "opacity 2s";
          document.body.append(e);
          const duration = getComputedStyle(e).transitionDuration;
          e.remove();
          return {
            reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
            duration,
            outline: getComputedStyle(document.querySelector("#appearance"))
              .outlineStyle,
          };
        });
        assert(
          state.reduced && parseFloat(state.duration) < 0.001,
          "Reduced motion override",
        );
        assert(state.outline !== "none", "Forced color focus missing");
        await page.emulateMedia({
          reducedMotion: "no-preference",
          forcedColors: "none",
        });
      },
    );
    await check(
      "Saved Dark applies before hydration with application bundles blocked",
      async () => {
        const early = await browser.newContext({ colorScheme: "light" });
        await early.addInitScript((k) => localStorage.setItem(k, "dark"), key);
        const p = await early.newPage();
        await p.route("**/_next/static/**/*.js", (r) => r.abort());
        await p.goto(base, { waitUntil: "domcontentloaded" });
        await theme(p, "dark");
        const s = await p.evaluate(() => ({
          background: getComputedStyle(document.body).backgroundColor,
          disabled: document.querySelector("#appearance").disabled,
        }));
        assert(
          s.background === expectedDarkCanvas && s.disabled,
          "Bootstrap depended on hydration",
        );
        await early.close();
      },
    );
    await check(
      "Blocked storage uses System then allows a temporary explicit choice",
      async () => {
        const blocked = await browser.newContext({ colorScheme: "dark" });
        await blocked.addInitScript(() =>
          Object.defineProperty(window, "localStorage", {
            get() {
              throw new DOMException("Blocked", "SecurityError");
            },
          }),
        );
        const p = await blocked.newPage();
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(base);
        await ready(p);
        await theme(p, "dark");
        await choose(p, "light");
        await theme(p, "light");
        assert(
          (await p.locator("[role=status]").textContent()).includes(
            "this visit",
          ),
          "Missing persistence feedback",
        );
        await p.reload();
        await ready(p);
        await theme(p, "dark");
        await blocked.close();
      },
    );
    await check(
      "Write failure overrides an old stored value for the current visit",
      async () => {
        const quota = await browser.newContext({ colorScheme: "light" });
        await quota.addInitScript((k) => {
          localStorage.setItem(k, "dark");
          Storage.prototype.setItem = function () {
            throw new DOMException("Full", "QuotaExceededError");
          };
        }, key);
        const p = await quota.newPage();
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(base);
        await ready(p);
        await theme(p, "dark");
        await choose(p, "light");
        await theme(p, "light");
        assert(
          (await p.inputValue("#appearance")) === "light",
          "Old value won",
        );
        await quota.close();
      },
    );
    await check(
      "No-JavaScript rendering follows the dark device palette",
      async () => {
        const nojs = await browser.newContext({
          javaScriptEnabled: false,
          colorScheme: "dark",
        });
        const p = await nojs.newPage();
        await p.goto(base);
        assert(
          (await p
            .locator("body")
            .evaluate((e) => getComputedStyle(e).backgroundColor)) ===
            expectedDarkCanvas,
          "No-script CSS fallback",
        );
        assert(
          await p.locator("#appearance").isDisabled(),
          "Inactive control misleading",
        );
        await nojs.close();
      },
    );
  } finally {
    const report = {
      checked_at_utc: new Date().toISOString(),
      browser: browser.version(),
      base_url: base,
      mode: "Actual production HTTP; Chrome viewport/media emulation, not real device or screen-reader certification",
      checks,
      contrasts,
      page_errors: errors,
      external_requests: external,
      captures,
      source_sha256: {},
      passed:
        checks.every((c) => c.passed) &&
        contrasts.every((c) => c.passed) &&
        !errors.length &&
        !external.length,
    };
    for (const rel of [
      "apps/web/src/lib/appearance.ts",
      "apps/web/src/components/appearance/appearance-select.tsx",
      "apps/web/src/components/appearance/appearance-select.module.css",
      "apps/web/src/styles/tokens.css",
      "apps/web/src/styles/globals.css",
      "apps/web/src/app/layout.tsx",
      "apps/web/src/app/(public)/page.tsx",
      "apps/web/src/app/(public)/page.module.css",
      "docs/design/UI-DESIGN-TOKENS.json",
      "apps/web/package-lock.json",
      "tools/frontend/verify-appearance.cjs",
    ])
      report.source_sha256[rel] = sha(path.join(root, rel));
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
    console.log(
      JSON.stringify({
        passed: report.passed,
        checks: checks.length,
        contrasts: contrasts.length,
        failures: checks.filter((c) => !c.passed),
        contrastFailures: contrasts.filter((c) => !c.passed),
        errors,
        external,
      }),
    );
    await browser.close();
    if (!report.passed) process.exitCode = 1;
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
