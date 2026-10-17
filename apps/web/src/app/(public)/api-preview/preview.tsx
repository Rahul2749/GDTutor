'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { AppearanceSelect } from '@/components/appearance/appearance-select';
import {
  Button,
  Card,
  LoadingState,
  Notice,
  SelectField,
  TextField,
} from '@/components/ui';
import { createApiClient } from '@/lib/api/client';
import { formatDateTime, formatMoney } from '@/lib/format';
import { focusFirstInvalid, mapFieldErrors } from '@/lib/forms';
import { useApiRequest } from '@/hooks/use-api-request';
import { decodeSample, mockTransport } from './mock-transport';
import type { SampleResponse } from './mock-transport';
import styles from './preview.module.css';

const client = createApiClient(mockTransport);

export function ApiPlayground() {
  const [scenario, setScenario] = useState('success');
  const request = useApiRequest<SampleResponse>();
  const submission = useApiRequest<SampleResponse>();
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();

  function load() {
    void request.run((signal) =>
      client.get(`/api/v1/preview/sample?scenario=${scenario}`, decodeSample, {
        signal,
        timeoutMs: scenario === 'timeout' ? 800 : 10000,
      }),
    );
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (submission.state.status === 'loading') return;
    submission.reset();
    if (title.trim().length < 3) {
      setTitleError('Enter at least three characters.');
      focusFirstInvalid(form);
      return;
    }
    setTitleError(undefined);
    const result = await submission.run((signal) =>
      client.write(
        'POST',
        '/api/v1/preview/draft',
        { title: title.trim() },
        decodeSample,
        { signal, csrfToken: 'preview-only-csrf-token' },
      ),
    );
    if (result && !result.ok && result.kind !== 'cancelled') {
      setTitleError(mapFieldErrors(result, { title: 'title' }).title);
      focusFirstInvalid(form);
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>2.1.5 / FRONTEND CONVENTIONS</p>
          <h1>Clear feedback at every step.</h1>
          <p className={styles.muted}>
            Mock transport only · no backend connection or saved data
          </p>
        </div>
        <AppearanceSelect compact />
      </header>
      <div className={styles.grid}>
        <Card
          title="Request states"
          description="Choose a simulated response, then run the sample request."
        >
          <div className={styles.stack}>
            <SelectField
              label="Mock response"
              value={scenario}
              onChange={(e) => {
                request.reset();
                setScenario(e.target.value);
              }}
            >
              <option value="success">Success</option>
              <option value="slow">Slow response (cancel available)</option>
              <option value="timeout">Timeout</option>
              <option value="network">Connection failure</option>
              <option value="unavailable">Service unavailable (503)</option>
              <option value="session">Sign-in required (401)</option>
              <option value="limited">Rate limited (429)</option>
              <option value="invalid">Unexpected response format</option>
            </SelectField>
            <div className={styles.actions}>
              <Button
                onClick={load}
                busy={request.state.status === 'loading'}
                busyLabel="Loading sample…"
              >
                Run sample request
              </Button>
              {request.state.status === 'loading' && (
                <Button variant="secondary" onClick={request.cancel}>
                  Cancel request
                </Button>
              )}
              <Button variant="quiet" onClick={request.reset}>
                Reset request
              </Button>
            </div>
            {request.state.status === 'idle' && (
              <p className={styles.muted}>
                Ready to run. All response scenarios are local fixtures.
              </p>
            )}
            {request.state.status === 'loading' && (
              <LoadingState label="Waiting for the mock response…" />
            )}
            {request.state.status === 'success' && (
              <Notice live tone="success" title="Sample loaded">
                {request.state.data.label}
              </Notice>
            )}
            {request.state.status === 'cancelled' && (
              <Notice live title="Request cancelled">
                No result was applied. Cancelling a real request would not
                confirm a server rollback.
              </Notice>
            )}
            {request.state.status === 'error' && (
              <Notice live tone="error" title="Request not completed">
                <p className={styles.message}>{request.state.error.message}</p>
                {request.state.error.traceId && (
                  <p className={styles.message}>
                    Reference: {request.state.error.traceId}
                  </p>
                )}
                {request.state.error.retryAfterSeconds !== undefined && (
                  <p className={styles.message}>
                    Wait at least {request.state.error.retryAfterSeconds}{' '}
                    seconds before retrying.
                  </p>
                )}
                {request.state.error.status !== 429 &&
                  request.state.error.status !== 401 && (
                    <Button variant="secondary" onClick={load}>
                      Retry sample request
                    </Button>
                  )}
              </Notice>
            )}
          </div>
        </Card>
        <Card
          title="Form feedback"
          description="Local checks and a mock server-validation response share the same fields."
        >
          <form className={styles.stack} noValidate onSubmit={submit}>
            <TextField
              label="Sample title"
              name="title"
              value={title}
              maxLength={100}
              required
              hint="Use “error” to see mock field validation, or enter any other title."
              {...(titleError ? { error: titleError } : {})}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(undefined);
                submission.reset();
              }}
            />
            <div className={styles.actions}>
              <Button
                type="submit"
                busy={submission.state.status === 'loading'}
                busyLabel="Checking sample…"
              >
                Check sample form
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setTitle('');
                  setTitleError(undefined);
                  submission.reset();
                }}
              >
                Reset form
              </Button>
            </div>
            {submission.state.status === 'error' && (
              <Notice live tone="error" title="Review the sample form">
                {submission.state.error.message}
              </Notice>
            )}
            {submission.state.status === 'success' && (
              <Notice live tone="success" title="Sample checked">
                {submission.state.data.label}
              </Notice>
            )}
            <p className={styles.muted}>
              Your input stays in the form after an error. Real forms will use
              their own business rules and API field mappings.
            </p>
          </form>
        </Card>
        <Card
          title="Consistent display"
          description="English labels, Indian currency formatting and explicit class timezone."
        >
          <dl className={styles.examples}>
            <div>
              <dt>Sample amount</dt>
              <dd>{formatMoney(129950)}</dd>
            </div>
            <div>
              <dt>Sample class time · Asia/Kolkata</dt>
              <dd>{formatDateTime('2026-10-16T10:00:00Z')}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Shared request rules">
          <ul className={styles.rules}>
            <li>Same-origin API paths and cookie credentials.</li>
            <li>Explicit antiforgery token for writes.</li>
            <li>Safe error summaries and mapped field messages.</li>
            <li>Cancellation, timeout and stale-response protection.</li>
            <li>Explicit retry only; input is retained after failures.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
