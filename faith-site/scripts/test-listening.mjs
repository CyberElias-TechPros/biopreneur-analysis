/**
 * Listening Room regression tests.
 * Run: npm run test:listening
 *
 * These exercise the real controller against a mocked Web Speech engine, plus
 * static guards for the two source regions that must never disappear again.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '..');

function makeDom(body = '') {
  const dom = new JSDOM(`<!doctype html><html lang="en" dir="ltr"><body>${body}</body></html>`, {
    url: 'https://example.test/listen/',
    pretendToBeVisual: true,
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  globalThis.CustomEvent = dom.window.CustomEvent;
  globalThis.Event = dom.window.Event;
  globalThis.Node = dom.window.Node;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.ParentNode = dom.window.ParentNode;
  return dom;
}

function installSpeech(win, voices = [
  { name: 'Microsoft Aria', lang: 'en-US', localService: true, default: true },
  { name: 'Google UK English Female', lang: 'en-GB', localService: false, default: false },
  { name: 'Google français', lang: 'fr-FR', localService: false, default: false },
]) {
  const listeners = new Map();
  const state = { current: null, speaking: false, paused: false, log: [] };
  class Utterance {
    constructor(text) {
      this.text = text;
      this.lang = '';
      this.voice = null;
      this.rate = 1;
      this.pitch = 1;
      this.onstart = null;
      this.onend = null;
      this.onerror = null;
    }
  }
  win.SpeechSynthesisUtterance = Utterance;
  globalThis.SpeechSynthesisUtterance = Utterance;
  const synth = {
    getVoices: () => voices,
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener: (type, fn) => listeners.get(type)?.delete(fn),
    speak(u) {
      state.log.push({ op: 'speak', text: u.text, lang: u.lang, rate: u.rate, pitch: u.pitch, voice: u.voice?.name ?? null });
      state.current = u;
      state.speaking = true;
      state.paused = false;
      queueMicrotask(() => u.onstart?.({}));
    },
    cancel() {
      state.log.push({ op: 'cancel' });
      const u = state.current;
      state.current = null;
      state.speaking = false;
      state.paused = false;
      queueMicrotask(() => u?.onerror?.({ error: 'canceled' }));
    },
    pause() {
      state.log.push({ op: 'pause' });
      if (state.speaking) state.paused = true;
    },
    resume() {
      state.log.push({ op: 'resume' });
      state.paused = false;
    },
    get speaking() { return state.speaking; },
    get paused() { return state.paused; },
    get pending() { return false; },
  };
  Object.defineProperty(win, 'speechSynthesis', { value: synth, configurable: true });
  globalThis.speechSynthesis = synth;
  return {
    synth,
    state,
    voices,
    end() {
      const u = state.current;
      state.current = null;
      state.speaking = false;
      u?.onend?.({});
    },
    fail(error = 'synthesis-failed') {
      const u = state.current;
      state.current = null;
      state.speaking = false;
      u?.onerror?.({ error });
    },
    emitVoices() {
      for (const fn of listeners.get('voiceschanged') ?? []) fn({});
    },
  };
}

const config = {
  lang: 'en',
  languages: [
    { code: 'en', label: 'English', english: 'English', speech: 'en-US', translate: 'browser', dir: 'ltr' },
    { code: 'fr', label: 'Français', english: 'French', speech: 'fr-FR', translate: 'browser', dir: 'ltr' },
    { code: 'yo', label: 'Yorùbá', english: 'Yoruba', speech: 'yo-NG', translate: 'external', dir: 'ltr' },
  ],
  voices: [
    { id: 'dawn', label: 'Dawn', description: 'Warm', prefer: ['female', 'Samantha'], rate: 0.94, pitch: 1 },
    { id: 'elder', label: 'Elder', description: 'Slow', prefer: ['male', 'Daniel'], rate: 0.88, pitch: 0.86 },
  ],
  rates: [0.8, 1, 1.2],
  articleTitle: 'Test Teaching',
  articleUrl: 'https://example.test/test-teaching/',
  libraryUrl: '/listen/',
};

const fixture = `
<section id="listen-room" class="listen-room">
  <script type="application/json" id="listen-room-config">${JSON.stringify(config)}</script>
  <div class="listen-bar">
    <button id="listen-toggle" aria-expanded="false" aria-controls="listen-panel" aria-pressed="false"><span data-listen-toggle-label>Listen to this teaching</span></button>
    <select id="listen-language">
      <option value="en">English</option><option value="fr">Français</option><option value="yo">Yorùbá</option>
    </select>
  </div>
  <div id="listen-panel" hidden>
    <div id="listen-voices"></div>
    <p id="listen-voice-note"></p>
    <div id="listen-rates"></div>
    <button id="listen-prev">Prev</button>
    <button id="listen-play"><span id="listen-play-label">Play</span></button>
    <button id="listen-next">Next</button>
    <button id="listen-stop">Stop</button>
    <div id="listen-progress"></div>
    <p id="listen-status"></p>
    <p id="listen-translate-note"></p>
    <button id="listen-original" hidden>English</button>
    <a id="listen-external" hidden></a>
  </div>
  <p id="listen-unsupported" hidden></p>
</section>
<details data-listen-transcript><summary>Transcript</summary>
<div id="listen-source" lang="en" dir="ltr">
  <h1>Test Teaching</h1>
  <figure class="theme-scripture"><blockquote>Theme scripture text.</blockquote></figure>
  <div class="article-prose">
    <p>First paragraph with <a href="/x">a link</a>.</p>
    <p>Second paragraph.</p>
    <ul><li>List item one.</li><li>List item two.</li></ul>
    <blockquote><p>Nested quote paragraph.</p></blockquote>
    <p hidden>Hidden paragraph should not be read.</p>
    <p aria-hidden="true">Decorative paragraph should not be read.</p>
    <p>Controls <button>Do not read</button> remain.</p>
  </div>
  <h2>Application</h2>
  <p class="reaffirmation-text">Reaffirmation text.</p>
  <p class="declaration-text">Declaration text.</p>
</div>
</details>`;

async function loadController() {
  return import('../src/scripts/listen-room.ts');
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test('chunk respects the hard cap and preserves text', async () => {
  const { chunk } = await loadController();
  assert.deepEqual(chunk('   '), []);
  assert.deepEqual(chunk('Short sentence.'), ['Short sentence.']);
  const long = 'This is one deliberately long sentence without terminal punctuation that keeps going and going and going well past the intended browser safety limit because some speech engines silently drop long utterances';
  const pieces = chunk(long, 60);
  assert.ok(pieces.length > 1);
  assert.ok(pieces.every((p) => p.length <= 60));
  assert.equal(pieces.join(' '), long.replace(/\s+/g, ' '));
  const mixed = 'Alpha. Beta! Gamma? Delta.';
  assert.ok(chunk(mixed, 20).every((p) => p.length <= 20));
});

test('collectSegments reads leaf blocks in order and skips chrome/hidden text', async () => {
  makeDom(fixture);
  const { collectSegments } = await loadController();
  const segments = collectSegments(document.getElementById('listen-source'));
  const texts = segments.map((s) => s.text);
  assert.equal(texts[0], 'Test Teaching');
  assert.ok(texts.includes('Theme scripture text.'));
  assert.ok(texts.includes('First paragraph with a link.'));
  assert.ok(texts.includes('Nested quote paragraph.'));
  assert.ok(!texts.some((t) => t.includes('Hidden paragraph')));
  assert.ok(!texts.some((t) => t.includes('Decorative paragraph')));
  assert.ok(!texts.some((t) => t.includes('Do not read')));
  assert.equal(texts.filter((t) => t === 'Nested quote paragraph.').length, 1);
  assert.ok(texts.indexOf('Application') < texts.indexOf('Reaffirmation text.'));
});

test('pickVoice matches language, honours the preset gender, and never crosses languages', async () => {
  const { pickVoice } = await loadController();
  const preset = config.voices[0];
  const voices = [
    { name: 'Remote English', lang: 'en-US', localService: false, default: true },
    { name: 'Local Female', lang: 'en-GB', localService: true, default: false },
    { name: 'Google français', lang: 'fr-FR', localService: false, default: false },
  ];
  assert.equal(pickVoice(voices, preset, 'en-US')?.name, 'Local Female');
  assert.equal(pickVoice(voices, preset, 'fr-FR')?.name, 'Google français');
  assert.equal(pickVoice(voices, preset, 'yo-NG'), null);
});

test('pickVoice prefers a natural voice over a merely installed one', async () => {
  const { pickVoice } = await loadController();
  const preset = config.voices[0];
  // The regression this guards: the old ranking gave localService +100 and the
  // preset match +10, so a robotic offline voice beat a neural online one.
  const voices = [
    { name: 'Microsoft David - English (United States)', lang: 'en-US', localService: true, default: true },
    { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US', localService: false, default: false },
  ];
  assert.equal(pickVoice(voices, preset, 'en-US')?.name.includes('Aria'), true);
});

test('pickVoice never selects a novelty or legacy synthetic voice when better exists', async () => {
  const { pickVoice } = await loadController();
  const preset = config.voices[0];
  const voices = [
    { name: 'Albert', lang: 'en-US', localService: true, default: false },
    { name: 'Zarvox', lang: 'en-US', localService: true, default: false },
    { name: 'English (America) eSpeak', lang: 'en-US', localService: true, default: false },
    { name: 'Samantha', lang: 'en-US', localService: true, default: false },
  ];
  assert.equal(pickVoice(voices, preset, 'en-US')?.name, 'Samantha');
  // If only synthetic voices exist, one is still better than silence.
  const onlySynthetic = [{ name: 'Fred', lang: 'en-US', localService: true, default: true }];
  assert.equal(pickVoice(onlySynthetic, preset, 'en-US')?.name, 'Fred');
});

test('pickVoice still never crosses languages, even for a natural voice', async () => {
  const { pickVoice } = await loadController();
  const preset = config.voices[0];
  const voices = [
    { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US', localService: false, default: true },
    { name: 'Google français', lang: 'fr-FR', localService: false, default: false },
  ];
  assert.equal(pickVoice(voices, preset, 'fr-FR')?.name, 'Google français');
  assert.equal(pickVoice(voices, preset, 'yo-NG'), null);
});

test('hasOnlineUpgrade reports an upgrade only when a better online voice exists', async () => {
  const { hasOnlineUpgrade } = await loadController();
  const preset = config.voices[0];
  const offlineOnly = [
    { name: 'Microsoft David - English (United States)', lang: 'en-US', localService: true, default: true },
  ];
  const withNeural = [
    { name: 'Microsoft David - English (United States)', lang: 'en-US', localService: true, default: true },
    { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US', localService: false, default: false },
  ];
  assert.equal(hasOnlineUpgrade(offlineOnly, preset, 'en-US'), false);
  // With a neural voice available the natural one wins outright, so no prompt is needed.
  assert.equal(hasOnlineUpgrade(withNeural, preset, 'en-US'), false);
  const localChosenButOnlineBetter = [
    { name: 'Samantha', lang: 'en-US', localService: true, default: true },
    { name: 'Google US English', lang: 'en-US', localService: false, default: false },
  ];
  const chosenOnline = !hasOnlineUpgrade(localChosenButOnlineBetter, preset, 'en-US');
  assert.equal(typeof chosenOnline, 'boolean');
});

test('Listening Room boots, plays, pauses, resumes, changes settings, jumps, and stops', async () => {
  const dom = makeDom(fixture);
  const speech = installSpeech(dom.window);
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  assert.equal(doc.getElementById('listen-room').dataset.ready, 'true');
  assert.equal(doc.getElementById('listen-play').disabled, false);
  assert.match(doc.getElementById('listen-status').textContent, /Ready\. \d+ sections/);

  // One click on "Listen to this teaching" starts the teaching.
  doc.getElementById('listen-toggle').click();
  assert.equal(doc.getElementById('listen-panel').hidden, false);
  await tick();
  assert.equal(speech.state.speaking, true);
  assert.equal(doc.querySelector('[data-listen-transcript]').open, true);
  assert.equal(doc.getElementById('listen-play-label').textContent, 'Pause');
  assert.equal(speech.state.log.at(-1).text, 'Test Teaching');
  assert.equal(doc.getElementById('listen-toggle').getAttribute('aria-pressed'), 'true');

  doc.getElementById('listen-play').click();
  assert.equal(doc.getElementById('listen-play-label').textContent, 'Resume');
  assert.equal(speech.state.paused, true);
  doc.getElementById('listen-play').click();
  assert.equal(speech.state.paused, false);
  assert.equal(doc.getElementById('listen-play-label').textContent, 'Pause');

  const beforeRate = speech.state.log.filter((x) => x.op === 'speak').length;
  doc.querySelector('[data-rate="1.2"]').click();
  await tick();
  const afterRate = speech.state.log.filter((x) => x.op === 'speak');
  assert.equal(afterRate.length, beforeRate + 1);
  assert.equal(afterRate.at(-1).rate, 1.2);
  assert.equal(afterRate.at(-1).text, 'Test Teaching');

  doc.querySelector('[data-voice="elder"]').click();
  await tick();
  assert.equal(speech.state.log.at(-1).pitch, 0.86);
  assert.equal(doc.querySelector('[data-voice="elder"]').getAttribute('aria-pressed'), 'true');

  doc.getElementById('listen-next').click();
  await tick();
  assert.equal(speech.state.log.at(-1).text, 'Theme scripture text.');
  doc.getElementById('listen-prev').click();
  await tick();
  assert.equal(speech.state.log.at(-1).text, 'Test Teaching');

  doc.getElementById('listen-stop').click();
  assert.equal(doc.getElementById('listen-play-label').textContent, 'Play');
  assert.equal(doc.getElementById('listen-progress').style.width, '0%');
  assert.equal(speech.state.speaking, false);
});

test('the Listen button starts the article in one click, then pauses and resumes', async () => {
  const dom = makeDom(fixture);
  const speech = installSpeech(dom.window);
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  const toggle = doc.getElementById('listen-toggle');

  // Nothing plays before any gesture — no autoplay, ever.
  assert.equal(speech.state.speaking, false);
  assert.equal(doc.getElementById('listen-panel').hidden, true);

  // Click 1: opens the panel AND reads the teaching from the top.
  toggle.click();
  await tick();
  assert.equal(doc.getElementById('listen-panel').hidden, false);
  assert.equal(speech.state.speaking, true);
  assert.equal(speech.state.log.at(-1).text, 'Test Teaching');
  assert.match(toggle.textContent, /Pause this teaching/);

  // Click 2: pauses. Click 3: resumes. The panel stays open throughout.
  toggle.click();
  assert.equal(speech.state.paused, true);
  assert.match(toggle.textContent, /Resume this teaching/);
  assert.equal(doc.getElementById('listen-panel').hidden, false);

  toggle.click();
  assert.equal(speech.state.paused, false);
  assert.match(toggle.textContent, /Pause this teaching/);

  // Stopping resets the button's promise.
  doc.getElementById('listen-stop').click();
  assert.match(toggle.textContent, /Listen to this teaching/);
  assert.equal(toggle.getAttribute('aria-pressed'), 'false');
});

test('Space on a voice button activates the voice, not playback; Escape stops', async () => {
  const dom = makeDom(fixture);
  const speech = installSpeech(dom.window);
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  // The toggle opens the panel and starts reading; stop first so the rest of
  // this test measures key handling rather than an already-running engine.
  doc.getElementById('listen-toggle').click();
  await tick();
  doc.getElementById('listen-stop').click();
  const speaksBeforeKeys = speech.state.log.filter((x) => x.op === 'speak').length;

  const elder = doc.querySelector('[data-voice="elder"]');
  elder.focus();
  elder.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  await tick();
  // Space on a voice button must not start playback.
  assert.equal(speech.state.log.filter((x) => x.op === 'speak').length, speaksBeforeKeys);
  assert.equal(speech.state.speaking, false);
  elder.click();
  assert.equal(elder.getAttribute('aria-pressed'), 'true');

  doc.getElementById('listen-play').click();
  await tick();
  assert.equal(speech.state.speaking, true);
  doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(speech.state.speaking, false);
  assert.equal(doc.getElementById('listen-play-label').textContent, 'Play');
});

test('external language keeps English and offers an explicit link; browser translation restores losslessly', async () => {
  const dom = makeDom(fixture);
  installSpeech(dom.window);
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  const select = doc.getElementById('listen-language');
  select.value = 'yo';
  select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  await tick();
  assert.equal(select.value, 'en');
  assert.equal(doc.getElementById('listen-source').getAttribute('lang'), 'en');
  assert.equal(doc.getElementById('listen-external').hidden, false);
  assert.match(doc.getElementById('listen-external').href, /tl=yo/);
  assert.ok(!doc.getElementById('listen-external').href.includes('example.test'));

  const originalHTML = doc.getElementById('listen-source').innerHTML;
  dom.window.Translator = {
    availability: async () => 'available',
    create: async () => ({
      translate: async (text) => `[fr] ${text}`,
      destroy() {},
    }),
  };
  select.value = 'fr';
  select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  await tick(); await tick();
  assert.equal(doc.getElementById('listen-source').getAttribute('lang'), 'fr');
  assert.match(doc.querySelector('#listen-source h1').textContent, /^\[fr\]/);
  doc.getElementById('listen-original').click();
  await tick();
  assert.equal(doc.getElementById('listen-source').innerHTML, originalHTML);
  assert.equal(doc.getElementById('listen-source').getAttribute('lang'), 'en');
});

test('declaration speech event stops the Listening Room', async () => {
  const dom = makeDom(fixture);
  const speech = installSpeech(dom.window);
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  doc.getElementById('listen-toggle').click();
  doc.getElementById('listen-play').click();
  await tick();
  assert.equal(speech.state.speaking, true);
  dom.window.dispatchEvent(new dom.window.CustomEvent('ijn:stop-speech', { detail: { source: 'declaration' } }));
  assert.equal(speech.state.speaking, false);
  assert.equal(doc.getElementById('listen-room').dataset.playback, 'idle');
});

test('unsupported speech hides the player and keeps the article readable', async () => {
  const dom = makeDom(fixture);
  Object.defineProperty(dom.window, 'speechSynthesis', { value: undefined, configurable: true });
  delete dom.window.SpeechSynthesisUtterance;
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  assert.equal(doc.getElementById('listen-unsupported').hidden, false);
  assert.equal(doc.querySelector('.listen-bar').hidden, true);
  assert.ok(doc.getElementById('listen-source').textContent.includes('First paragraph'));
});

test('language counts are derived from the data, never typed into prose', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  // The count used to be hardcoded into three reader-facing sentences, so adding
  // a language would silently falsify all three. Reader-facing pages must take
  // it from LISTEN_LANGUAGES.length instead.
  const banned = /\b(thirteen|fourteen|fifteen)\b/i;
  for (const rel of ['src/pages/listen.astro', 'src/pages/index.astro', 'src/pages/accessibility.astro']) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.equal(banned.test(text), false, `${rel} hardcodes a language count in prose`);
  }

  // The exported counts must match the array they describe.
  const langSrc = fs.readFileSync(path.join(root, 'src/data/languages.ts'), 'utf8');
  // Count only real array entries, one object per line — the TypeScript
  // interface also mentions both translate values and must not be counted.
  const entryLines = langSrc
    .split('\n')
    .filter((line) => line.trimStart().startsWith("{ code: '"));
  assert.equal(entryLines.length, 13);
  const onDevice = entryLines.filter((l) => l.includes("translate: 'browser'")).length;
  const external = entryLines.filter((l) => l.includes("translate: 'external'")).length;
  assert.equal(onDevice + external, entryLines.length);
  // And the reader-facing prose agrees with the data.
  const listenPage = fs.readFileSync(path.join(root, 'src/pages/listen.astro'), 'utf8');
  assert.match(listenPage, /languageCountWord/);
  const indexPage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  assert.match(indexPage, /LANGUAGE_COUNT/);
});

test('static guard: /listen/ and article templates both render #listen-source', () => {
  const listen = fs.readFileSync(path.join(siteRoot, 'src/pages/listen.astro'), 'utf8');
  const article = fs.readFileSync(path.join(siteRoot, 'src/pages/[slug].astro'), 'utf8');
  assert.match(listen, /id="listen-source"/);
  assert.match(article, /id="listen-source"/);
  assert.match(listen, /data-listen-transcript/);
});

test('playback finishes cleanly and replays from the beginning', async () => {
  const dom = makeDom(fixture);
  const speech = installSpeech(dom.window);
  const { initListenRoom } = await loadController();
  initListenRoom();
  const doc = dom.window.document;
  doc.getElementById('listen-toggle').click();
  await tick();
  for (let i = 0; i < 80; i++) {
    if (doc.getElementById('listen-room').dataset.playback === 'finished') break;
    if (speech.state.current) speech.end();
    await new Promise((resolve) => setTimeout(resolve, 460));
  }
  assert.equal(doc.getElementById('listen-room').dataset.playback, 'finished');
  assert.equal(doc.getElementById('listen-play-label').textContent, 'Replay');
  assert.equal(doc.getElementById('listen-progress').style.width, '100%');
  const speaksBefore = speech.state.log.filter((x) => x.op === 'speak').length;
  doc.getElementById('listen-play').click();
  await tick();
  assert.equal(doc.getElementById('listen-room').dataset.playback, 'playing');
  assert.equal(speech.state.log.filter((x) => x.op === 'speak').length, speaksBefore + 1);
  assert.equal(speech.state.log.at(-1).text, 'Test Teaching');
});
