export type ApiFailure = {
  ok: false;
  kind:
    'http' | 'network' | 'cancelled' | 'timeout' | 'contract' | 'configuration';
  message: string;
  status?: number;
  code?: string;
  traceId?: string;
  fieldErrors?: Record<string, string[]>;
  retryAfterSeconds?: number;
};

const messages: Record<number, string> = {
  400: 'Check the form and try again.',
  401: 'Sign in to continue. Your input has been kept.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested item is unavailable.',
  409: 'The item has changed or this action conflicts with its current state. Review it before continuing.',
  412: 'A newer version is available. Review it before saving again.',
  428: 'Refresh the item to obtain its current version before saving.',
  413: 'The request is too large. Reduce its size and try again.',
  415: 'This content format is not supported.',
  429: 'Too many requests. Wait before trying again.',
};

function identifier(value: unknown) {
  return typeof value === 'string' && /^[\w.:/-]{1,120}$/.test(value)
    ? value
    : undefined;
}

export function httpFailure(
  status: number,
  problem: unknown,
  retryAfter: string | null,
  now = Date.now(),
): ApiFailure {
  const failure: ApiFailure = {
    ok: false,
    kind: 'http',
    status,
    message:
      messages[status] ??
      'The request could not be completed. Try again later.',
  };
  if (problem && typeof problem === 'object' && !Array.isArray(problem)) {
    const data = problem as Record<string, unknown>;
    const code = identifier(data.code);
    const traceId = identifier(data.traceId);
    if (code) failure.code = code;
    if (traceId) failure.traceId = traceId;
    // Only validation responses may become field feedback. Titles/details are
    // deliberately not rendered: arbitrary proxy/server diagnostics are unsafe.
    if (
      (status === 400 || status === 422) &&
      data.errors &&
      typeof data.errors === 'object' &&
      !Array.isArray(data.errors)
    ) {
      const fields: Record<string, string[]> = Object.create(null);
      for (const [key, values] of Object.entries(data.errors).slice(0, 50)) {
        if (
          !/^[A-Za-z][\w.[\]-]{0,119}$/.test(key) ||
          ['constructor', 'prototype'].includes(key)
        )
          continue;
        if (!Array.isArray(values)) continue;
        const safe = values
          .filter((v): v is string => typeof v === 'string' && !!v.trim())
          .slice(0, 5)
          .map((v) => v.slice(0, 300));
        if (safe.length) fields[key] = safe;
      }
      if (Object.keys(fields).length) failure.fieldErrors = fields;
    }
  }
  if (status === 429 || status === 503) {
    if (retryAfter && /^\d+$/.test(retryAfter))
      failure.retryAfterSeconds = Math.min(Number(retryAfter), 86400);
    else if (retryAfter) {
      const time = Date.parse(retryAfter);
      if (Number.isFinite(time))
        failure.retryAfterSeconds = Math.min(
          86400,
          Math.max(0, Math.ceil((time - now) / 1000)),
        );
    }
  }
  return failure;
}
