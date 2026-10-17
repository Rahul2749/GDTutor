'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  getAppearance,
  setAppearance,
  subscribeToAppearance,
} from '@/lib/appearance';
import type { AppearancePreference } from '@/lib/appearance';
import styles from './appearance-select.module.css';

const getServerAppearance = () => null;

export function AppearanceSelect({ compact = false }: { compact?: boolean }) {
  const preference = useSyncExternalStore<AppearancePreference | null>(
    subscribeToAppearance,
    getAppearance,
    getServerAppearance,
  );
  const [storageMessage, setStorageMessage] = useState('');
  return (
    <div className={[styles.control, compact ? styles.compact : ''].join(' ')}>
      <label className={styles.label} htmlFor="appearance">
        Appearance
      </label>
      <select
        id="appearance"
        className={styles.select}
        value={preference ?? 'system'}
        disabled={preference === null}
        aria-describedby="appearance-help"
        onChange={(event) => {
          const persisted = setAppearance(
            event.target.value as AppearancePreference,
          );
          setStorageMessage(
            persisted
              ? ''
              : 'Applied for this visit. Browser storage is unavailable.',
          );
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <p id="appearance-help" className={styles.help}>
        System follows your device. Preferences are local to this browser.
      </p>
      <p className={styles.feedback} role="status">
        {storageMessage}
      </p>
    </div>
  );
}
