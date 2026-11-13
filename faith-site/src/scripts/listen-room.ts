/**
 * The Listening Room — on-device article narration + translation.
 *
 * Design constraints, in order of importance:
 *   1. Never play without an explicit click. No autoplay anywhere, ever.
 *   2. Never ship audio bytes. Speech comes from the platform
 *      (`speechSynthesis`), so there is no TTS vendor, no key, no quota, and no
 *      reader audio leaving the device.
 *   3. Never fake a translation. If the browser has no on-device model for the
 *      chosen language, the UI says so and offers the original — it does not
 *      quietly send the article to a machine-translation endpoint.
 *   4. Degrade cleanly. Without JS the controls stay hidden (rendered by JS) and
 *      the article is exactly as it was before this feature existed.
 *
 * State lives in localStorage under `ijn-listen` so a reader's voice, rate, and
 * language survive the 365 days of the slate.
 */

type TranslateState = 'browser' | 'external' | 'unsupported';

interface ListenLanguageConfig {
  code: string;
  label: string;
  english: string;
  speech: string;
  translate: TranslateState;
  dir: 'ltr' | 'rtl';
}

interface ListenConfig {
  lang: string;
  languages: ListenLanguageConfig[];
  voices: Array<{
    id: string;
    label: string;
    description: string;
    prefer: string[];
    rate: number;
    pitch: number;
  }>;
  rates: number[];
  /** Page-specific. */
  articleTitle: string;
  articleUrl: string;
  /** Slug of the nearest "listen to the library" destination. */
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

declare global {
  interface Window {
    Translator?: {
      availability?: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<string>;
      create?: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<{
        translate: (text: string) => Promise<string>;
        destroy?: () => void;
      }>;
    };
  }
}

const STORAGE_KEY = 'ijn-listen';

function readConfig(): ListenConfig | null {
  const el = document.getElementById('listen-room-config');
  if (!el) return null;
  try {
    return JSON.parse(el.textContent || '{}') as ListenConfig;
  } catch {
    return null;
  }
}

function readPrefs(): ListenPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { voice: 'dawn', rate: 0, lang: 'en' };
    const p = JSON.parse(raw) as Partial<ListenPrefs>;
    return {
      voice: typeof p.voice === 'string' ? p.voice : 'dawn',
      rate: typeof p.rate === 'number' ? p.rate : 0,
      lang: typeof p.lang === 'string' ? p.lang : 'en',
    };
  } catch {
    return { voice: 'dawn', rate: 0, lang: 'en' };
  }
}

function writePrefs(p: ListenPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* private mode — preferences simply do not persist */
  }
}

/** Collect the readable blocks of the article in document order. */
function collectSegments(): Segment[] {
  const root = document.getElementById('listen-source') || document.body;
  const selector =
    '#listen-source .article-prose p, #listen-source .article-prose li, ' +
    '#listen-source .article-prose blockquote, #listen-source .theme-scripture blockquote, ' +
    '#listen-source .declaration-text, #listen-source .reaffirmation-text, ' +
    '#listen-source h2, #listen-source h3';

  const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector));
  return nodes
    .map((el) => ({
      el,
      text: cleanText(el.textContent || ''),
    }))
    .filter((s) => s.text.length > 2);
}

/** Strip citation punctuation and collapse whitespace so speech sounds natural. */
function cleanText(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .replace(/[“”„]/g, '"')
    .replace(/\u00a0/g, ' ')
    .trim();
}

/**
 * Split long blocks into sentence-sized chunks. Chrome silently drops
 * utterances longer than ~15s on some platforms, and per-chunk batching is also
 * what lets us highlight the block currently being read.
 */
function chunk(text: string, max = 240): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [text];
  const out: string[] = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > max && buf) {
      out.push(buf.trim());
      buf = '';
    }
    buf += s;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.length ? out : [text];
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  preset: ListenConfig['voices'][number],
  langCode: string
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const langMatch = (v: SpeechSynthesisVoice) =>
    v.lang.toLowerCase().startsWith(langCode.toLowerCase().split('-')[0]);

  for (const want of preset.prefer) {
    const hit = voices.find((v) => v.name.toLowerCase().includes(want.toLowerCase()) && langMatch(v));
    if (hit) return hit;
  }
  // An English preset voice is still better than silence when reading French.
  for (const want of preset.prefer) {
    const hit = voices.find((v) => v.name.toLowerCase().includes(want.toLowerCase()));
    if (hit) return hit;
  }
  return voices.find(langMatch) || voices[0];
}

