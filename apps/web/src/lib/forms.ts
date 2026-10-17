import type { ApiFailure } from './api/errors';

/** Explicit API-name -> form-name mapping; unknown fields remain a summary error. */
export function mapFieldErrors<Field extends string>(
  failure: ApiFailure,
  mapping: Record<string, Field>,
): Partial<Record<Field, string>> {
  const result: Partial<Record<Field, string>> = {};
  for (const [apiName, messages] of Object.entries(failure.fieldErrors ?? {})) {
    if (Object.hasOwn(mapping, apiName)) {
      const field = mapping[apiName];
      if (field && messages[0]) result[field] = messages.join(' ');
    }
  }
  return result;
}

export function focusFirstInvalid(form: HTMLFormElement) {
  requestAnimationFrame(() => {
    if (form.isConnected)
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}
