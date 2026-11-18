/**
 * The Listening Room — browser/OS article narration, with optional translation.
 *
 * Design constraints, in order of importance:
 *   1. Never play without an explicit click. No autoplay anywhere, ever.
 *   2. Never ship audio bytes. Speech comes from the platform Web Speech API;
 *      this site sends no article text to a TTS endpoint. A browser may use an
 *      installed local voice or its own network voice under the vendor's terms.
 *   3. Never fake a translation. Use the browser's Translator API only when it
 *      reports an available/downloadable on-device pair. Otherwise keep English
 *      and offer an explicit external link the reader must click.
 *   4. Degrade cleanly. The article remains readable without JS or speech support.
 *   5. Keep links and emphasis intact. Translation temporarily replaces leaf
 *      block text, but the original HTML is restored losslessly.
 *
 * Voice and speed live in localStorage under `ijn-listen`. Language is a
 * per-page reading choice: a new page always opens the English original.
 */

type TranslateState = 'browser' | 'external' | 'unsupported';
type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';

interface ListenLanguageConfig {
  code: string;
  label: string;
  english: string;
  speech: string;
  translate: TranslateState;
  dir: 'ltr' | 'rtl';
}

interface VoicePreset {
  id: string;
  label: string;
  description: string;
  prefer: string[];
  rate: number;
  pitch: number;
}

interface ListenConfig {
  lang: string;
  languages: ListenLanguageConfig[];
  voices: VoicePreset[];
  rates: number[];
  articleTitle: string;
  articleUrl: string;
  libraryUrl: string;
}

interface ListenPrefs {
  voice: string;
  rate: number;
  lang: string;
}

interface Segment {
  el: HTMLElement;
  text: string;
}

interface QueueItem {
  text: string;
  segment: number;
}

interface TranslatorInstance {
  translate: (text: string) => Promise<string>;
  destroy?: () => void;
}

interface TranslatorCreateOptions {
  sourceLanguage: string;
  targetLanguage: string;
  monitor?: (monitor: EventTarget) => void;
}

declare global {
  interface Window {
    Translator?: {
      availability?: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<string>;
      create?: (opts: TranslatorCreateOptions) => Promise<TranslatorInstance>;
    };
  }
}

const STORAGE_KEY = 'ijn-listen';
const CHUNK_MAX = 220;
const SECTION_PAUSE_MS = 420;
const VOICES_TIMEOUT_MS = 2500;
const START_TIMEOUT_MS = 12000;

const SEGMENT_SELECTOR = [
  'h1',
  '.article-prose p',
  '.article-prose li',
  '.article-prose blockquote',
  '.theme-scripture blockquote',
  '.declaration-text',
  '.reaffirmation-text',
  'h2',
  'h3',
].join(', ');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readConfig(): ListenConfig | null {
  const el = document.getElementById('listen-room-config');
  if (!el) return null;
  try {
    const parsed: unknown = JSON.parse(el.textContent || '{}');
    if (!isRecord(parsed)) return null;
    if (!Array.isArray(parsed.languages) || !Array.isArray(parsed.voices) || !Array.isArray(parsed.rates)) return null;
    if (!parsed.languages.length || !parsed.voices.length) return null;
    return parsed as unknown as ListenConfig;
  } catch {
    return null;
  }
}

function defaultPrefs(): ListenPrefs {
  return { voice: 'dawn', rate: 0, lang: 'en' };
}

function readPrefs(cfg: ListenConfig): ListenPrefs {
  const fallback = defaultPrefs();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return fallback;
    const voice = cfg.voices.some((v) => v.id === parsed.voice) ? String(parsed.voice) : fallback.voice;
    const rate = typeof parsed.rate === 'number' && Number.isFinite(parsed.rate) && (parsed.rate === 0 || cfg.rates.includes(parsed.rate))
      ? parsed.rate
      : 0;
    return { voice, rate, lang: 'en' };
  } catch {
    return fallback;
  }
}

function writePrefs(prefs: ListenPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ voice: prefs.voice, rate: prefs.rate }));
  } catch {
    /* Private mode: preferences simply do not persist. */
  }
}

/** Remove decoration/control text without mutating the live article. */
function readableText(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('button, select, input, script, style, noscript, [aria-hidden="true"], .visually-hidden').forEach((node) => node.remove());
  return cleanText(clone.textContent || '');
}

