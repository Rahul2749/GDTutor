'use client';

import { useEffect, useRef, useState } from 'react';
import type { ApiResult } from '@/lib/api/client';
import type { ApiFailure } from '@/lib/api/errors';

export type RequestState<T> =
  | { status: 'idle' | 'loading' | 'cancelled' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiFailure };

/** One replaceable request per consumer; no shared/private response cache. */
export function useApiRequest<T>() {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' });
  const sequence = useRef(0);
  const active = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      sequence.current++;
      active.current?.abort();
    },
    [],
  );
  async function run(action: (signal: AbortSignal) => Promise<ApiResult<T>>) {
    const id = ++sequence.current;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setState({ status: 'loading' });
    let result: ApiResult<T>;
    try {
      result = await action(controller.signal);
    } catch {
      result = {
        ok: false,
        kind: 'contract',
        message: 'The request could not be completed.',
      };
    }
    if (id !== sequence.current) return;
    active.current = null;
    setState(
      result.ok
        ? { status: 'success', data: result.data }
        : result.kind === 'cancelled'
          ? { status: 'cancelled' }
          : { status: 'error', error: result },
    );
    return result;
  }
  function cancel() {
    sequence.current++;
    active.current?.abort();
    active.current = null;
    setState({ status: 'cancelled' });
  }
  function reset() {
    sequence.current++;
    active.current?.abort();
    active.current = null;
    setState({ status: 'idle' });
  }
  return { state, run, cancel, reset };
}
