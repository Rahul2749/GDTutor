import Link from 'next/link';
import { ApiPlayground } from './preview';
import styles from './preview.module.css';

export default function ApiPreviewPage() {
  return (
    <main className={styles.page}>
      <ApiPlayground />
      <footer className={styles.footer}>
        <Link href="/connection-preview">Live API connection →</Link>
        <Link href="/layout-preview">Review application layouts →</Link>
        <Link href="/ui-preview">Shared components →</Link>
      </footer>
    </main>
  );
}
