import Link from 'next/link';
import { Card } from '@/components/ui';
import { areas, labels, firstSection, previewHref } from './navigation';
import styles from './preview.module.css';

export default function LayoutPreviewPage() {
  return (
    <main className={styles.hub}>
      <p className={styles.eyebrow}>2.1.4 / RESPONSIVE LAYOUTS</p>
      <h1>A place for every part of learning.</h1>
      <p className={styles.muted}>
        Review the public, student and staff layouts in Light, Dark and System
        appearance. Each destination uses placeholder content.
      </p>
      <div className={styles.hubGrid}>
        {areas.map((area) => (
          <Card
            key={area}
            title={labels[area]}
            description={
              area === 'public'
                ? 'Discovery, courses and help.'
                : area === 'student'
                  ? 'Learning, classes and personal tools.'
                  : area === 'staff'
                    ? 'Assigned teaching and content tools.'
                    : 'A separate administrative navigation fixture.'
            }
          >
            <Link
              className={styles.actionLink}
              href={previewHref(area, firstSection(area))}
            >
              Open {area === 'admin' ? 'administrator' : area} layout{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </Card>
        ))}
      </div>
      <p className={styles.muted}>
        Role choices above are review fixtures. Authentication and server
        permissions will be implemented in their own subphases.
      </p>
      <Link href="/ui-preview">Shared component reference →</Link>
    </main>
  );
}
