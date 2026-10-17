import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './ui.module.css';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  busy?: boolean;
  busyLabel?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  variant = 'primary',
  busy = false,
  busyLabel = 'Working…',
  leadingIcon,
  trailingIcon,
  type = 'button',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={[styles.button, styles[variant], className]
        .filter(Boolean)
        .join(' ')}
    >
      {busy && <span className={styles.spinner} aria-hidden="true" />}
      {!busy && leadingIcon && (
        <span className={styles.buttonIcon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className={styles.buttonLabel}>{busy ? busyLabel : children}</span>
      {!busy && trailingIcon && (
        <span className={styles.buttonIcon} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
