/**
 * Reading languages for the Listening Room.
 *
 * `code` is a BCP-47 tag. `speech` is the tag handed to `SpeechSynthesisUtterance`
 * (a couple of locales speak better under a regional tag than the base tag).
 *
 * `translate` is the honest state of machine translation for that language:
 *   · 'browser'  — the Chrome/Edge Translator API supports it today; we use the
 *                  on-device model, nothing leaves the device.
 *   · 'external' — no on-device model; we offer a link-out the reader chooses,
 *                  we never translate silently.
 *
 * Nothing here fetches anything. The list exists so the UI can tell the truth.
 */
export interface ListenLanguage {
  code: string;
  label: string;
  english: string;
  speech: string;
  translate: 'browser' | 'external';
  /** Script direction, for the translated text container. */
  dir?: 'ltr' | 'rtl';
}

export const LISTEN_LANGUAGES: ListenLanguage[] = [
  { code: 'en', label: 'English', english: 'English', speech: 'en-US', translate: 'browser' },
  { code: 'fr', label: 'Français', english: 'French', speech: 'fr-FR', translate: 'browser' },
  { code: 'es', label: 'Español', english: 'Spanish', speech: 'es-ES', translate: 'browser' },
  { code: 'pt', label: 'Português', english: 'Portuguese', speech: 'pt-BR', translate: 'browser' },
  { code: 'sw', label: 'Kiswahili', english: 'Swahili', speech: 'sw-KE', translate: 'external' },
  { code: 'yo', label: 'Yorùbá', english: 'Yoruba', speech: 'yo-NG', translate: 'external' },
  { code: 'ig', label: 'Igbo', english: 'Igbo', speech: 'ig-NG', translate: 'external' },
  { code: 'ha', label: 'Hausa', english: 'Hausa', speech: 'ha-NG', translate: 'external' },
  { code: 'am', label: 'አማርኛ', english: 'Amharic', speech: 'am-ET', translate: 'external' },
  { code: 'ar', label: 'العربية', english: 'Arabic', speech: 'ar-SA', translate: 'external', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी', english: 'Hindi', speech: 'hi-IN', translate: 'browser' },
  { code: 'zh', label: '中文', english: 'Chinese (Simplified)', speech: 'zh-CN', translate: 'browser' },
  { code: 'ru', label: 'Русский', english: 'Russian', speech: 'ru-RU', translate: 'browser' },
];

export function getListenLanguage(code: string): ListenLanguage {
  return LISTEN_LANGUAGES.find((l) => l.code === code) ?? LISTEN_LANGUAGES[0];
}

/** Languages the browser can translate on-device today, for the UI chips. */
export const ON_DEVICE_LANGUAGES = LISTEN_LANGUAGES.filter((l) => l.translate === 'browser');
