import { useId } from 'react';
import type { ReactNode } from 'react';
import styles from './ui.module.css';

export function Card({
  title,
  eyebrow,
  description,
  children,
  headingLevel = 2,
}: {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  children: ReactNode;
  headingLevel?: 2 | 3;
}) {
  const id = useId();
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <section className={styles.card} aria-labelledby={id}>
      <header className={styles.cardHeader}>
        {eyebrow && <p className={styles.cardEyebrow}>{eyebrow}</p>}
        <Heading id={id} className={styles.cardTitle}>
          {title}
        </Heading>
        {description && <p className={styles.hint}>{description}</p>}
      </header>
      {children}
    </section>
  );
}
