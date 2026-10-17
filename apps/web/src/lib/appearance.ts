export type AppearancePreference = 'light' | 'dark' | 'system';

export const APPEARANCE_KEY = 'gdtutor.appearance';
const APPEARANCE_EVENT = 'gdtutor:appearance-change';
const SYSTEM_QUERY = '(prefers-color-scheme: dark)';
let temporaryPreference: AppearancePreference | undefined;

function isPreference(value: unknown): value is AppearancePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function getAppearance(): AppearancePreference {
  if (temporaryPreference) return temporaryPreference;
  try {
    const stored = window.localStorage.getItem(APPEARANCE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function applyAppearance() {
  const preference = getAppearance();
  const dark =
    preference === 'dark' ||
    (preference === 'system' && window.matchMedia(SYSTEM_QUERY).matches);
  document.documentElement.dataset.appearance = preference;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export function setAppearance(preference: AppearancePreference): boolean {
  if (!isPreference(preference)) return false;
  let persisted = true;
  try {
    window.localStorage.setItem(APPEARANCE_KEY, preference);
    temporaryPreference = undefined;
  } catch {
    temporaryPreference = preference;
    persisted = false;
  }
  applyAppearance();
  window.dispatchEvent(new Event(APPEARANCE_EVENT));
  return persisted;
}

export function subscribeToAppearance(onChange: () => void): () => void {
  const media = window.matchMedia(SYSTEM_QUERY);
  const update = () => {
    applyAppearance();
    onChange();
  };
  const storage = (event: StorageEvent) => {
    if (event.key !== APPEARANCE_KEY && event.key !== null) return;
    try {
      if (event.storageArea !== window.localStorage) return;
    } catch {
      return;
    }
    temporaryPreference = undefined;
    update();
  };
  update();
  window.addEventListener(APPEARANCE_EVENT, update);
  window.addEventListener('storage', storage);
  media.addEventListener('change', update);
  return () => {
    window.removeEventListener(APPEARANCE_EVENT, update);
    window.removeEventListener('storage', storage);
    media.removeEventListener('change', update);
  };
}

// Fixed trusted source: no user HTML/storage values are interpolated as code.
// Future CSP must allow this exact source's hash or a request nonce.
export const APPEARANCE_INIT_SCRIPT = `(()=>{let p='system';try{const v=localStorage.getItem(${JSON.stringify(APPEARANCE_KEY)});if(v==='light'||v==='dark'||v==='system')p=v}catch{}const d=p==='dark'||(p==='system'&&matchMedia(${JSON.stringify(SYSTEM_QUERY)}).matches);document.documentElement.dataset.appearance=p;document.documentElement.dataset.theme=d?'dark':'light'})()`;
