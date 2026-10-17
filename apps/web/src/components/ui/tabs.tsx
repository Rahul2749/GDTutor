'use client';

import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './ui.module.css';

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};
export function Tabs({
  label,
  items,
  value,
  onValueChange,
}: {
  label: string;
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const prefix = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const active =
    items.find((item) => item.id === value && !item.disabled)?.id ??
    items.find((item) => !item.disabled)?.id;
  const enabled = items.flatMap((item, index) =>
    item.disabled ? [] : [index],
  );
  return (
    <div>
      <div role="tablist" aria-label={label} className={styles.tablist}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${prefix}-tab-${item.id}`}
            aria-controls={`${prefix}-panel-${item.id}`}
            aria-selected={active === item.id}
            tabIndex={active === item.id ? 0 : -1}
            disabled={item.disabled}
            className={styles.tab}
            onClick={() => onValueChange(item.id)}
            onKeyDown={(event) => {
              if (
                !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              )
                return;
              event.preventDefault();
              const position = enabled.indexOf(index);
              const offset = event.key === 'ArrowRight' ? 1 : -1;
              const next =
                event.key === 'Home'
                  ? enabled[0]
                  : event.key === 'End'
                    ? enabled.at(-1)
                    : enabled[
                        (position + offset + enabled.length) % enabled.length
                      ];
              if (next === undefined) return;
              const target = items[next];
              if (target) {
                onValueChange(target.id);
                refs.current[next]?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${prefix}-panel-${item.id}`}
          aria-labelledby={`${prefix}-tab-${item.id}`}
          hidden={active !== item.id}
          tabIndex={0}
          className={styles.tabpanel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
