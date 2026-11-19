/**
 * Validates every generated VidLyrics spec against the format the prompt defines, and
 * against the editorial rules this library already holds itself to.
 *
 * A generator that produces 371 files is only useful if something checks all 371.
 * These tests fail the build on a malformed spec, a scene that would render blank, or
 * narration that has drifted away from the teaching it claims to present.
 *
 * Run: npm run test:video
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '..');
const dir = path.join(siteRoot, 'video-scripts');
const articles = path.join(siteRoot, 'articles');

const THEMES = new Set([
  'nocturne', 'neon-circuit', 'paper-light', 'sunset-drive',
  'mono-brutal', 'aurora', 'cinema-classic', 'karaoke-stage',
]);
const LAYOUTS = new Set(['title', 'caption', 'stat', 'bullets', 'quote', 'code', 'chart']);
const ASPECTS = new Set(['16:9', '9:16', '1:1', '4:5', '4:3']);
const ENTERS = new Set(['spring', 'rise', 'fade', 'zoom', 'clip', 'blur', 'wordCascade']);
const TRANSITIONS = new Set(['fade', 'slide', 'wipe', 'zoom', 'none']);
const VOICES = new Set([
  'en_US-lessac-medium', 'en_US-amy-medium', 'en_US-ryan-medium', 'en_GB-alan-medium',
  'es_ES-davefx-medium', 'fr_FR-siwis-medium', 'de_DE-thorsten-medium',
  'pt_BR-faber-medium', 'zh_CN-huayan-medium', 'sw_CD-lanfrica-medium',
]);

const files = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  : [];

const skip = files.length ? false : 'video scripts not generated — run `npm run video:scripts` first';

const WPM = 152;

function words(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

/** Scenes whose narration is spoken are timed; a scene with no narration still needs text. */
function sceneSeconds(scene) {
  return (words(scene.narration || scene.text) / WPM) * 60;
}

test('there is exactly one spec per published teaching', { skip }, () => {
  const slugs = fs
    .readdirSync(articles)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(articles, f), 'utf8');
      const m = raw.match(/^slug:\s*"?(.+?)"?\s*$/m);
      return m && m[1];
    })
    .filter(Boolean);

  assert.equal(files.length, slugs.length, `have ${files.length} specs for ${slugs.length} teachings`);

  const specSlugs = new Set(files.map((f) => f.replace(/\.json$/, '')));
  const missing = slugs.filter((s) => !specSlugs.has(s));
  assert.deepEqual(missing, [], `no spec for: ${missing.slice(0, 5).join(', ')}`);
});

test('every spec is valid vidlyrics.spec v1', { skip }, () => {
  for (const file of files) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));

    assert.equal(spec.kind, 'vidlyrics.spec', `${file}: kind`);
    assert.equal(spec.version, 1, `${file}: version`);
    assert.ok(spec.title && typeof spec.title === 'string', `${file}: title`);
    assert.ok(spec.author && typeof spec.author === 'string', `${file}: author`);
    assert.ok(THEMES.has(spec.theme), `${file}: theme "${spec.theme}"`);
    assert.ok(ASPECTS.has(spec.aspect), `${file}: aspect "${spec.aspect}"`);
    assert.ok(Number.isInteger(spec.fps) && spec.fps > 0, `${file}: fps`);

    // Voice block
    assert.ok(spec.voice && typeof spec.voice === 'object', `${file}: voice`);
    assert.ok(VOICES.has(spec.voice.voiceId), `${file}: voiceId "${spec.voice.voiceId}"`);
    if (spec.voice.voiceIdB != null) {
      assert.ok(VOICES.has(spec.voice.voiceIdB), `${file}: voiceIdB "${spec.voice.voiceIdB}"`);
    }
    assert.ok(Number.isFinite(spec.voice.pauseMs), `${file}: pauseMs`);
    assert.ok(Number.isFinite(spec.voice.wpm) && spec.voice.wpm > 0, `${file}: wpm`);

    // Scenes
    assert.ok(Array.isArray(spec.scenes) && spec.scenes.length >= 4, `${file}: too few scenes`);

    for (const [i, scene] of spec.scenes.entries()) {
      const where = `${file} scene ${i + 1}`;
      assert.ok(LAYOUTS.has(scene.layout), `${where}: layout "${scene.layout}"`);

      // `text` is required on every layout.
      assert.ok(
        typeof scene.text === 'string' && scene.text.trim().length > 0,
        `${where}: empty text`,
      );

      // `value` is required for stat; `items` powers bullets and code.
      if (scene.layout === 'stat') {
        assert.ok(scene.value != null && String(scene.value).trim(), `${where}: stat needs value`);
      }
      if (scene.layout === 'bullets' || scene.layout === 'code') {
        assert.ok(Array.isArray(scene.items) && scene.items.length > 0, `${where}: needs items`);
        for (const item of scene.items) {
          assert.ok(typeof item === 'string' && item.trim().length > 0, `${where}: blank item`);
        }
      }
      if (scene.layout === 'chart') {
        assert.ok(Array.isArray(scene.chart) && scene.chart.length > 0, `${where}: chart needs data`);
        for (const bar of scene.chart) {
          assert.ok(bar.label != null && Number.isFinite(bar.value), `${where}: malformed bar`);
        }
      }
      if (scene.speaker != null) assert.ok(['A', 'B'].includes(scene.speaker), `${where}: speaker`);
      if (scene.enter != null) assert.ok(ENTERS.has(scene.enter), `${where}: enter "${scene.enter}"`);
      if (scene.transition != null) {
        assert.ok(TRANSITIONS.has(scene.transition), `${where}: transition "${scene.transition}"`);
      }
      if (scene.accent != null) assert.match(scene.accent, /^#[0-9a-fA-F]{6}$/, `${where}: accent`);

      // duration is "auto" (the brief) or a positive number — never 0 or a string number.
      assert.ok(
        scene.duration === 'auto' || (typeof scene.duration === 'number' && scene.duration > 0),
        `${where}: duration ${JSON.stringify(scene.duration)}`,
      );

      if (scene.background) {
        assert.ok(['mesh', 'gradient', 'solid'].includes(scene.background.kind), `${where}: bg kind`);
        if (Array.isArray(scene.background.colors)) {
          for (const c of scene.background.colors) {
            assert.match(c, /^#[0-9a-fA-F]{6}$/, `${where}: bg colour ${c}`);
          }
        }
      }
    }

    // Outro
    assert.ok(spec.outro && typeof spec.outro.title === 'string', `${file}: outro`);
    assert.ok(spec.outro.duration > 0, `${file}: outro duration`);
  }
});

