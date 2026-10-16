import styles from '@/app/(public)/page.module.css';

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
        <p className={styles.label}>Frontend foundation preview</p>
        <h1 id="welcome-title" className={styles.title}>
          Room to learn.
          <br />
          Space to grow.
        </h1>
        <p className={styles.description}>
          A fresh home for courses, practice and classes. We are building the
          experience one reviewed step at a time.
        </p>
        <p className={styles.note}>
          Initial structure is ready. Theme setup comes next.
        </p>
      </section>
    </main>
  );
}
