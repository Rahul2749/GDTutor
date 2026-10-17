'use client';

import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './ui.module.css';

type FieldDetails = { label: string; hint?: string; error?: string };
function descriptions(
  id: string,
  hint?: string,
  error?: string,
  extra?: string,
) {
  return (
    [hint && `${id}-hint`, error && `${id}-error`, extra]
      .filter(Boolean)
      .join(' ') || undefined
  );
}
function FieldFrame({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FieldDetails & {
  id: string;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.fieldError}>
          Error: {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  type = 'text',
  ...props
}: FieldDetails & ComponentPropsWithRef<'input'>) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldFrame
      id={fieldId}
      label={label}
      required={props.required}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <input
        {...props}
        id={fieldId}
        type={type}
        className={[styles.input, className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={descriptions(
          fieldId,
          hint,
          error,
          props['aria-describedby'],
        )}
      />
    </FieldFrame>
  );
}

export function SelectField({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...props
}: FieldDetails & ComponentPropsWithRef<'select'>) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldFrame
      id={fieldId}
      label={label}
      required={props.required}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <select
        {...props}
        id={fieldId}
        className={[styles.input, className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={descriptions(
          fieldId,
          hint,
          error,
          props['aria-describedby'],
        )}
      >
        {children}
      </select>
    </FieldFrame>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: FieldDetails & ComponentPropsWithRef<'textarea'>) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldFrame
      id={fieldId}
      label={label}
      required={props.required}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <textarea
        rows={3}
        {...props}
        id={fieldId}
        className={[styles.input, styles.textarea, className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={descriptions(
          fieldId,
          hint,
          error,
          props['aria-describedby'],
        )}
      />
    </FieldFrame>
  );
}

export function Checkbox({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: FieldDetails & Omit<ComponentPropsWithRef<'input'>, 'type'>) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.checkLabel}>
        <input
          {...props}
          type="checkbox"
          id={fieldId}
          className={[styles.checkbox, className].filter(Boolean).join(' ')}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={descriptions(
            fieldId,
            hint,
            error,
            props['aria-describedby'],
          )}
        />
        <span>{label}</span>
      </label>
      {hint && (
        <p id={`${fieldId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className={styles.fieldError}>
          Error: {error}
        </p>
      )}
    </div>
  );
}