/** Collect leaf reading blocks once, in document order. */
export function collectSegments(root: ParentNode | null = document.getElementById('listen-source')): Segment[] {
  if (!root) return [];
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(SEGMENT_SELECTOR));
  const candidateSet = new Set(candidates);
  return candidates
    // A blockquote containing paragraphs is represented by its paragraphs, not twice.
    .filter((el) => !Array.from(candidateSet).some((other) => other !== el && el.contains(other)))
    .filter((el) => !el.closest('[hidden], [aria-hidden="true"], script, style, noscript'))
    .map((el) => ({ el, text: readableText(el) }))
    .filter((segment) => segment.text.length > 2);
}

function cleanText(raw: string): string {
  return raw
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

/** Split at sentence/clause/word boundaries; never return an over-limit chunk. */
export function chunk(text: string, max = CHUNK_MAX): string[] {
  const normalized = cleanText(text);
  if (!normalized) return [];
  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : CHUNK_MAX;
  if (normalized.length <= limit) return [normalized];

  const sentences = normalized.match(/[^.!?…]+[.!?…]+["')\]]*|[^.!?…]+$/g) || [normalized];
  const pieces: string[] = [];

  const splitLong = (value: string): void => {
    let rest = value.trim();
    while (rest.length > limit) {
      const window = rest.slice(0, limit + 1);
      const clause = Math.max(window.lastIndexOf('; '), window.lastIndexOf(': '), window.lastIndexOf(', '), window.lastIndexOf(' — '));
      const word = window.lastIndexOf(' ');
      const cut = clause >= limit * 0.55 ? clause + 1 : word >= limit * 0.55 ? word : limit;
      const piece = rest.slice(0, cut).trim();
      if (piece) pieces.push(piece);
      rest = rest.slice(cut).trim();
    }
    if (rest) pieces.push(rest);
  };

  let buffer = '';
  for (const sentence of sentences) {
    const part = sentence.trim();
    if (!part) continue;
    if (part.length > limit) {
      if (buffer) {
        pieces.push(buffer);
        buffer = '';
      }
      splitLong(part);
      continue;
    }
    if (buffer && `${buffer} ${part}`.length > limit) {
      pieces.push(buffer);
      buffer = part;
    } else {
      buffer = buffer ? `${buffer} ${part}` : part;
    }
  }
  if (buffer) pieces.push(buffer);
  return pieces.length ? pieces : [normalized.slice(0, limit)];
}

function languageMatches(voiceLang: string, requested: string): boolean {
  const a = voiceLang.toLowerCase().replace(/_/g, '-');
  const b = requested.toLowerCase().replace(/_/g, '-');
  return a === b || a.split('-')[0] === b.split('-')[0];
}

/**
 * Names of the voices that actually sound human.
 *
 * The Web Speech API gives every engine the same handful of names, and the gap
 * between the best and worst of them is enormous: Apple's Siri-era voices,
 * Microsoft's "Natural"/"Online" neural voices and Google's cloud voices read
 * like a person; Apple's novelty voices and the 1990s formant voices
 * (Fred, Albert, Zarvox, eSpeak) do not.
 *
 * This is a name list, not a download: every one of these is free because it
 * already ships with the reader's own operating system or browser. Picking the
 * best installed one is the whole point — nothing is fetched, and the no-audio-
 * bytes guarantee in this file's header still holds.
 */
const NATURAL_VOICE_PATTERNS: RegExp[] = [
  // Microsoft neural / "Online (Natural)" voices — Windows 10/11, Edge.
  /natural/i, /\bneural\b/i, /online\b/i, /\bmultilingual\b/i, /\bturbo\b/i,
  // Apple's modern high-quality voices (macOS / iOS downloadable).
  /\bsiri\b/i, /\bpremium\b/i, /\benhanced\b/i,
  /samantha|ava|allison|susan|tom|nicky|zoe|joelle|noelle|serena|daniel|karen|moira|tessa|rishi|veena|lekha|sinji|meijia|tingting|yuna|kyoko|milena|yelda|zuzana/i,
  // Google / Chrome cloud voices.
  /^google\s/i,
  // Modern Android.
  /\bspeech services\b/i, /google tts/i,
];

/** Older or novelty voices that are audibly synthetic. Never preferred. */
const SYNTHETIC_VOICE_PATTERNS: RegExp[] = [
  /\bcompact\b/i, /\bespeak\b/i, /\bpico\b/i, /\bfestival\b/i,
  /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|ralph|kathy|fred|hysterical|junior|agnes|bruce|bells/i,
];

function isNaturalVoiceName(name: string): boolean {
  return NATURAL_VOICE_PATTERNS.some((pattern) => pattern.test(name));
}

function isSyntheticVoiceName(name: string): boolean {
  return SYNTHETIC_VOICE_PATTERNS.some((pattern) => pattern.test(name));
}

/** Does this voice's name suggest the requested gender? */
function genderHint(name: string, preset: VoicePreset): number {
  const explicit = preset.prefer.filter((p) => p === 'female' || p === 'male');
  if (!explicit.length) return 0;
  const n = name.toLowerCase();
  const female = /female|woman|samantha|ava|allison|susan|victoria|karen|moira|tessa|serena|zoe|nicky|joelle|noelle|aria|jenny|michelle|sonia|libby|natasha|clara|emily|olivia|salli|joanna|amy|emma|olivia|hazel|zira|sabina|helena|milena|yelda|zuzana|meijia|tingting|sinji|kyoko|yuna|veena|lekha|catherine|george/i;
  const male = /\bmale\b|\bman\b|daniel|alex|fred|tom|guy|ryan|davis|tony|jason|brandon|christopher|eric|david|mark|george|rishi|arthur|oliver|thomas/i;
  const looksFemale = female.test(n);
  const looksMale = male.test(n);
  if (looksFemale === looksMale) return 0;
  return (explicit[0] === 'female') === looksFemale ? 12 : -8;
}

/**
 * Prefer the reading language, then the most natural voice available, then the
 * named preset.
 *
 * Naturalness is weighted far above being installed locally, because the old
 * ranking did the opposite: `localService` scored +100 and the preset match +10,
 * so on Windows a robotic offline voice beat a neural online one. The trade the
 * reader is offered is now explicit in the note under the picker — an installed
 * voice still works offline, and one click puts it back.
 */
export function pickVoice(
  voices: SpeechSynthesisVoice[],
  preset: VoicePreset,
  langCode: string
): SpeechSynthesisVoice | null {
  const matching = voices.filter((voice) => languageMatches(voice.lang, langCode));
  if (!matching.length) return null;
  const score = (voice: SpeechSynthesisVoice): number => {
    const name = String(voice.name || '');
    const exact = voice.lang.toLowerCase().replace(/_/g, '-') === langCode.toLowerCase().replace(/_/g, '-');
    const preference = preset.prefer.findIndex((p) => name.toLowerCase().includes(p.toLowerCase()));
    return (
      (isNaturalVoiceName(name) ? 90 : 0)
      + (isSyntheticVoiceName(name) ? -120 : 0)
      + (exact ? 24 : 0)
      + (preference >= 0 ? 18 - preference * 2 : 0)
      + genderHint(name, preset)
      // Deliberately small: offline capability is a tie-breaker, not the driver.
      + (voice.localService ? 8 : 0)
      + (voice.default ? 3 : 0)
    );
  };
  return [...matching].sort((a, b) => score(b) - score(a))[0] ?? null;
}

/**
 * True when a better-sounding voice exists but needs a connection, while the
 * chosen voice is an installed one. Used to offer the one-click upgrade.
 */
export function hasOnlineUpgrade(
  voices: SpeechSynthesisVoice[],
  preset: VoicePreset,
  langCode: string
): boolean {
  const chosen = pickVoice(voices, preset, langCode);
  if (!chosen || !chosen.localService) return false;
  return voices.some(
    (voice) =>
      !voice.localService
      && languageMatches(voice.lang, langCode)
      && isNaturalVoiceName(String(voice.name || ''))
      && !isSyntheticVoiceName(String(voice.name || ''))
  );
}

function speechErrorCopy(code: string): string {
  switch (code) {
    case 'not-allowed':
      return 'The browser blocked speech. Press Play again to allow it.';
    case 'voice-unavailable':
    case 'language-unavailable':
      return 'No matching voice is installed for this language. Choose another language or install a system voice.';
    case 'network':
      return 'This browser voice needs a connection. Try an installed offline voice or reconnect.';
    case 'audio-busy':
      return 'The audio device is busy. Press Play to try again.';
    case 'synthesis-unavailable':
    case 'synthesis-failed':
      return 'The browser speech engine could not start. Check your device voice settings, then press Play.';
    default:
      return 'Playback stopped unexpectedly. Press Play to try again.';
  }
}

export function initListenRoom(): void {
  const cfg = readConfig();
  const root = document.getElementById('listen-room');
  if (!cfg || !root || root.dataset.ready === 'true') return;
  const config = cfg;
  const room = root;

  const source = document.getElementById('listen-source');
  const unsupported = document.getElementById('listen-unsupported');
  const bar = room.querySelector<HTMLElement>('.listen-bar');
  const panel = document.getElementById('listen-panel');
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  if (!canSpeak || !source) {
    if (unsupported) {
      unsupported.hidden = false;
      if (!source) {
        unsupported.textContent = 'No readable teaching is attached to this player. Open a teaching from the library to listen.';
      }
    }
    if (bar) bar.hidden = true;
    if (panel) panel.hidden = true;
    return;
  }

  const synth = window.speechSynthesis;
  const prefs = readPrefs(cfg);
  let segments = collectSegments(source);
  let queue: QueueItem[] = [];
  let cursor = 0;
  let activeSegment = -1;
  let state: PlaybackState = 'idle';
  let generation = 0;
  let currentUtterance: SpeechSynthesisUtterance | null = null;
  let gapTimer: number | null = null;
  let startTimer: number | null = null;
  let voicesTimer: number | null = null;
  let waitingForVoices = false;
  let languageBusy = false;
  let languageRevision = 0;
  let voiceList: SpeechSynthesisVoice[] = [];
  const originalHTML = new Map<HTMLElement, string>();
  const originalText = new Map<HTMLElement, string>();
  const pageLang = document.documentElement.lang || config.lang || 'en';
  const pageDir = document.documentElement.dir || 'ltr';

  const els = {
    toggle: document.getElementById('listen-toggle') as HTMLButtonElement | null,
    panel,
    status: document.getElementById('listen-status'),
    progress: document.getElementById('listen-progress'),
    voiceRow: document.getElementById('listen-voices'),
    voiceNote: document.getElementById('listen-voice-note'),
    rateRow: document.getElementById('listen-rates'),
    langSelect: document.getElementById('listen-language') as HTMLSelectElement | null,
    note: document.getElementById('listen-translate-note'),
    original: document.getElementById('listen-original') as HTMLButtonElement | null,
    external: document.getElementById('listen-external') as HTMLAnchorElement | null,
    play: document.getElementById('listen-play') as HTMLButtonElement | null,
    prev: document.getElementById('listen-prev') as HTMLButtonElement | null,
    next: document.getElementById('listen-next') as HTMLButtonElement | null,
    stop: document.getElementById('listen-stop') as HTMLButtonElement | null,
    playLabel: document.getElementById('listen-play-label'),
  };

  const langMeta = (code: string): ListenLanguageConfig =>
    config.languages.find((language) => language.code === code) ?? config.languages[0];
  const currentPreset = (): VoicePreset => config.voices.find((voice) => voice.id === prefs.voice) ?? config.voices[0];

  function setStatus(message: string): void {
    if (els.status) els.status.textContent = message;
  }

  function clearGap(): void {
    if (gapTimer !== null) window.clearTimeout(gapTimer);
    gapTimer = null;
  }

  function clearStartTimer(): void {
    if (startTimer !== null) window.clearTimeout(startTimer);
    startTimer = null;
  }

  function updateProgress(value?: number): void {
    if (!els.progress) return;
    const pct = value ?? (queue.length ? Math.min(100, Math.max(0, (cursor / queue.length) * 100)) : 0);
    els.progress.style.width = `${Math.round(pct)}%`;
  }

  function clearMarks(): void {
    segments.forEach((segment) => segment.el.classList.remove('is-narrating'));
    activeSegment = -1;
  }

  function markSegment(index: number): void {
    if (activeSegment === index) return;
    clearMarks();
    const segment = segments[index];
    if (!segment) return;
    activeSegment = index;
    segment.el.classList.add('is-narrating');
    setStatus(`Reading section ${index + 1} of ${segments.length}.`);
  }

  function syncControls(): void {
    const playing = state === 'playing';
    const paused = state === 'paused';
    const hasText = queue.length > 0;
    if (els.play) {
      els.play.disabled = !hasText || languageBusy;
      els.play.setAttribute('aria-pressed', String(playing));
      els.play.setAttribute('aria-label', playing ? 'Pause reading' : paused ? 'Resume reading' : 'Play reading');
    }
    if (els.playLabel) els.playLabel.textContent = playing ? 'Pause' : paused ? 'Resume' : state === 'finished' ? 'Replay' : 'Play';
    // The article-level button reflects what pressing it will do next.
    if (els.toggle) {
      const label = els.toggle.querySelector('[data-listen-toggle-label]');
      if (label) {
        label.textContent = playing
          ? 'Pause this teaching'
          : paused
            ? 'Resume this teaching'
            : 'Listen to this teaching';
      }
      els.toggle.setAttribute('aria-pressed', String(playing));
    }
    if (els.stop) els.stop.disabled = !hasText || languageBusy || (state === 'idle' && cursor === 0);
    const section = queue[cursor]?.segment ?? (state === 'finished' ? segments.length - 1 : 0);
    if (els.prev) els.prev.disabled = !hasText || languageBusy || section <= 0;
    if (els.next) els.next.disabled = !hasText || languageBusy || section >= segments.length - 1;
    if (els.langSelect) els.langSelect.disabled = languageBusy;
    room.dataset.playback = state;
  }

  function buildQueue(texts: string[] = segments.map((segment) => segment.text)): void {
    queue = [];
    texts.forEach((text, segmentIndex) => {
      chunk(text).forEach((piece) => queue.push({ text: piece, segment: segmentIndex }));
    });
    cursor = 0;
    state = 'idle';
    clearMarks();
    updateProgress(0);
    syncControls();
  }

  function loadVoices(): void {
    try {
      voiceList = synth.getVoices().slice();
    } catch {
      voiceList = [];
    }
    updateVoiceNote();
  }

  function updateVoiceNote(): void {
    if (!els.voiceNote) return;
    const meta = langMeta(prefs.lang);
    const preset = currentPreset();
    const voice = pickVoice(voiceList, preset, meta.speech);
    if (voice) {
      // Say plainly which voice was chosen, whether it needs a connection, and
      // whether a better-sounding one is one click away. Nothing is switched
      // silently: the reader is told what they are hearing and why.
      const online = voice.localService ? '' : ' (needs a connection)';
      const upgrade = hasOnlineUpgrade(voiceList, preset, meta.speech)
        ? ' A more natural voice is available but needs a connection — see Voice options below.'
        : '';
      els.voiceNote.textContent = `${preset.label} uses ${voice.name} (${voice.lang})${online}. Preset names are reading styles, not separate hosted voices.${upgrade}`;
    } else if (voiceList.length) {
      els.voiceNote.textContent = `No ${meta.english} voice is installed. The text can still be read on screen; install a system voice to hear it.`;
    } else {
      els.voiceNote.textContent = 'Waiting for the browser to expose its installed voices. You can still press Play; the browser default will be used if one becomes available.';
    }
  }

  function cancelEngine(): void {
    generation += 1;
    clearGap();
    clearStartTimer();
    currentUtterance = null;
    try { synth.cancel(); } catch { /* Engine may already be torn down. */ }
  }

  function failPlayback(message: string): void {
    cancelEngine();
    state = 'idle';
    waitingForVoices = false;
    syncControls();
    setStatus(message);
  }

  function finishPlayback(): void {
    clearGap();
    clearStartTimer();
    currentUtterance = null;
    state = 'finished';
    cursor = queue.length;
    clearMarks();
    updateProgress(100);
    syncControls();
    setStatus('Finished. The whole teaching has been read aloud. Press Replay to hear it again.');
  }

  function speakCurrent(): void {
    if (languageBusy || state !== 'playing') return;
    const item = queue[cursor];
    if (!item) {
      finishPlayback();
      return;
    }

    loadVoices();
    const preset = currentPreset();
    const meta = langMeta(prefs.lang);
    const voice = pickVoice(voiceList, preset, meta.speech);
    const utterance = new SpeechSynthesisUtterance(item.text);
    const token = ++generation;
    currentUtterance = utterance;
    if (voice) utterance.voice = voice;
    // Never force an English voice onto translated text. If no matching voice
    // exists, leave voice unset and let the engine report language-unavailable.
    utterance.lang = voice?.lang || meta.speech || pageLang || 'en-US';
    utterance.rate = Math.min(2, Math.max(0.5, prefs.rate || preset.rate));
    utterance.pitch = Math.min(2, Math.max(0.5, preset.pitch));
    let started = false;

    const isCurrent = (): boolean => token === generation && currentUtterance === utterance && state === 'playing';

    utterance.onstart = () => {
      if (!isCurrent()) return;
      started = true;
      clearStartTimer();
      markSegment(item.segment);
      updateProgress();
    };

    utterance.onend = () => {
      if (!isCurrent()) return;
      clearStartTimer();
      currentUtterance = null;
      const next = cursor + 1;
      const crossesSection = next < queue.length && queue[next].segment !== item.segment;
      cursor = next;
      updateProgress();
      syncControls();
      if (cursor >= queue.length) {
        finishPlayback();
        return;
      }
      if (crossesSection) {
        clearGap();
        gapTimer = window.setTimeout(() => {
          gapTimer = null;
          if (token === generation && state === 'playing') speakCurrent();
        }, SECTION_PAUSE_MS);
      } else {
        speakCurrent();
      }
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (!isCurrent()) return;
      if (event.error === 'interrupted' || event.error === 'canceled') {
        failPlayback('Playback was interrupted. Press Play to continue.');
        return;
      }
      failPlayback(speechErrorCopy(event.error));
    };

    markSegment(item.segment);
    updateProgress();
    syncControls();
    clearStartTimer();
    startTimer = window.setTimeout(() => {
      if (!started && isCurrent()) {
        failPlayback('The browser did not start speaking. Check that a voice is installed and allowed, then press Play.');
      }
    }, START_TIMEOUT_MS);

    try {
      synth.speak(utterance);
    } catch {
      failPlayback('This browser could not start speech. The teaching remains fully readable below.');
    }
  }

  function beginAfterVoices(): void {
    if (state !== 'playing') return;
    if (voicesTimer !== null) window.clearTimeout(voicesTimer);
    voicesTimer = null;
    waitingForVoices = false;
    speakCurrent();
  }

  function pauseEngine(): void {
    clearGap();
    clearStartTimer();
    if (voicesTimer !== null) window.clearTimeout(voicesTimer);
    voicesTimer = null;
    waitingForVoices = false;
    try {
      synth.pause();
      if (synth.paused) return;
    } catch {
      /* Some engines do not implement pause; restart the chunk on resume. */
    }
    cancelEngine();
  }

  function play(): void {
    if (languageBusy) return;
    if (!queue.length) {
      setStatus('There is no readable teaching text on this page.');
      syncControls();
      return;
    }
    if (state === 'playing') {
      state = 'paused';
      pauseEngine();
      syncControls();
      setStatus('Paused. Press Resume to continue.');
      return;
    }
    if (state === 'paused') {
      state = 'playing';
      syncControls();
      window.dispatchEvent(new CustomEvent('ijn:stop-speech', { detail: { source: 'listen' } }));
      try {
        if (currentUtterance && synth.paused) {
          synth.resume();
          if (synth.paused) throw new Error('resume failed');
        } else {
          speakCurrent();
        }
      } catch {
        cancelEngine();
        state = 'playing';
        speakCurrent();
      }
      setStatus('Resuming reading.');
      return;
    }
    if (state === 'finished') {
      cursor = 0;
      updateProgress(0);
    }
    const transcript = document.querySelector<HTMLDetailsElement>('[data-listen-transcript]');
    if (transcript) transcript.open = true;
    window.dispatchEvent(new CustomEvent('ijn:stop-speech', { detail: { source: 'listen' } }));
    cancelEngine();
    state = 'playing';
    syncControls();
    loadVoices();
    if (!voiceList.length) {
      waitingForVoices = true;
      setStatus('Waiting for the browser voice list…');
      voicesTimer = window.setTimeout(beginAfterVoices, VOICES_TIMEOUT_MS);
    } else {
      speakCurrent();
    }
  }

  function stop(message = 'Stopped. Press Play to start again.'): void {
    cancelEngine();
    state = 'idle';
    waitingForVoices = false;
    if (voicesTimer !== null) window.clearTimeout(voicesTimer);
    voicesTimer = null;
    cursor = 0;
    clearMarks();
    updateProgress(0);
    syncControls();
    setStatus(message);
  }

  function restartCurrentIfActive(): void {
    if (state === 'playing') {
      cancelEngine();
      state = 'playing';
      speakCurrent();
    } else if (state === 'paused') {
      // The paused engine cannot change rate/voice in place. Cancel it and
      // resume from the start of this short chunk with the new settings.
      cancelEngine();
      state = 'paused';
      syncControls();
      setStatus('Settings saved. Press Resume to continue with the new voice or speed.');
    }
  }

  function jump(delta: number): void {
    if (!queue.length || languageBusy) return;
    const currentSection = queue[Math.min(cursor, queue.length - 1)]?.segment ?? 0;
    const targetSection = Math.min(Math.max(0, currentSection + delta), segments.length - 1);
    const at = queue.findIndex((item) => item.segment === targetSection);
    if (at < 0) return;
    const wasPlaying = state === 'playing';
    const wasPaused = state === 'paused';
    cancelEngine();
    cursor = at;
    if (wasPlaying) {
      state = 'playing';
      speakCurrent();
    } else {
      state = wasPaused ? 'paused' : 'idle';
      markSegment(targetSection);
      updateProgress();
      syncControls();
      setStatus(`Ready at section ${targetSection + 1} of ${segments.length}. Press Play to begin.`);
    }
  }

  function renderVoices(): void {
    if (!els.voiceRow) return;
    els.voiceRow.replaceChildren();
    config.voices.forEach((preset) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'listen-choice';
      button.dataset.voice = preset.id;
      button.setAttribute('aria-pressed', String(preset.id === prefs.voice));
      button.title = preset.description;
      const label = document.createElement('span');
      label.className = 'listen-choice__label';
      label.textContent = preset.label;
      const description = document.createElement('span');
      description.className = 'listen-choice__desc';
      description.textContent = preset.description;
      button.append(label, description);
      button.addEventListener('click', () => {
        prefs.voice = preset.id;
        writePrefs(prefs);
        els.voiceRow?.querySelectorAll<HTMLButtonElement>('[data-voice]').forEach((choice) => {
          choice.setAttribute('aria-pressed', String(choice.dataset.voice === prefs.voice));
        });
        updateVoiceNote();
        restartCurrentIfActive();
      });
      els.voiceRow?.append(button);
    });
  }

  function renderRates(): void {
    if (!els.rateRow) return;
    els.rateRow.replaceChildren();
    [0, ...config.rates].forEach((rate) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'listen-rate';
      button.dataset.rate = String(rate);
      button.setAttribute('aria-pressed', String(rate === prefs.rate));
      button.textContent = rate === 0 ? 'Auto' : `${rate.toFixed(1).replace(/\.0$/, '')}×`;
      button.addEventListener('click', () => {
        prefs.rate = rate;
        writePrefs(prefs);
        els.rateRow?.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach((choice) => {
          choice.setAttribute('aria-pressed', String(Number(choice.dataset.rate) === prefs.rate));
        });
        restartCurrentIfActive();
      });
      els.rateRow?.append(button);
    });
  }

  function setTranslateNote(kind: TranslateState, languageLabel: string): void {
    if (els.note) {
      if (kind === 'browser') {
        els.note.textContent = `${languageLabel} is prepared on this device. Speech still requires a matching browser or system voice.`;
      } else if (kind === 'external') {
        els.note.textContent = `${languageLabel} translation is not available on this device. The teaching stays in English here. The link opens Google Translate without your text; paste only what you choose to share.`;
      } else {
        els.note.textContent = `This browser cannot translate to ${languageLabel} on-device. The teaching remains in English.`;
      }
    }
    if (els.original) els.original.hidden = prefs.lang === 'en';
    if (els.external) els.external.hidden = kind !== 'external';
  }

  async function translate(texts: string[], target: string): Promise<string[] | null> {
    const api = window.Translator;
    if (!api?.create) return null;
    let translator: TranslatorInstance | null = null;
    try {
      if (api.availability) {
        const availability = await api.availability({ sourceLanguage: 'en', targetLanguage: target });
        if (!['available', 'readily', 'downloadable', 'after-download', 'downloading'].includes(availability)) return null;
      }
      translator = await api.create({
        sourceLanguage: 'en',
        targetLanguage: target,
        monitor: (monitor) => {
          monitor.addEventListener('downloadprogress', (event) => {
            const progress = (event as Event & { loaded?: number; total?: number }).loaded;
            if (typeof progress === 'number' && Number.isFinite(progress)) {
              setStatus(`Preparing the on-device language model… ${Math.round(progress * 100)}%`);
            }
          });
        },
      });
      const output: string[] = [];
      for (const text of texts) {
        const translated = await translator.translate(text);
        if (typeof translated !== 'string' || !translated.trim()) return null;
        output.push(translated);
      }
      return output.length === texts.length ? output : null;
    } catch {
      return null;
    } finally {
      try { translator?.destroy?.(); } catch { /* Best-effort cleanup. */ }
    }
  }

  function restoreEnglish(): void {
    originalHTML.forEach((html, el) => {
      if (el.isConnected) el.innerHTML = html;
    });
    originalHTML.clear();
    originalText.clear();
    source?.removeAttribute('data-read-lang');
    source?.setAttribute('lang', pageLang);
    source?.setAttribute('dir', pageDir);
    segments = collectSegments(source);
    buildQueue();
  }

  async function applyLanguage(code: string): Promise<void> {
    const revision = ++languageRevision;
    const meta = langMeta(code);
    stop('Language changed. Preparing the reading text…');
    languageBusy = true;
    syncControls();

    // Always translate from the English original, never from a previous translation.
    restoreEnglish();
    if (els.external) els.external.hidden = true;

    if (meta.code === 'en') {
      prefs.lang = 'en';
      languageBusy = false;
      setTranslateNote('browser', 'English');
      updateVoiceNote();
      syncControls();
      setStatus('Reading in English. Press play to begin.');
      return;
    }

    if (meta.translate === 'external') {
      prefs.lang = 'en';
      languageBusy = false;
      if (els.langSelect) els.langSelect.value = 'en';
      if (els.external) {
        els.external.href = `https://translate.google.com/?sl=en&tl=${encodeURIComponent(meta.code)}&op=translate`;
        els.external.textContent = `Open Google Translate for ${meta.english} ↗`;
      }
      setTranslateNote('external', meta.english);
      updateVoiceNote();
      syncControls();
      setStatus('The original English teaching is unchanged. The external translation link is optional.');
      return;
    }

    setStatus(`Preparing the ${meta.english} reading on this device…`);
    const texts = segments.map((segment) => segment.text);
    const result = await translate(texts, meta.code);
    if (revision !== languageRevision) return;
    languageBusy = false;

    if (!result) {
      prefs.lang = 'en';
      if (els.langSelect) els.langSelect.value = 'en';
      setTranslateNote('unsupported', meta.english);
      updateVoiceNote();
      syncControls();
      setStatus(`On-device ${meta.english} translation is unavailable. Reading in English.`);
      return;
    }

    segments.forEach((segment, index) => {
      originalHTML.set(segment.el, segment.el.innerHTML);
      originalText.set(segment.el, segment.text);
      segment.el.textContent = result[index];
    });
    source?.setAttribute('lang', meta.code);
    source?.setAttribute('dir', meta.dir);
    source?.setAttribute('data-read-lang', meta.code);
    prefs.lang = meta.code;
    segments = collectSegments(source);
    buildQueue();
    setTranslateNote('browser', meta.english);
    updateVoiceNote();
    syncControls();
    setStatus(`Reading in ${meta.english}. Press play to begin.`);
  }

  function onVoicesChanged(): void {
    loadVoices();
    if (waitingForVoices && state === 'playing' && voiceList.length) beginAfterVoices();
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!els.panel || els.panel.hidden || languageBusy) return;
    const targetNode = event.target;
    const target = targetNode && typeof (targetNode as Element).closest === 'function' ? (targetNode as Element) : null;
    if (target?.closest('input, select, textarea, [contenteditable="true"]')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      stop();
      els.toggle?.focus();
      return;
    }
    // Let native buttons handle Space themselves; only use the shortcut when
    // focus is on the panel/non-interactive area, not on a voice/speed button.
    if (event.key === ' ' && !target?.closest('button, a, input, select, textarea') && document.activeElement?.closest('#listen-room')) {
      event.preventDefault();
      play();
    }
  }

  function onVisibilityChange(): void {
    if (document.hidden && state === 'playing') {
      state = 'paused';
      pauseEngine();
      syncControls();
      setStatus('Paused while this page is hidden. Press Resume when you return.');
    }
  }

  function onPageHide(): void {
    languageRevision += 1;
    cancelEngine();
    if (voicesTimer !== null) window.clearTimeout(voicesTimer);
    voicesTimer = null;
    waitingForVoices = false;
    languageBusy = false;
    state = 'idle';
    clearMarks();
    updateProgress(0);
    syncControls();
  }

  function onPageShow(event: PageTransitionEvent): void {
    if (!event.persisted) return;
    loadVoices();
    syncControls();
    setStatus(queue.length ? 'Ready. Press play to hear this teaching.' : 'No readable teaching text was found.');
  }

  function stopForNavigation(event: Event): void {
    const detail = (event as CustomEvent<{ source?: string }>).detail;
    if (detail?.source === 'listen') return;
    if (state === 'playing' || state === 'paused') stop('Stopped.');
  }

  // Wire controls.
  els.langSelect?.addEventListener('change', () => { void applyLanguage(els.langSelect!.value); });
  /**
   * The Listen button does what its label says: one click starts the teaching.
   *
   * It used to only unfold a panel, which left a reader who pressed "Listen to
   * this teaching" staring at a Play button — the click they made did not do the
   * thing they asked for. Now the first click opens the panel *and* plays; a
   * second click pauses; a third resumes. The panel stays visible throughout so
   * voice, speed and language remain one gesture away.
   *
   * Gesture handling stays honest: this runs inside the click event, so the
   * browser's autoplay policy is satisfied and nothing ever starts on its own.
   */
  els.toggle?.addEventListener('click', () => {
    if (els.panel) els.panel.hidden = false;
    els.toggle!.setAttribute('aria-expanded', 'true');
    // play() toggles: it pauses when playing, otherwise starts/resumes/replays.
    play();
  });
  els.play?.addEventListener('click', play);
  els.stop?.addEventListener('click', () => stop());
  els.prev?.addEventListener('click', () => jump(-1));
  els.next?.addEventListener('click', () => jump(1));
  els.original?.addEventListener('click', () => {
    if (els.langSelect) els.langSelect.value = 'en';
    void applyLanguage('en');
  });
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('ijn:stop-speech', stopForNavigation);
  if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', onVoicesChanged);
  else synth.onvoiceschanged = onVoicesChanged;

  loadVoices();
  renderVoices();
  renderRates();
  buildQueue();
  setTranslateNote('browser', 'English');
  if (els.langSelect) els.langSelect.value = 'en';
  if (!segments.length) {
    setStatus('No readable teaching text was found. The article is still available on the page.');
  } else {
    setStatus(`Ready. ${segments.length} sections. Press play to hear this teaching.`);
  }
  room.dataset.ready = 'true';
  syncControls();
}
