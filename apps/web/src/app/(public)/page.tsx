import styles from '@/app/(public)/page.module.css';
import { AppearanceSelect } from '@/components/appearance/appearance-select';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className={styles.stage}>
      <section className={styles.card} aria-labelledby="welcome-title">
        <p className={styles.brand}>
          GD Tutor
          <span className={styles.dot} aria-hidden="true">
            .
          </span>
        </p>
        <p className={styles.label}>Compact Blue · Theme exploration</p>
        <h1 id="welcome-title" className={styles.title}>
          A clearer space.
          <br />A sharper focus.
        </h1>
        <p className={styles.description}>
          A fresh home for courses, practice and classes. We are building the
          experience one reviewed step at a time.
        </p>
        <div className={styles.appearance}>
          <AppearanceSelect />
        </div>
        <div className={styles.accents} aria-label="Theme accent examples">
          <span className={styles.primary}>Learn with focus</span>
          <span className={styles.secondary}>Explore your potential</span>
        </div>
        <p>
          <Link href="/ui-preview">Explore the shared UI preview →</Link>
        </p>
      </section>
    </main>
  );
}
