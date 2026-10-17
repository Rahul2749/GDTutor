'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AppearanceSelect } from '@/components/appearance/appearance-select';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  LoadingState,
  Modal,
  Notice,
  SelectField,
  Tabs,
  TextAreaField,
  TextField,
} from '@/components/ui';
import styles from './preview.module.css';

type Errors = { fullName?: string; email?: string; goal?: string };

function ActionIcon({ kind }: { kind: 'arrow' | 'book' | 'trash' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {kind === 'arrow' ? (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      ) : kind === 'book' ? (
        <>
          <path d="M12 5v15M3 4h4a7 7 0 0 1 5 2 7 7 0 0 1 5-2h4v15h-4a7 7 0 0 0-5 2 7 7 0 0 0-5-2H3Z" />
        </>
      ) : (
        <>
          <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
        </>
      )}
    </svg>
  );
}

export function UIPlayground() {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [valid, setValid] = useState(false);
  const [tab, setTab] = useState('learn');
  const [layer, setLayer] = useState<'dialog' | 'drawer' | null>(null);

  function checkForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem('fullName') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const goal = form.elements.namedItem('goal') as HTMLSelectElement;
    const next: Errors = {};
    if (!name.value.trim()) next.fullName = 'Enter your name.';
    if (!email.validity.valid) next.email = 'Enter a valid email address.';
    if (!goal.value) next.goal = 'Choose a study goal.';
    setErrors(next);
    setValid(Object.keys(next).length === 0);
    if (Object.keys(next).length)
      window.requestAnimationFrame(() =>
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="GD Tutor theme preview"
        >
          <span className={styles.brandMark} aria-hidden="true">
            <ActionIcon kind="book" />
          </span>
          gd<span>tutor</span>
          <span className={styles.brandDot} aria-hidden="true">
            .
          </span>
        </Link>
        <div className={styles.headerTools}>
          <span className={styles.previewTag}>Design preview</span>
          <AppearanceSelect compact />
        </div>
      </header>
      <section className={styles.hero} aria-labelledby="studio-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>LEARN / PRACTICE / PROGRESS</p>
          <h1 id="studio-title" className={styles.title}>
            A clearer space to learn.
          </h1>
          <p className={styles.intro}>
            Your courses, questions and next steps. More focus, less clutter.
          </p>
        </div>
        <a className={styles.heroLink} href="#components">
          Explore the workspace <span aria-hidden="true">→</span>
        </a>
      </section>
      <div className={styles.sectionIntro} id="components">
        <h2>Workspace essentials</h2>
        <p>Interactive design samples</p>
      </div>
      <div className={styles.grid}>
        <Card
          title="Make your next move"
          description="Clear priorities for everyday actions."
        >
          <div className={styles.stack}>
            <div className={styles.actions}>
              <Button
                trailingIcon={<ActionIcon kind="arrow" />}
                onClick={() => setMessage('Start learning previewed.')}
              >
                Start learning
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<ActionIcon kind="book" />}
                onClick={() => setMessage('Explore courses selected.')}
              >
                Explore courses
              </Button>
              <Button
                variant="quiet"
                onClick={() => setMessage('View syllabus selected.')}
              >
                View syllabus
              </Button>
              <Button
                variant="danger"
                leadingIcon={<ActionIcon kind="trash" />}
                onClick={() => setMessage('Remove action previewed.')}
              >
                Delete draft
              </Button>
            </div>
            <div className={styles.actions}>
              <Button disabled>Unavailable</Button>
              <Button busy busyLabel="Saving example…">
                Save example
              </Button>
            </div>
            {message && (
              <Notice live tone="info" title="Local action preview">
                {message}
              </Notice>
            )}
          </div>
        </Card>

        <Card
          title="Make it yours"
          description="A simple form with clear labels and useful feedback."
        >
          <form
            noValidate
            onSubmit={checkForm}
            onReset={() => {
              setErrors({});
              setValid(false);
            }}
            className={styles.stack}
          >
            {!!Object.keys(errors).length && (
              <Notice live tone="error" title="Check the highlighted fields">
                Correct the errors, then try again.
              </Notice>
            )}
            {valid && (
              <Notice live tone="success" title="Example checked">
                The form is valid. No data was sent or saved.
              </Notice>
            )}
            <div className={styles.fieldRow}>
              <TextField
                placeholder="What should we call you?"
                label="Your name"
                name="fullName"
                autoComplete="name"
                required
                maxLength={80}
                hint="Use any sample name for this preview."
                {...(errors.fullName ? { error: errors.fullName } : {})}
              />
              <TextField
                placeholder="you@example.com"
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                {...(errors.email ? { error: errors.email } : {})}
              />
            </div>
            <SelectField
              label="Study goal"
              name="goal"
              required
              defaultValue=""
              {...(errors.goal ? { error: errors.goal } : {})}
            >
              <option value="">Choose a goal</option>
              <option value="foundation">Build a strong foundation</option>
              <option value="exam">Prepare for an exam</option>
            </SelectField>
            <TextAreaField
              placeholder="A goal, a question, a little inspiration…"
              label="Study note"
              name="note"
              rows={2}
              maxLength={500}
              hint="Optional. Keep this preview free of personal information."
            />
            <Checkbox
              label="Show learning reminders in this example"
              name="reminders"
              hint="This checkbox is a local UI sample."
            />
            <div className={styles.actions}>
              <Button type="submit">Check example</Button>
              <Button type="reset" variant="quiet">
                Reset form
              </Button>
            </div>
            <div className={styles.fieldRow}>
              <TextField
                label="Read-only example"
                value="Preview learner"
                readOnly
              />
              <TextField
                label="Disabled example"
                value="Unavailable"
                disabled
              />
            </div>
          </form>
        </Card>

        <Card
          title="A little more clarity"
          description="Keyboard-friendly tabs and focused modal layers."
        >
          <Tabs
            label="Preview sections"
            value={tab}
            onValueChange={setTab}
            items={[
              {
                id: 'learn',
                label: 'Learn',
                content: (
                  <p className={styles.copy}>
                    A calm place for lesson content. Use Left/Right, Home and
                    End to move between tabs.
                  </p>
                ),
              },
              {
                id: 'practice',
                label: 'Practice',
                content: (
                  <p className={styles.copy}>
                    Practice content stays grouped and easy to scan.
                  </p>
                ),
              },
              {
                id: 'notes',
                label: 'Notes',
                content: (
                  <TextAreaField
                    label="Tab note"
                    hint="Switching tabs keeps your local input."
                  />
                ),
              },
              {
                id: 'later',
                label: 'Coming soon',
                disabled: true,
                content: null,
              },
            ]}
          />
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setLayer('dialog')}>
              Open dialog
            </Button>
            <Button variant="secondary" onClick={() => setLayer('drawer')}>
              Open drawer
            </Button>
          </div>
        </Card>

        <Card
          title="Here for every moment"
          description="Clear guidance, small wins and a helpful next step."
        >
          <div className={styles.feedbackGrid}>
            <div className={styles.actions}>
              <Badge>Draft</Badge>
              <Badge tone="success">Ready</Badge>
              <Badge tone="warning">Needs review</Badge>
            </div>
            <Notice title="A little guidance">
              Hints help the next action feel clear.
            </Notice>
            <Notice tone="success" title="Ready to continue">
              This is a success-state example.
            </Notice>
            <Notice tone="warning" title="Review before continuing">
              This is a warning-state example.
            </Notice>
            <Notice tone="error" title="Something needs attention">
              This is an error-state example with recovery guidance.
            </Notice>
            <LoadingState label="Loading sample content…" />
            <EmptyState
              title="A fresh starting point"
              description="Nothing to show yet. A clear next action can help."
              action={
                <Button
                  variant="secondary"
                  onClick={() => setMessage('Create action previewed.')}
                >
                  Create sample
                </Button>
              }
            />
          </div>
        </Card>
      </div>

      <Modal
        open={layer === 'dialog'}
        onOpenChange={(open) => {
          if (!open) setLayer(null);
        }}
        title="Review example"
        description="Focus stays in this dialog. Close it with the button or Escape to return to the trigger."
      >
        <TextField label="Example note" hint="This is local preview input." />
        <div className={styles.actions}>
          <Button
            onClick={() => {
              setMessage('Dialog confirmed locally.');
              setLayer(null);
            }}
          >
            Confirm preview
          </Button>
          <Button variant="secondary" onClick={() => setLayer(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        kind="drawer"
        open={layer === 'drawer'}
        onOpenChange={(open) => {
          if (!open) setLayer(null);
        }}
        title="Study checklist"
        description="A drawer uses the same modal focus and dismissal behavior."
      >
        <Checkbox label="Review the lesson" />
        <Checkbox label="Try a practice question" />
        <Checkbox label="Write a short note" />
        <Notice title="Local preview">
          This checklist is a component example.
        </Notice>
        <Button onClick={() => setLayer(null)}>Done</Button>
      </Modal>
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>gdtutor.</span>
        <span>A focused space for learning.</span>
        <span>Design preview · Sample content</span>
      </footer>
    </main>
  );
}
