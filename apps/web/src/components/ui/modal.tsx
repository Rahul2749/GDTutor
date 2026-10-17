'use client';

import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from './button';
import styles from './ui.module.css';

let scrollLocks = 0;
let previousOverflow = '';
function lockScroll() {
  if (scrollLocks++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  return () => {
    if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
  };
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  kind = 'dialog',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  kind?: 'dialog' | 'drawer';
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    dialog.showModal();
    const unlock = lockScroll();
    return () => {
      if (dialog.open) dialog.close();
      unlock();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={[styles.modal, kind === 'drawer' ? styles.drawer : ''].join(
        ' ',
      )}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button, input, select, textarea, [tabindex]',
          ),
        ).filter(
          (element) =>
            element.tabIndex >= 0 &&
            !element.matches(':disabled, [inert], [inert] *') &&
            element.getClientRects().length > 0 &&
            getComputedStyle(element).visibility !== 'hidden',
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last &&
          first
        ) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={(event) => {
        if (open && !event.currentTarget.open) onOpenChange(false);
      }}
    >
      <header className={styles.modalHeader}>
        <h2 id={`${id}-title`} className={styles.cardTitle}>
          {title}
        </h2>
        <Button variant="quiet" autoFocus onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </header>
      {description && (
        <p id={`${id}-description`} className={styles.hint}>
          {description}
        </p>
      )}
      <div className={styles.modalContent}>{children}</div>
    </dialog>
  );
}
