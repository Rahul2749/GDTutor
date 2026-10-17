'use client';

import { useState } from 'react';
import { AppearanceSelect } from '@/components/appearance/appearance-select';
import {
  Badge,
  Button,
  Card,
  LoadingState,
  Notice,
  SelectField,
} from '@/components/ui';
import { useApiRequest } from '@/hooks/use-api-request';
import { readFoundation } from '@/lib/api/foundation';
import type { FoundationData, FoundationOperation } from '@/lib/api/foundation';
import { formatDateTime } from '@/lib/format';
import styles from './connection.module.css';

export function ConnectionPreview({
  allowDiagnostics,
}: {
  allowDiagnostics: boolean;
}) {
  const [operation, setOperation] = useState<FoundationOperation>('status');
  const request = useApiRequest<FoundationData>();
  const state = request.state;
  const pending = state.status === 'loading';
  function load() {
    void request.run((signal) => readFoundation(operation, signal));
  }

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>GD TUTOR / CONNECTION REVIEW</p>
          <h1>A connected foundation.</h1>
          <p className={styles.muted}>
            Live API requests · read-only demonstration · no data saved
          </p>
        </div>
        <AppearanceSelect compact />
      </header>
      <div className={styles.grid}>
        <Card
          title="Connection check"
          description="Read the actual API response through this application."
        >
          <div className={styles.stack}>
            <SelectField
              label="Check to run"
              value={operation}
              onChange={(event) => {
                request.reset();
                setOperation(event.target.value as FoundationOperation);
              }}
            >
              <option value="status">Service status</option>
              <option value="ready">Foundation readiness</option>
              <option value="live">Process liveness</option>
              {allowDiagnostics && (
                <>
                  <option value="slow">Delayed read (2 seconds)</option>
                  <option value="timeout">Timeout check (1 second)</option>
                  <option value="failure">Controlled server error</option>
                </>
              )}
            </SelectField>
            <div className={styles.actions}>
              <Button
                onClick={load}
                busy={pending}
                busyLabel="Checking connection…"
              >
                Check connection
              </Button>
              {pending && (
                <Button variant="secondary" onClick={request.cancel}>
                  Cancel request
                </Button>
              )}
              <Button variant="quiet" onClick={request.reset}>
                Reset
              </Button>
            </div>
            <div className={styles.result} aria-busy={pending}>
              {state.status === 'idle' && (
                <p className={styles.muted}>
                  Choose a check, then connect. Results come from the running
                  API.
                </p>
              )}
              {pending && (
                <LoadingState label="Waiting for the API response…" />
              )}
              {state.status === 'cancelled' && (
                <Notice live title="Request cancelled">
                  No result was applied. This check does not save any data.
                </Notice>
              )}
              {state.status === 'error' && (
                <Notice live tone="error" title="Connection check failed">
                  <p>{state.error.message}</p>
                  {state.error.status && <p>HTTP {state.error.status}</p>}
                  {state.error.traceId && (
                    <p className={styles.reference}>
                      Reference: {state.error.traceId}
                    </p>
                  )}
                  <Button variant="secondary" onClick={load}>
                    Retry check
                  </Button>
                </Notice>
              )}
              {state.status === 'success' && (
                <div className={styles.stack}>
                  <Notice live tone="success" title="API response received">
                    {operation === 'ready'
                      ? 'The foundation host is responding.'
                      : operation === 'live'
                        ? 'The API process is responding.'
                        : 'The sample service responded successfully.'}
                  </Notice>
                  <dl className={styles.details}>
                    <div>
                      <dt>Response</dt>
                      <dd>
                        <Badge tone="success">
                          {state.data.status === 'healthy'
                            ? 'Healthy'
                            : 'Available'}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt>Scope</dt>
                      <dd>
                        {state.data.scope === 'process'
                          ? 'Process only'
                          : 'Foundation only'}
                      </dd>
                    </div>
                    {'serverTime' in state.data && (
                      <>
                        <div>
                          <dt>API version</dt>
                          <dd>{state.data.apiVersion}</dd>
                        </div>
                        <div>
                          <dt>Server time</dt>
                          <dd>
                            <time dateTime={state.data.serverTime}>
                              {formatDateTime(state.data.serverTime)}{' '}
                              (Asia/Kolkata)
                            </time>
                          </dd>
                        </div>
                        <div>
                          <dt>Sample service</dt>
                          <dd>{state.data.sampleLabel}</dd>
                        </div>
                      </>
                    )}
                    <div>
                      <dt>External dependencies</dt>
                      <dd>Not verified</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card
          title="What this confirms"
          description="A small, honest step towards the full learning platform."
        >
          <div className={styles.stack}>
            <Badge>Integration demonstration</Badge>
            <ul className={styles.list}>
              <li>
                The browser reaches the .NET API through the same website
                origin.
              </li>
              <li>Responses are checked before they appear on screen.</li>
              <li>
                Loading, cancellation and errors use the shared application
                components.
              </li>
            </ul>
            <Notice title="Foundation scope">
              These checks do not verify courses, accounts, PostgreSQL, payments
              or media services. A healthy response does not establish
              production readiness or student capacity.
            </Notice>
            {allowDiagnostics && (
              <p className={styles.muted}>
                Delayed and error checks require the local API in Development.
                The delayed read takes two seconds; cancel it while loading to
                review cancellation.
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
