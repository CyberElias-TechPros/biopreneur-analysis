/**
 * Guards the YouTube channel art the same way scripts/test-site.mjs guards the site.
 *
 * Art regressions are silent — the banner still "looks fine" in an editor while being
 * unreadable in the one crop YouTube actually serves on mobile. These checks fail loudly
 * instead, and they ask the questions a reviewer would ask:
 *
 *   1. Are the dimensions what YouTube requires?
 *   2. Is the file under the upload ceiling?
 *   3. Does any content land outside the 1546x423 safe band?
 *   4. Does the avatar survive the circular crop?
 *
 * Run: npm run test:art   (requires the assets, not dist/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '..');
const images = path.join(siteRoot, 'public', 'images');

const require = createRequire(import.meta.url);

// --- Minimal PNG reader ---------------------------------------------------
// No image library: read the IHDR for dimensions and inflate the raw scanlines
// ourselves. Enough to answer "is there ink outside the safe band?", and it keeps
// the test dependency-free.

function readPng(file) {
  const buf = fs.readFileSync(file);
  assert.equal(buf.subarray(1, 4).toString('ascii'), 'PNG', `${file} is not a PNG`);

  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.subarray(pos + 4, pos + 8).toString('ascii');
    const data = buf.subarray(pos + 8, pos + 8 + len);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      assert.equal(data[12], 0, 'interlaced PNGs are not supported by this reader');
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }

  assert.equal(bitDepth, 8, 'expected 8-bit PNG');
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  assert.ok(channels, `unsupported colour type ${colorType}`);

  const zlib = require('node:zlib');
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;

  // Undo PNG filtering so pixel values are meaningful.
  const out = Buffer.alloc(height * stride);
  let src = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[src++];
    const row = raw.subarray(src, src + stride);
    src += stride;
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);

    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      const v = row[x];

      let val;
      switch (filter) {
        case 0: val = v; break;
        case 1: val = v + a; break;
        case 2: val = v + b; break;
        case 3: val = v + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          val = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`unknown filter ${filter}`);
      }
      cur[x] = val & 0xff;
    }
  }

  return { width, height, channels, data: out };
}

/** Luminance of a pixel, 0-255. */
function luma(png, x, y) {
  const i = (y * png.width + x) * png.channels;
  const { data, channels } = png;
  if (channels >= 3) return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  return data[i];
}

// --- Tests ---------------------------------------------------------------

const BANNER = path.join(images, 'youtube-banner.png');
const AVATAR = path.join(images, 'youtube-avatar.png');
const WATERMARK = path.join(images, 'youtube-watermark.png');

const haveArt = fs.existsSync(BANNER) && fs.existsSync(AVATAR);
const skip = haveArt ? false : 'channel art not generated — run `npm run art` first';

test('the banner is 2560x1440 and under the 6 MB upload ceiling', { skip }, () => {
  const kb = fs.statSync(BANNER).size / 1024;
  assert.ok(kb < 6144, `banner is ${kb.toFixed(0)} KB, over the 6 MB limit`);

  const png = readPng(BANNER);
  assert.equal(png.width, 2560);
  assert.equal(png.height, 1440);
});

test('nothing legible falls outside the safe band YouTube preserves', { skip }, () => {
  const png = readPng(BANNER);

  // YouTube's safe area for a 2560x1440 upload.
  const X0 = 507;
  const Y0 = 509;
  const X1 = 2053;
  const Y1 = 931;

  // The only bright pixels are the lockup, the emblem and the horizon rule. Measure
  // how far the bright region reaches, so a nudge in the layout cannot silently push
  // the wordmark under the mobile crop.
  let minX = png.width;
  let maxX = -1;
  let minY = png.height;
  let maxY = -1;
  let count = 0;

  // Sample every 2nd pixel: plenty of resolution for a layout guard, 4x faster.
  for (let y = 0; y < png.height; y += 2) {
    for (let x = 0; x < png.width; x += 2) {
      if (luma(png, x, y) > 140) {
        count += 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  assert.ok(count > 500, 'the banner looks blank — no bright content found');

  // Allow a small tolerance for antialiasing and the blurred horizon ends.
  const pad = 12;
  assert.ok(minX >= X0 - pad, `content starts at x=${minX}, left of the safe band (${X0})`);
  assert.ok(maxX <= X1 + pad, `content ends at x=${maxX}, right of the safe band (${X1})`);
  assert.ok(minY >= Y0 - pad, `content starts at y=${minY}, above the safe band (${Y0})`);
  assert.ok(maxY <= Y1 + pad, `content ends at y=${maxY}, below the safe band (${Y1})`);
});

test('the avatar is square, 800px, and survives the circular crop', { skip }, () => {
  const png = readPng(AVATAR);
  assert.equal(png.width, 800);
  assert.equal(png.height, 800);

  // YouTube masks the avatar to a circle. Check the emblem's bright pixels all sit
  // inside that circle, with margin, so no arc end is clipped.
  const cx = png.width / 2;
  const cy = png.height / 2;
  const radius = png.width / 2;
  let worst = 0;

  for (let y = 0; y < png.height; y += 2) {
    for (let x = 0; x < png.width; x += 2) {
      if (luma(png, x, y) > 150) {
        const d = Math.hypot(x - cx, y - cy);
        if (d > worst) worst = d;
      }
    }
  }

  assert.ok(worst > 0, 'the avatar looks blank');
  assert.ok(
    worst < radius * 0.95,
    `emblem reaches ${(worst / radius).toFixed(2)} of the crop radius — too close to the edge`,
  );
});

test('the watermark is 150x150 and transparent, so video shows through', { skip: fs.existsSync(WATERMARK) ? false : 'no watermark' }, () => {
  const png = readPng(WATERMARK);
  assert.equal(png.width, 150);
  assert.equal(png.height, 150);
  assert.equal(png.channels, 4, 'watermark must be RGBA');

  // The top-left corner is outside the emblem: it must be fully transparent.
  const alpha = png.data[(2 * png.width + 2) * 4 + 3];
  assert.equal(alpha, 0, 'watermark has an opaque background — it would cover the video');
});
