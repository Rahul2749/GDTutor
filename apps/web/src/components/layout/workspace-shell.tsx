'use client';

import Link from 'next/link';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppearanceSelect } from '@/components/appearance/appearance-select';
import { Button } from '@/components/ui';
import styles from './workspace-shell.module.css';

export type NavigationItem = { label: string; href: Route };
export type NavigationGroup = { label: string; items: NavigationItem[] };

function Navigation({
  groups,
  current,
  onNavigate,
}: {
  groups: NavigationGroup[];
  current: string;
  onNavigate?: () => void;
}) {
  return groups.map((group) => (
    <section className={styles.navGroup} key={group.label}>
      <h2>{group.label}</h2>
      <ul>
        {group.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current === item.href ? 'page' : undefined}
              onClick={() => onNavigate?.()}
            >
              {item.label}
              {current === item.href && <span aria-hidden="true">›</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  ));
}

export function WorkspaceShell({
  kind,
  label,
  brandHref,
  primary,
  navigation,
  footer,
  children,
}: {
  kind: 'public' | 'student' | 'staff';
  label: string;
  brandHref: Route;
  primary: NavigationItem[];
  navigation: NavigationGroup[];
  footer: NavigationItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <ShellFrame
      key={pathname}
      {...{ kind, label, brandHref, primary, navigation, footer, children }}
      current={pathname}
    />
  );
}

function ShellFrame({
  kind,
  label,
  brandHref,
  primary,
  navigation,
  footer,
  children,
  current,
}: Parameters<typeof WorkspaceShell>[0] & { current: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const isPublic = kind === 'public';
  function closeMenu() {
    setMenuOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      className={[
        styles.shell,
        isPublic ? styles.publicShell : styles.workspace,
      ].join(' ')}
    >
      <a href="#workspace-main" className={styles.skip}>
        Skip to content
      </a>
      <header className={styles.header}>
        <Link
          className={styles.brand}
          href={brandHref}
          aria-label="GD Tutor home"
        >
          <span className={styles.brandMark} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            >
              <path d="M12 5v15M3 4h4a7 7 0 0 1 5 2 7 7 0 0 1 5-2h4v15h-4a7 7 0 0 0-5 2 7 7 0 0 0-5-2H3Z" />
            </svg>
          </span>
          gd
          <span className={styles.brandLight}>
            tutor<span className={styles.brandDot}>.</span>
          </span>
        </Link>
        <nav className={styles.primary} aria-label="Primary navigation">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerTools}>
          <AppearanceSelect compact />
          <div className={styles.menuTrigger}>
            <Button
              ref={trigger}
              variant="secondary"
              aria-expanded={menuOpen}
              aria-controls={panelId}
              onClick={() => setMenuOpen(!menuOpen)}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && menuOpen) {
                  event.preventDefault();
                  closeMenu();
                }
              }}
            >
              Menu <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
            </Button>
          </div>
        </div>
      </header>
      <div
        id={panelId}
        hidden={!menuOpen}
        className={styles.menuPanel}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
          }
        }}
      >
        <nav aria-label="Expanded navigation">
          <div className={styles.mobilePrimary}>
            <Navigation
              groups={[{ label: 'Explore', items: primary }]}
              current={current}
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
          <Navigation
            groups={navigation}
            current={current}
            onNavigate={() => setMenuOpen(false)}
          />
        </nav>
      </div>
      <div className={styles.body}>
        {!isPublic && (
          <aside className={styles.sidebar} aria-label={`${label} sidebar`}>
            <p className={styles.workspaceLabel}>{label}</p>
            <nav aria-label="Workspace navigation">
              <Navigation groups={navigation} current={current} />
            </nav>
          </aside>
        )}
        <div className={styles.contentColumn}>
          <main id="workspace-main" tabIndex={-1} className={styles.content}>
            {children}
          </main>
          <footer className={styles.footer}>
            <span>GD Tutor · {label}</span>
            <nav aria-label="Footer navigation">
              {footer.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
