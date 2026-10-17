import Link from 'next/link';
import { ConnectionPreview } from '@/features/connection/connection-preview';
import styles from '@/features/connection/connection.module.css';

// Keep the local diagnostic flag server-side and out of statically shared HTML.
export const dynamic = 'force-dynamic';

export default function ConnectionPreviewPage() {
  return (
    <main className={styles.page}>
      <ConnectionPreview
        allowDiagnostics={Boolean(process.env.GDTUTOR_LOCAL_API_ORIGIN)}
      />
      <footer className={styles.footer}>
        <Link href="/layout-preview/public/home">Application layouts →</Link>
        <Link href="/api-preview">Mock request laboratory →</Link>
        <Link href="/ui-preview">Shared components →</Link>
      </footer>
    </main>
  );
}
