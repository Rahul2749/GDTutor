import Link from 'next/link';
import type { ReactNode } from 'react';
import { areas, firstSection, labels, previewHref } from './navigation';
import styles from './preview.module.css';

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.reviewBar}>
        <Link href="/layout-preview">Layout preview</Link>
        <span>Sample content · no account session</span>
        <nav aria-label="Preview fixtures">
          {areas.map((area) => (
            <Link key={area} href={previewHref(area, firstSection(area))}>
              {area === 'staff'
                ? 'Instructor'
                : area === 'admin'
                  ? 'Administrator'
                  : labels[area]}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </>
  );
}
