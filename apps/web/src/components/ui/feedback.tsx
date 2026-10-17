import { useId } from 'react';
import type { ReactNode } from 'react';
import styles from './ui.module.css';

type Tone = 'info' | 'success' | 'warning' | 'error';
const toneNames: Record<Tone, string> = {
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

export function Notice({
  tone = 'info',
  title,
  children,
  live = false,
}: {
  tone?: Tone;
  title: string;
  children: ReactNode;
  live?: boolean;
}) {
  return (
    <div
      className={[styles.notice, styles[tone]].join(' ')}
      role={live ? (tone === 'error' ? 'alert' : 'status') : undefined}
    >
      <p className={styles.noticeTitle}>
        <span className={styles.toneName}>{toneNames[tone]}</span>
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning';
}) {
  return (
    <span
      className={[
        styles.badge,
        tone === 'neutral' ? styles.neutral : styles[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export function Skeleton({ kind = 'text' }: { kind?: 'text' | 'block' }) {
  return (
    <span
      aria-hidden="true"
      className={[
        styles.skeleton,
        kind === 'block' ? styles.skeletonBlock : '',
      ].join(' ')}
    />
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className={styles.state}>
      <p className={styles.hint} role="status">
        {label}
      </p>
      <div aria-busy="true" aria-hidden="true" className={styles.loadingBlocks}>
        <Skeleton kind="block" />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const id = useId();
  return (
    <section className={styles.empty} aria-labelledby={id}>
      <span aria-hidden="true" className={styles.emptyMark}>
        ○
      </span>
      <h3 id={id} className={styles.cardTitle}>
        {title}
      </h3>
      <p className={styles.hint}>{description}</p>
      {action}
    </section>
  );
}
