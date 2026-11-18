/**
 * Reading languages for the Listening Room.
 *
 * `code` is a BCP-47 tag. `speech` is the tag handed to `SpeechSynthesisUtterance`
 * (a couple of locales speak better under a regional tag than the base tag).
 *
 * `translate` is the honest state of machine translation for that language:
 *   · 'browser'  — the browser Translator API may support it; availability is
 *                  checked at runtime and the on-device model is used only then.
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

/** Languages that fall back to an explicit external translation link. */
export const EXTERNAL_LANGUAGES = LISTEN_LANGUAGES.filter((l) => l.translate === 'external');

/**
 * Counts derived from the list itself.
 *
 * The numbers used to be typed into prose ("thirteen languages") in three
 * places, so adding a language would have left three sentences quietly wrong.
 * Everything reader-facing now reads from here.
 */
export const LANGUAGE_COUNT = LISTEN_LANGUAGES.length;
export const ON_DEVICE_COUNT = ON_DEVICE_LANGUAGES.length;
export const EXTERNAL_COUNT = EXTERNAL_LANGUAGES.length;

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty',
] as const;

const capitalise = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * A small count as a capitalised word ("Thirteen"), for sentence-initial use.
 * Falls back to the numeral when the list outgrows the word table, so the copy
 * degrades to a correct number rather than an absent one.
 */
export const languageCountWord: string = capitalise(
  NUMBER_WORDS[LANGUAGE_COUNT] ?? String(LANGUAGE_COUNT)
);

/** The same count mid-sentence ("thirteen"). */
export const languageCountWordLower: string = languageCountWord.toLowerCase();

/** Names as a readable list: "A, B and C". */
export function listNames(languages: ListenLanguage[] = LISTEN_LANGUAGES): string {
  const names = languages.map((l) => l.english);
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