export function initListenRoom(): void {
  const cfg = readConfig();
  if (!cfg) return;

  const root = document.getElementById('listen-room');
  if (!root) return;

  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  if (!canSpeak) {
    // No repair needed: the controls are replaced by an honest note and the
    // article below is untouched.
    const fallback = document.getElementById('listen-unsupported');
    if (fallback) fallback.hidden = false;
    const bar = root.querySelector('.listen-bar');
    if (bar instanceof HTMLElement) bar.hidden = true;
    return;
  }

  const prefs = readPrefs();
  let segments = collectSegments();
  let speaking = false;
  let paused = false;
  let cursor = 0; // index into `queue`
  let queue: Array<{ text: string; segment: number }> = [];
  let activeSegment = -1;

  const els = {
    toggle: document.getElementById('listen-toggle') as HTMLButtonElement | null,
    panel: document.getElementById('listen-panel'),
    status: document.getElementById('listen-status'),
    progress: document.getElementById('listen-progress') as HTMLElement | null,
    voiceRow: document.getElementById('listen-voices'),
    rateRow: document.getElementById('listen-rates'),
    langSelect: document.getElementById('listen-language') as HTMLSelectElement | null,
    note: document.getElementById('listen-translate-note'),
    original: document.getElementById('listen-original') as HTMLButtonElement | null,
    play: document.getElementById('listen-play') as HTMLButtonElement | null,
    prev: document.getElementById('listen-prev') as HTMLButtonElement | null,
    next: document.getElementById('listen-next') as HTMLButtonElement | null,
    stop: document.getElementById('listen-stop') as HTMLButtonElement | null,
    playLabel: document.getElementById('listen-play-label'),
  };

  const voiceList: SpeechSynthesisVoice[] = [];
  const loadVoices = () => {
    voiceList.length = 0;
    voiceList.push(...window.speechSynthesis.getVoices());
  };
  loadVoices();
  if (typeof window.speechSynthesis.addEventListener === 'function') {
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  const langMeta = (code: string): ListenLanguageConfig =>
    cfg!.languages.find((l) => l.code === code) ?? cfg!.languages[0];

  const currentPreset = () =>
    cfg.voices.find((v) => v.id === prefs.voice) ?? cfg.voices[0];

  /** Build the playback queue from whichever text is currently on screen. */
  function buildQueue(texts: string[]): void {
    queue = [];
    texts.forEach((text, segmentIndex) => {
      chunk(text).forEach((piece) => queue.push({ text: piece, segment: segmentIndex }));
    });
    cursor = 0;
  }

  function setStatus(message: string): void {
    if (els.status) els.status.textContent = message;
  }

  function markSegment(index: number): void {
    if (activeSegment >= 0 && segments[activeSegment]) {
      segments[activeSegment].el.classList.remove('is-narrating');
    }
    activeSegment = index;
    const seg = segments[index];
    if (seg) {
      seg.el.classList.add('is-narrating');
      const total = segments.length;
      if (els.status) {
        setStatus(`Reading section ${index + 1} of ${total}`);
      }
      if (els.progress) {
        els.progress.style.width = `${Math.round(((index + 1) / total) * 100)}%`;
      }
    }
  }

  function clearMarks(): void {
    segments.forEach((s) => s.el.classList.remove('is-narrating'));
    activeSegment = -1;
    if (els.progress) els.progress.style.width = '0%';
  }

  function speakCurrent(): void {
    if (!queue.length) return;
    const item = queue[cursor];
    if (!item) return stop();

    const preset = currentPreset();
    const utter = new SpeechSynthesisUtterance(item.text);
    const langCode = prefs.lang;
    const voice = pickVoice(voiceList, preset, langMeta(langCode).speech);
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang || langMeta(langCode).speech || 'en-US';
    utter.rate = prefs.rate || preset.rate;
    utter.pitch = preset.pitch;

    utter.onend = () => {
      if (!speaking) return;
      // Between blocks, hold a beat: this is a devotional, not a news feed.
      const pausesBetweenBlocks = cursor + 1 < queue.length && queue[cursor + 1].segment !== item.segment;
      cursor += 1;
      if (cursor >= queue.length) {
        speaking = false;
        paused = false;
        syncPlayButton();
        setStatus('Finished. The whole teaching has been read aloud.');
        clearMarks();
        return;
      }
      if (pausesBetweenBlocks) {
        window.setTimeout(() => speaking && speakCurrent(), 420);
      } else {
        speakCurrent();
      }
    };

    utter.onerror = (event: SpeechSynthesisErrorEvent) => {
      // 'interrupted' and 'canceled' are our own stop button — not failures.
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      speaking = false;
      syncPlayButton();
      setStatus('Playback stopped by the browser. Press play to continue.');
    };

    if (queue[cursor].segment !== activeSegment) markSegment(queue[cursor].segment);
    window.speechSynthesis.speak(utter);
  }

  function syncPlayButton(): void {
    if (!els.play) return;
    els.play.setAttribute('aria-pressed', speaking && !paused ? 'true' : 'false');
    if (els.playLabel) {
      els.playLabel.textContent = speaking && !paused ? 'Pause' : paused ? 'Resume' : 'Play';
    }
  }

  function play(): void {
    if (!queue.length) buildQueue(segments.map((s) => s.text));
    if (paused) {
      paused = false;
      speaking = true;
      window.speechSynthesis.resume();
      syncPlayButton();
      return;
    }
    if (speaking) {
      paused = true;
      window.speechSynthesis.pause();
      syncPlayButton();
      setStatus('Paused.');
      return;
    }
    speaking = true;
    syncPlayButton();
    speakCurrent();
  }

  function stop(): void {
    speaking = false;
    paused = false;
    window.speechSynthesis.cancel();
    syncPlayButton();
    clearMarks();
    setStatus('Stopped.');
  }

  function jump(delta: number): void {
    if (!queue.length) return;
    const targetSegment = Math.min(
      Math.max(0, (queue[cursor]?.segment ?? 0) + delta),
      segments.length - 1
    );
    const at = queue.findIndex((q) => q.segment === targetSegment);
    if (at === -1) return;
    const wasSpeaking = speaking;
    window.speechSynthesis.cancel();
    cursor = at;
    if (wasSpeaking) {
      speaking = true;
      speakCurrent();
    } else {
      markSegment(targetSegment);
      setStatus(`Ready at section ${targetSegment + 1} of ${segments.length}.`);
    }
  }

  // ---------------------------------------------------------------- rendering
  function renderVoices(): void {
    if (!els.voiceRow) return;
    els.voiceRow.innerHTML = cfg!.voices
      .map(
        (v) => `
        <button type="button" class="listen-choice" data-voice="${v.id}"
          aria-pressed="${v.id === prefs.voice ? 'true' : 'false'}"
          title="${v.description}">
          <span class="listen-choice__label">${v.label}</span>
          <span class="listen-choice__desc">${v.description}</span>
        </button>`
      )
      .join('');

    els.voiceRow.querySelectorAll<HTMLButtonElement>('[data-voice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        prefs.voice = btn.dataset.voice || 'dawn';
        writePrefs(prefs);
        renderVoices();
        if (speaking) {
          // Apply immediately: restart the current sentence in the new voice.
          const wasSpeaking = speaking;
          window.speechSynthesis.cancel();
          speaking = wasSpeaking;
          speakCurrent();
        }
      });
    });
  }

  function renderRates(): void {
    if (!els.rateRow) return;
    const active = prefs.rate || 0;
    els.rateRow.innerHTML =
      `<button type="button" class="listen-rate" data-rate="0" aria-pressed="${active === 0}">Auto</button>` +
      cfg!.rates
        .map(
          (r) =>
            `<button type="button" class="listen-rate" data-rate="${r}" aria-pressed="${
              active === r
            }">${r.toFixed(1).replace(/\.0$/, '')}×</button>`
        )
        .join('');

    els.rateRow.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        prefs.rate = Number(btn.dataset.rate || 0);
        writePrefs(prefs);
        renderRates();
        if (speaking) {
          window.speechSynthesis.cancel();
          speaking = true;
          speakCurrent();
        }
      });
    });
  }

  function setTranslateNote(state: TranslateState, langLabel: string): void {
    if (!els.note) return;
    if (state === 'browser') {
      els.note.textContent = `${langLabel} is read on this device. Nothing is sent to a server.`;
    } else if (state === 'external') {
      els.note.textContent = `No on-device ${langLabel} model is available in this browser. You can open this teaching in an external translation service, or keep listening in English.`;
    } else {
      els.note.textContent = `This browser cannot translate to ${langLabel} yet. The teaching will be read in English.`;
    }
    if (els.original) els.original.hidden = prefs.lang === 'en';
  }

  async function translate(texts: string[], target: string): Promise<string[] | null> {
    const api = window.Translator;
    if (!api?.create) return null;
    try {
      if (api.availability) {
        const state = await api.availability({ sourceLanguage: 'en', targetLanguage: target });
        if (state === 'unavailable' || state === 'no') return null;
      }
      const translator = await api.create({ sourceLanguage: 'en', targetLanguage: target });
      const out: string[] = [];
      for (const t of texts) out.push(await translator.translate(t));
      translator.destroy?.();
      return out;
    } catch {
      return null;
    }
  }

  /** Put the article back into English, whatever state it is in. */
  function restoreEnglish(): void {
    document.querySelectorAll<HTMLElement>('#listen-source [data-original-text]').forEach((el) => {
      const original = el.dataset.originalText;
      if (original) el.textContent = original;
      delete el.dataset.originalText;
    });
    document.documentElement.removeAttribute('data-read-lang');
    document.documentElement.removeAttribute('dir');
    document.documentElement.setAttribute('lang', 'en');
    segments = collectSegments();
    buildQueue(segments.map((s) => s.text));
  }

  async function applyLanguage(code: string): Promise<void> {
    const meta = langMeta(code);
    const wasSpeaking = speaking;
    if (wasSpeaking) stop();

    if (code === 'en') {
      restoreEnglish();
      prefs.lang = 'en';
      writePrefs(prefs);
      setTranslateNote('browser', 'English');
      setStatus('Reading in English. Press play to begin.');
      return;
    }

    // Languages with no on-device model are offered as a link-out. We never
    // send the article to a translation endpoint behind the reader's back.
    if (meta.translate === 'external') {
      setTranslateNote('external', meta.english);
      window.open(
        `https://translate.google.com/translate?sl=en&tl=${encodeURIComponent(code)}&u=${encodeURIComponent(
          cfg!.articleUrl
        )}`,
        '_blank',
        'noopener'
      );
      prefs.lang = 'en';
      writePrefs(prefs);
      if (els.langSelect) els.langSelect.value = 'en';
      return;
    }

    setStatus(`Preparing the ${meta.english} reading on this device…`);
    const original = collectSegments();
    const result = await translate(
      original.map((s) => s.text),
      code
    );
    if (!result) {
      setTranslateNote('unsupported', meta.english);
      prefs.lang = 'en';
      writePrefs(prefs);
      if (els.langSelect) els.langSelect.value = 'en';
      setStatus('This browser cannot translate on-device yet. Reading in English.');
      return;
    }

    // Paint the translation in place, keeping the original in a data attribute
    // so nothing is destroyed and switching back is instant and lossless.
    original.forEach((seg, i) => {
      if (!seg.el.dataset.originalText) seg.el.dataset.originalText = seg.text;
      seg.el.textContent = result[i];
    });
    if (meta.dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('data-read-lang', code);
    }
    document.documentElement.setAttribute('lang', code);
    prefs.lang = code;
    writePrefs(prefs);
    segments = collectSegments();
    buildQueue(segments.map((s) => s.text));
    setTranslateNote('browser', meta.english);
    setStatus(`Reading in ${meta.english}. Press play to begin.`);
  }

  // ------------------------------------------------------------- interactions
  if (els.langSelect) {
    // Only languages the browser can actually attempt are selectable.
    els.langSelect.querySelectorAll('option').forEach((opt) => {
      const value = (opt as HTMLOptionElement).value;
      const isExternal = opt.dataset.external === 'true';
      if (isExternal) opt.dataset.external = 'true';
      if (value === prefs.lang) (els.langSelect as HTMLSelectElement).value = value;
    });
    els.langSelect.addEventListener('change', () => {
      void applyLanguage(els.langSelect!.value);
    });
  }

  els.toggle?.addEventListener('click', () => {
    const open = els.toggle!.getAttribute('aria-expanded') === 'true';
    els.toggle!.setAttribute('aria-expanded', String(!open));
    if (els.panel) els.panel.hidden = open;
  });

  els.play?.addEventListener('click', play);
  els.stop?.addEventListener('click', stop);
  els.prev?.addEventListener('click', () => jump(-1));
  els.next?.addEventListener('click', () => jump(1));
  els.original?.addEventListener('click', () => {
    stop();
    void applyLanguage('en');
    if (els.langSelect) els.langSelect.value = 'en';
  });

  // Space toggles playback while the panel has focus, Escape stops.
  document.addEventListener('keydown', (event) => {
    const panel = els.panel;
    if (!panel || panel.hidden) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    if (event.key === 'Escape') {
      stop();
      els.toggle?.focus();
    }
    if (event.key === ' ' && document.activeElement?.closest('#listen-room')) {
      event.preventDefault();
      play();
    }
  });

  // Stop speech when the page is hidden — nobody wants a voice from a tab they
  // forgot about, and mobile browsers pause it anyway.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && speaking) {
      speaking = false;
      paused = posExists();
      window.speechSynthesis.pause();
      syncPlayButton();
    }
  });

  function posExists(): boolean {
    return queue.length > 0 && cursor < queue.length;
  }

  renderVoices();
  renderRates();
  setTranslateNote('browser', langMeta(prefs.lang).english);
  buildQueue(segments.map((s) => s.text));
  setStatus('Ready. Press play to hear this teaching.');
  root.dataset.ready = 'true';
}
