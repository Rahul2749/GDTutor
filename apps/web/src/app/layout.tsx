import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { APPEARANCE_INIT_SCRIPT } from '@/lib/appearance';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'GD Tutor | Frontend foundation',
  description: 'The initial GD Tutor frontend foundation preview.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="gdtutor-appearance-init"
          dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
