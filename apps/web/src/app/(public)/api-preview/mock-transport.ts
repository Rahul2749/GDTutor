/** Isolated fixtures. No request reaches fetch or a backend. Not a production DTO. */
export type SampleResponse = { label: string };
export function decodeSample(value: unknown): SampleResponse {
  if (
    !value ||
    typeof value !== 'object' ||
    !('label' in value) ||
    typeof value.label !== 'string'
  )
    throw new Error('Invalid sample');
  return { label: value.label };
}

function delay(ms: number, signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

const json = (
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type':
        status >= 400 ? 'application/problem+json' : 'application/json',
      ...extra,
    },
  });

export const mockTransport: typeof fetch = async (input, init) => {
  const url = new URL(
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url,
    'https://preview.invalid',
  );
  const scenario = url.searchParams.get('scenario') ?? 'success';
  await delay(
    scenario === 'slow' || scenario === 'timeout' ? 5000 : 500,
    init?.signal,
  );
  if (init?.method === 'POST') {
    const body = JSON.parse(String(init.body)) as { title: string };
    if (body.title.toLowerCase() === 'error')
      return json(
        {
          code: 'validation_failed',
          traceId: 'preview-form-01',
          errors: { title: ['Choose a more descriptive title.'] },
        },
        400,
      );
    return json({
      label: 'The sample form passed the mock response. Nothing was saved.',
    });
  }
  if (scenario === 'network')
    throw new TypeError('Simulated offline transport');
  if (scenario === 'unavailable')
    return json(
      { code: 'temporarily_unavailable', traceId: 'preview-read-01' },
      503,
    );
  if (scenario === 'session') return json({ code: 'unauthenticated' }, 401);
  if (scenario === 'limited')
    return json({ code: 'rate_limited' }, 429, { 'Retry-After': '10' });
  if (scenario === 'invalid') return json({ unexpected: true });
  return json(
    { label: 'Sample response received. This is a mock request.' },
    200,
    { ETag: '"sample-v1"' },
  );
};
