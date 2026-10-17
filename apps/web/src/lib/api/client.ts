import { httpFailure } from './errors';
import type { ApiFailure } from './errors';

export type ApiResult<T> =
  { ok: true; data: T; status: number; etag: string | null } | ApiFailure;
export type Decoder<T> = (value: unknown) => T;
type Options = {
  signal?: AbortSignal;
  timeoutMs?: number;
  maxResponseBytes?: number;
};
type WriteOptions = Options & {
  csrfToken: string;
  ifMatch?: string;
  idempotencyKey?: string;
};
const configuration = (message: string): ApiFailure => ({
  ok: false,
  kind: 'configuration',
  message,
});

function validPath(path: string, method: string) {
  if (method === 'GET' && (path === '/health/live' || path === '/health/ready'))
    return true;
  if (
    !path.startsWith('/api/v1/') ||
    /[\\#]/.test(path) ||
    [...path].some((character) => character.charCodeAt(0) <= 32)
  )
    return false;
  const url = new URL(path, 'https://same-origin.invalid');
  return (
    url.origin === 'https://same-origin.invalid' &&
    url.pathname.startsWith('/api/v1/')
  );
}

async function readJson(response: Response, maxBytes: number) {
  if (!response.body) throw new Error('Missing JSON body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new Error('Response limit');
      }
      text += decoder.decode(part.value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } finally {
    reader.releaseLock();
  }
}

/** Browser same-origin JSON client. Supply an injected transport only for tests/previews.
 * No retries, authentication storage, endpoint discovery or business-state cache.
 */
export function createApiClient(transport: typeof fetch = fetch) {
  async function request<T>(
    path: string,
    method: string,
    decode: Decoder<T>,
    options: Options,
    body?: unknown,
    write?: WriteOptions,
  ): Promise<ApiResult<T>> {
    if (!validPath(path, method))
      return configuration(
        'Use a relative /api/v1/ path or an exact health read.',
      );
    const timeoutMs = options.timeoutMs ?? 15000;
    const maxBytes = options.maxResponseBytes ?? 1048576;
    if (
      !Number.isSafeInteger(timeoutMs) ||
      timeoutMs <= 0 ||
      timeoutMs > 120000 ||
      !Number.isSafeInteger(maxBytes) ||
      maxBytes <= 0 ||
      maxBytes > 20971520
    )
      return configuration('Request limits are outside the supported range.');
    const headers = new Headers({
      Accept: 'application/json, application/problem+json',
    });
    let encoded: string | undefined;
    if (write) {
      if (!/^[\x21-\x7e]{1,4096}$/.test(write.csrfToken))
        return configuration('An antiforgery request token is required.');
      if (
        write.ifMatch !== undefined &&
        !/^"[\x21\x23-\x7e]{1,256}"$/.test(write.ifMatch)
      )
        return configuration('A strong version tag is required.');
      if (
        write.idempotencyKey !== undefined &&
        !/^[\x21-\x7e]{1,128}$/.test(write.idempotencyKey)
      )
        return configuration('The operation key is invalid.');
      headers.set('X-CSRF-TOKEN', write.csrfToken);
      headers.set('Content-Type', 'application/json');
      if (write.ifMatch) headers.set('If-Match', write.ifMatch);
      if (write.idempotencyKey)
        headers.set('Idempotency-Key', write.idempotencyKey);
      try {
        encoded = JSON.stringify(body);
      } catch {
        return configuration('The request must contain JSON-compatible data.');
      }
      if (encoded === undefined)
        return configuration('The request must contain JSON-compatible data.');
    }
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (options.signal?.aborted)
      return { ok: false, kind: 'cancelled', message: 'Request cancelled.' };
    options.signal?.addEventListener('abort', cancel, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      const response = await transport(path, {
        method,
        headers,
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        signal: controller.signal,
        ...(encoded !== undefined ? { body: encoded } : {}),
      });
      const mediaType = response.headers
        .get('Content-Type')
        ?.split(';')[0]
        ?.trim()
        .toLowerCase();
      if (!response.ok) {
        let problem: unknown;
        if (mediaType === 'application/problem+json') {
          try {
            problem = await readJson(response, maxBytes);
          } catch {
            /* Fall back to a safe HTTP message. */
          }
        }
        if (controller.signal.aborted)
          throw new DOMException('Aborted', 'AbortError');
        return httpFailure(
          response.status,
          problem,
          response.headers.get('Retry-After'),
        );
      }
      try {
        const data =
          response.status === 204
            ? null
            : mediaType === 'application/json'
              ? await readJson(response, maxBytes)
              : (() => {
                  throw new Error('Unexpected media type');
                })();
        if (controller.signal.aborted)
          throw new DOMException('Aborted', 'AbortError');
        return {
          ok: true,
          data: decode(data),
          status: response.status,
          etag: response.headers.get('ETag'),
        };
      } catch (error) {
        if (controller.signal.aborted) throw error;
        return {
          ok: false,
          kind: 'contract',
          status: response.status,
          message:
            'The response could not be read. Please try again or contact support.',
        };
      }
    } catch {
      if (controller.signal.aborted)
        return {
          ok: false,
          kind: timedOut ? 'timeout' : 'cancelled',
          message: timedOut
            ? 'The request took too long. Please try again.'
            : 'Request cancelled.',
        };
      return {
        ok: false,
        kind: 'network',
        message: 'Unable to connect. Check your connection and try again.',
      };
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', cancel);
    }
  }
  return {
    get<T>(path: string, decode: Decoder<T>, options: Options = {}) {
      return request(path, 'GET', decode, options);
    },
    write<T>(
      method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      path: string,
      body: unknown,
      decode: Decoder<T>,
      options: WriteOptions,
    ) {
      return request(path, method, decode, options, body, options);
    },
  };
}