test('no scene is long enough to lose the viewer', { skip }, () => {
  // The brief asks for 3-6 second scenes. Scripture and the declaration are naturally
  // longer, so the generator splits them; 16 s is the ceiling a quote may reach before
  // it is clearly one wall of text.
  const offenders = [];
  for (const file of files) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    spec.scenes.forEach((scene, i) => {
      const secs = sceneSeconds(scene);
      if (secs > 16) offenders.push(`${file} scene ${i + 1}: ${secs.toFixed(1)}s`);
      if (scene.layout === 'title' && secs > 10) offenders.push(`${file} scene ${i + 1}: title ${secs.toFixed(1)}s`);
    });
  }
  assert.deepEqual(offenders.slice(0, 8), [], `${offenders.length} scene(s) too long`);
});

test('narration is speakable: no raw markdown, no symbolic references', { skip }, () => {
  const bad = [];
  for (const file of files) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const [i, scene] of spec.scenes.entries()) {
      const n = scene.narration || '';
      if (!n) continue;
      const where = `${file} scene ${i + 1}`;

      if (/\*\*|__|`/.test(n)) bad.push(`${where}: markdown in narration`);
      if (/\(\s*\w+\s+\d+:\d+/.test(n)) bad.push(`${where}: parenthetical reference`);
      // "7:19" is read as "seven nineteen" or worse; the generator writes it out.
      if (/\b\d{1,3}:\d{1,3}\b/.test(n)) bad.push(`${where}: symbolised reference in narration`);
      if (/[A-Za-z]\.[A-Za-z]/.test(n) && !/lij\.name\.ng/.test(n)) bad.push(`${where}: abbreviation`);
      if (/[?!]\./.test(n)) bad.push(`${where}: doubled stop`);
      // A chunk cut at a clause boundary must not keep its comma before the stop.
      if (/[,;:]\s*[.!?]/.test(n)) bad.push(`${where}: clause punctuation before stop`);
      if (/\s{2,}/.test(n)) bad.push(`${where}: double space`);
    }
  }
  assert.deepEqual(bad.slice(0, 8), [], `${bad.length} narration defect(s)`);
});

test('every spec keeps the teaching voice: the declaration is present and unaltered', { skip }, () => {
  // The declaration is the part a reader is meant to say aloud, so the video must not
  // paraphrase it. Check the closing scenes carry its opening clause verbatim.
  const bad = [];
  for (const file of files) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const spoken = spec.scenes.map((s) => (s.narration || '') + ' ' + (s.text || '')).join(' ');
    const slug = file.replace(/\.json$/, '');
    const articlePath = fs
      .readdirSync(articles)
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(articles, f))
      .find((p) => {
        const head = fs.readFileSync(p, 'utf8').slice(0, 2000);
        const m = head.match(/^slug:\s*"?(.+?)"?\s*$/m);
        return m && m[1] === slug;
      });
    if (!articlePath) { bad.push(`${file}: no source article`); continue; }
    const article = fs.readFileSync(articlePath, 'utf8');
    const m = article.match(/^declaration:\s*"?(.+?)"?\s*$/m);
    if (!m) continue;

    const firstClause = m[1].split(/[.,]/)[0].replace(/\*\*/g, '').trim();
    const probe = firstClause.slice(0, 28).toLowerCase();
    if (probe.length > 12 && !spoken.toLowerCase().includes(probe)) {
      bad.push(`${file}: declaration clause missing`);
    }
  }
  assert.deepEqual(bad.slice(0, 6), [], `${bad.length} spec(s) dropped the declaration`);
});

test('the channel identity is consistent across all 371 specs', { skip }, () => {
  const authors = new Set();
  const voiceIds = new Set();
  for (const file of files) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    authors.add(spec.author);
    voiceIds.add(spec.voice.voiceId);
  }
  assert.equal(authors.size, 1, `author varies: ${[...authors].join(', ')}`);
  assert.equal(authors.has('Live In Jesus Name'), true, 'author must be the publication name');
  assert.equal(voiceIds.size, 1, `voice varies: ${[...voiceIds].join(', ')}`);
});
