import { createApiClient } from './client';
import type {
  HealthResponse,
  SystemStatusResponse,
} from './generated/foundation';
import type { ApiResult } from './client';

export type FoundationOperation =
  'status' | 'ready' | 'live' | 'slow' | 'timeout' | 'failure';
export type FoundationData = SystemStatusResponse | HealthResponse;
const client = createApiClient();

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected DTO.');
  return value as Record<string, unknown>;
}

export function decodeSystemStatus(value: unknown): SystemStatusResponse {
  const data = record(value);
  if (
    data.status !== 'available' ||
    data.apiVersion !== 'v1' ||
    typeof data.serverTime !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,7})?Z$/.test(
      data.serverTime,
    ) ||
    !Number.isFinite(Date.parse(data.serverTime)) ||
    new Date(data.serverTime).toISOString().slice(0, 19) !==
      data.serverTime.slice(0, 19) ||
    typeof data.sampleLabel !== 'string' ||
    !data.sampleLabel.length ||
    data.sampleLabel.length > 256 ||
    data.isDemonstration !== true ||
    data.scope !== 'foundation' ||
    data.dependenciesVerified !== false
  )
    throw new Error('Unexpected foundation contract.');
  return {
    status: data.status,
    apiVersion: data.apiVersion,
    serverTime: data.serverTime,
    sampleLabel: data.sampleLabel,
    isDemonstration: data.isDemonstration,
    scope: data.scope,
    dependenciesVerified: data.dependenciesVerified,
  };
}

export function decodeHealth(value: unknown): HealthResponse {
  const data = record(value);
  if (
    data.status !== 'healthy' ||
    (data.scope !== 'process' && data.scope !== 'foundation') ||
    data.dependenciesVerified !== false
  )
    throw new Error('Unexpected health contract.');
  return {
    status: data.status,
    scope: data.scope as string,
    dependenciesVerified: data.dependenciesVerified,
  };
}

/** Real browser fetch only; no injected preview transport or automatic retries. */
export function readFoundation(
  operation: FoundationOperation,
  signal: AbortSignal,
): Promise<ApiResult<FoundationData>> {
  if (operation === 'ready' || operation === 'live')
    return client.get(`/health/${operation}`, decodeHealth, { signal });
  const path =
    operation === 'status'
      ? '/api/v1/system/status'
      : operation === 'failure'
        ? '/api/v1/diagnostics/failure'
        : '/api/v1/diagnostics/delay';
  return client.get(path, decodeSystemStatus, {
    signal,
    timeoutMs: operation === 'timeout' ? 1000 : 10000,
  });
}
