// pixel-projects.jsx — one animated pixel scene per REAL project.
// Replaces the placeholder rover/arm scenes, which illustrated work that
// doesn't exist. Each scene draws the actual mechanism of the project:
//
//   PixelMCP      → Zed HTTP transport    (stdio-local vs http-remote, packets on the wire)
//   PixelApproval → Ferret                (draft ▸ human gate ▸ send, attempts limiter)
//   PixelHebrew   → Morah                 (מורה, tag-parsed writes into per-user memory cells)
//   PixelVision   → Mushroom Intelligence (detection boxes → masks, flipping day/IR)
//
// Every scene lays out PROPORTIONALLY to the width/height it is given, because
// the same component renders at three sizes: a 58×40 desktop thumbnail, a
// ~124×88 gallery card, and a full-width hero. Hard-coded coordinates draw
// themselves off-canvas at thumbnail size.

import React from 'react';
import { plotLine } from './pixel-fx';

// ── shared helpers ──────────────────────────────────────────────
const PX = (c, S, x, y, col) => { c.fillStyle = col; c.fillRect(Math.round(x) * S, Math.round(y) * S, S, S); };
const BOX = (c, S, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x) * S, Math.round(y) * S, Math.max(1, Math.round(w)) * S, Math.max(1, Math.round(h)) * S); };
const FRAME = (c, S, x, y, w, h, col) => { BOX(c, S, x, y, w, 1, col); BOX(c, S, x, y + h - 1, w, 1, col); BOX(c, S, x, y, 1, h, col); BOX(c, S, x + w - 1, y, 1, h, col); };
const GLOW = (c, S, fn, colGlow, blur) => { c.save(); c.shadowColor = colGlow; c.shadowBlur = S * blur; fn(); c.restore(); };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 13.7) * 43758.5; return x - Math.floor(x); };

function sceneGrid(c, S, width, height) {
  c.fillStyle = '#0e1813';
  const step = Math.max(6, Math.round(width / 10));
  for (let gx = 0; gx < width; gx += step) c.fillRect(gx * S, 0, 1, height * S);
  for (let gy = 0; gy < height; gy += step) c.fillRect(0, gy * S, width * S, 1);
}

// canvas boilerplate shared by every scene
function useScene(ref, draw, deps, scale, width, height) {
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const S = scale;
    cv.width = width * S * dpr; cv.height = height * S * dpr;
    cv.style.width = width * S + 'px'; cv.style.height = height * S + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); ctx.imageSmoothingEnabled = false;
    const t0 = performance.now();
    const frame = () => { const t = performance.now() - t0; ctx.clearRect(0, 0, width * S, height * S); draw(ctx, t, S); };
    frame();
    const id = setInterval(frame, 1000 / 30);
    return () => clearInterval(id);
  }, deps);
}

// ════════════════════════════════════════════════════════════════
//  ZED — HTTP TRANSPORT FOR MCP SERVERS
//  Left: the editor. Right: a remote MCP server that needs no local
//  process. Between them the streamable-HTTP wire, carrying requests
//  one way and responses the other. Below, greyed out, the stdio path
//  that was the only option before.
// ════════════════════════════════════════════════════════════════
export function PixelMCP({ accent, scale = 4, width = 120, height = 60, style = {} }) {
  const ref = React.useRef(null);
  useScene(ref, (c, t, S) => {
    const W = width, H = height, tiny = W < 90;
    const metal = '#9aa6b2', dark = '#141c22', dim = '#3d4750';
    sceneGrid(c, S, W, H);

    // ── editor window (left) ──
    const ex = W * 0.03, ey = H * 0.15, ew = W * 0.34, eh = H * 0.52;
    BOX(c, S, ex, ey, ew, eh, dark);
    FRAME(c, S, ex, ey, ew, eh, metal);
    BOX(c, S, ex, ey, ew, Math.max(2, H * 0.08), '#1d262d');
    BOX(c, S, ex + 1, ey + 1, 2, 2, accent.base);
    // code lines, one "typing" on a loop
    const rows = tiny ? 3 : 5;
    const typed = Math.floor((t / 220) % (rows + 2));
    for (let r = 0; r < rows; r++) {
      const lw = (ew - 4) * (0.35 + ((r * 7) % 10) / 16);
      if (r <= typed) BOX(c, S, ex + 2, ey + H * 0.16 + r * (eh / (rows + 1.2)), lw, 1, r % 3 === 0 ? accent.base : dim);
    }

    // ── remote MCP server (right) ──
    const sw = W * 0.22, sh = H * 0.46, sx = W - sw - W * 0.04, sy = H * 0.18;
    BOX(c, S, sx, sy, sw, sh, '#10171c');
    FRAME(c, S, sx, sy, sw, sh, metal);
    const slats = tiny ? 2 : 4;
    for (let r = 0; r < slats; r++) {
      const slatY = sy + 2 + r * ((sh - 3) / slats);
      BOX(c, S, sx + 2, slatY, sw - 4, Math.max(1, (sh - 4) / slats - 1), '#1b242b');
      const lit = Math.sin(t / (180 + r * 90) + r) > -0.1;
      GLOW(c, S, () => BOX(c, S, sx + sw - 4, slatY, 2, 2, lit ? accent.bright : accent.deep), accent.glow, lit ? 3 : 0);
    }
    // it floats, tethered only by the wire — no local process
    GLOW(c, S, () => FRAME(c, S, sx - 1, sy - 1, sw + 2, sh + 2, accent.deep), accent.glow, 2);

    // ── the HTTP wire ──
    const wy = H * 0.42, wx0 = ex + ew, wx1 = sx;
    for (let x = wx0; x < wx1; x += 3) BOX(c, S, x, wy, 2, 1, '#233029');
    for (let k = 0; k < (tiny ? 2 : 4); k++) {   // requests out
      const p = ((t / 1000 + k / 4) % 1);
      const px = wx0 + p * (wx1 - wx0);
      GLOW(c, S, () => BOX(c, S, px, wy - 1, 2, 2, accent.bright), accent.glow, 3);
    }
    for (let k = 0; k < (tiny ? 2 : 3); k++) {   // responses back
      const p = ((t / 1250 + k / 3) % 1);
      const px = wx1 - p * (wx1 - wx0);
      c.globalAlpha = 0.85;
      GLOW(c, S, () => BOX(c, S, px, wy + 3, 2, 1, accent.base), accent.glow, 2);
      c.globalAlpha = 1;
    }

    // ── the old stdio path, greyed: a local child process ──
    const pw = W * 0.2, ph2 = H * 0.15, px2 = ex + ew * 0.2, py2 = H - ph2 - H * 0.06;
    BOX(c, S, px2, py2, pw, ph2, '#0d1216');
    FRAME(c, S, px2, py2, pw, ph2, dim);
    for (let y = ey + eh; y < py2; y += 3) BOX(c, S, px2 + pw / 2, y, 1, 2, dim);
  }, [accent, scale, width, height], scale, width, height);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

// ════════════════════════════════════════════════════════════════
//  FERRET — HUMAN-IN-THE-LOOP APPROVAL
//  A drafted message crosses the frame, stops dead at the gate, waits
//  for a human ✓, and only then is released to the outbox. The gate is
//  the whole point: nothing sends autonomously.
// ════════════════════════════════════════════════════════════════
export function PixelApproval({ accent, scale = 4, width = 120, height = 60, style = {} }) {
  const ref = React.useRef(null);
  useScene(ref, (c, t, S) => {
    const W = width, H = height, tiny = W < 90;
    const dim = '#3d4750', paper = '#cdd6df', hold = '#ff5470';
    sceneGrid(c, S, W, H);

    const gateX = W * 0.44, gateW = Math.max(2, W * 0.025);
    const cardW = W * 0.11, cardH = H * 0.24, cy = H * 0.38;
    const startX = W * 0.1, endX = W * 0.78;
    const period = 2800, ph = (t % period) / period;

    let cardX, held = false, released = false;
    if (ph < 0.28) { cardX = startX + (ph / 0.28) * (gateX - cardW - 2 - startX); }
    else if (ph < 0.56) { cardX = gateX - cardW - 2; held = true; }
    else if (ph < 0.88) { cardX = (gateX - cardW - 2) + ((ph - 0.56) / 0.32) * (endX - (gateX - cardW - 2)); released = true; }
    else { cardX = endX; released = true; }

    // draft lane + queue stacked behind
    BOX(c, S, W * 0.02, H * 0.14, 1, H * 0.72, '#1c2a22');
    for (let q = 0; q < (tiny ? 2 : 3); q++) {
      c.globalAlpha = 0.3 + q * 0.16;
      BOX(c, S, W * 0.04 + q * 2, cy - q, cardW, cardH, '#1a232a'); FRAME(c, S, W * 0.04 + q * 2, cy - q, cardW, cardH, dim);
      c.globalAlpha = 1;
    }

    // the gate: two leaves that part once approved
    const gapTop = H * 0.16, gapBot = H * 0.84, mid = (gapTop + gapBot) / 2;
    const open = released ? Math.min((gapBot - gapTop) * 0.22, ((ph - 0.56) / 0.10) * (gapBot - gapTop) * 0.22) : 0;
    GLOW(c, S, () => {
      BOX(c, S, gateX, gapTop, gateW, (mid - gapTop) - open, held ? hold : accent.base);
      BOX(c, S, gateX, mid + open, gateW, (gapBot - mid) - open, held ? hold : accent.base);
    }, held ? hold : accent.glow, held ? 4 : 2);

    // the card
    BOX(c, S, cardX, cy, cardW, cardH, '#0b1116');
    FRAME(c, S, cardX, cy, cardW, cardH, released ? accent.base : paper);
    if (!tiny) for (let r = 0; r < 3; r++) BOX(c, S, cardX + 2, cy + 2 + r * (cardH / 4), cardW * 0.4 + ((r * 5) % 4), 1, released ? accent.base : dim);
    if (released) GLOW(c, S, () => FRAME(c, S, cardX, cy, cardW, cardH, accent.bright), accent.glow, 3);

    // the human decision, stamped over the held card
    if (held && ph > 0.42) {
      c.globalAlpha = Math.min(1, ((ph - 0.42) / 0.14) * 2);
      GLOW(c, S, () => {
        plotLine(c, cardX + cardW * 0.2, cy + cardH * 0.5, cardX + cardW * 0.45, cy + cardH * 0.78, S, accent.bright, 1);
        plotLine(c, cardX + cardW * 0.45, cy + cardH * 0.78, cardX + cardW * 0.85, cy + cardH * 0.15, S, accent.bright, 1);
      }, accent.glow, 4);
      c.globalAlpha = 1;
    } else if (held && Math.sin(t / 180) > 0) {
      GLOW(c, S, () => BOX(c, S, cardX + cardW * 0.3, cy - H * 0.09, cardW * 0.4, 2, hold), hold, 3);
    }

    // outbox
    const outX = W * 0.82, outW = W * 0.14, outY = H * 0.3, outH = H * 0.4;
    BOX(c, S, outX, outY, outW, outH, '#0d1216'); FRAME(c, S, outX, outY, outW, outH, dim);
    const filed = Math.floor(t / period) % 5;
    for (let k = 0; k <= filed; k++) GLOW(c, S, () => BOX(c, S, outX + 2, outY + outH - 3 - k * (outH / 6), outW - 4, 2, accent.base), accent.glow, 1.5);

    // attempts-not-successes rate limiter
    const mW = W * 0.38, mX = W * 0.05, mY = H * 0.86;
    const used = ((t / 60) % mW);
    BOX(c, S, mX, mY, mW, Math.max(3, H * 0.07), '#111a15'); FRAME(c, S, mX, mY, mW, Math.max(3, H * 0.07), dim);
    GLOW(c, S, () => BOX(c, S, mX + 1, mY + 1, used, Math.max(1, H * 0.07 - 2), used > mW * 0.8 ? hold : accent.base), used > mW * 0.8 ? hold : accent.glow, 2);
  }, [accent, scale, width, height], scale, width, height);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

// ════════════════════════════════════════════════════════════════
//  MORAH — STATEFUL HEBREW TUTOR
//  The model emits a structured tag; the tag writes a cell in this
//  user's own memory grid. No second extraction call, and every cell
//  is something the user can open and edit.
// ════════════════════════════════════════════════════════════════
// 5×7 Hebrew glyphs. Drawn left→right as ה ר ו מ, which reads מורה.
const HE_GLYPHS = {
  he:   ['11111', '10001', '00001', '00001', '10001', '10001', '10001'],
  resh: ['11111', '00001', '00001', '00001', '00001', '00001', '00001'],
  vav:  ['11110', '00110', '00100', '00100', '00100', '00100', '00100'],
  mem:  ['01111', '10001', '10001', '10001', '10001', '10001', '11011'],
};
function glyph(c, S, g, x, y, col) {
  for (let r = 0; r < g.length; r++) for (let k = 0; k < g[r].length; k++) if (g[r][k] === '1') PX(c, S, x + k, y + r, col);
}
export function PixelHebrew({ accent, scale = 4, width = 120, height = 60, style = {} }) {
  const ref = React.useRef(null);
  useScene(ref, (c, t, S) => {
    const W = width, H = height, tiny = W < 90;
    const dim = '#3d4750';
    sceneGrid(c, S, W, H);

    // ── the word מורה, letters lighting in sequence ──
    const order = ['he', 'resh', 'vav', 'mem'];
    const lit = Math.floor((t / 620) % 5);
    const gStep = Math.max(6, W * 0.058), gx0 = W * 0.06, gy = H * 0.14;
    order.forEach((k, i) => {
      const gx = gx0 + i * gStep;
      if (i < lit) GLOW(c, S, () => glyph(c, S, HE_GLYPHS[k], gx, gy, accent.bright), accent.glow, 3);
      else glyph(c, S, HE_GLYPHS[k], gx, gy, dim);
    });

    // ── the tag the model emitted, typing out ──
    const tagY = H * 0.46, tagX = W * 0.05;
    BOX(c, S, tagX, tagY, 1, 5, accent.base); BOX(c, S, tagX + 1, tagY, 2, 1, accent.base); BOX(c, S, tagX + 1, tagY + 4, 2, 1, accent.base);
    const nChars = tiny ? 6 : 12;
    const chars = Math.floor((t / 130) % (nChars + 2));
    for (let k = 0; k < Math.min(chars, nChars); k++) BOX(c, S, tagX + 4 + k * 2, tagY + 2, 1, 2, k % 3 === 0 ? accent.bright : dim);

    // ── the memory grid: this user's Durable Object ──
    const cols = tiny ? 3 : 5, rows = tiny ? 3 : 5;
    const gW = W * 0.42, gH = H * 0.74;
    const gridX = W - gW - W * 0.05, gridY = H * 0.12;
    const cw = gW / cols, ch = gH / rows;
    const cellIdx = Math.floor(t / 620) % (cols * rows);
    const wph = ((t % 620) / 620);

    FRAME(c, S, gridX - 2, gridY - 2, gW + 3, gH + 3, '#26313a');
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const i = r * cols + k, cx = gridX + k * cw, cy = gridY + r * ch;
      const filled = i <= cellIdx;
      const isNow = i === cellIdx && wph > 0.55;
      if (isNow) GLOW(c, S, () => { BOX(c, S, cx, cy, cw - 1, ch - 1, accent.base); BOX(c, S, cx + 1, cy + 1, cw - 3, ch - 3, accent.bright); }, accent.glow, 4);
      else if (filled) { BOX(c, S, cx, cy, cw - 1, ch - 1, '#122a1d'); FRAME(c, S, cx, cy, cw - 1, ch - 1, accent.deep); }
      else FRAME(c, S, cx, cy, cw - 1, ch - 1, '#1c2a22');
    }
    // the write travelling from the tag into its cell
    if (wph < 0.55) {
      const tr = wph / 0.55;
      const tx = tagX + 4 + tr * (gridX + (cellIdx % cols) * cw - tagX - 4);
      const ty = tagY + 2 + tr * (gridY + Math.floor(cellIdx / cols) * ch - tagY - 2);
      GLOW(c, S, () => BOX(c, S, tx, ty, 2, 2, accent.bright), accent.glow, 4);
      for (let k = 1; k < 4; k++) { c.globalAlpha = 0.5 - k * 0.12; PX(c, S, tx - k * 2, ty - k, accent.base); c.globalAlpha = 1; }
    }

    // ── the conversation, bottom left ──
    if (!tiny) for (let b = 0; b < 3; b++) {
      const by = H * 0.66 + b * (H * 0.1), bw = W * 0.1 + ((b * 7) % 10), rightAligned = b % 2 === 1;
      const bx = rightAligned ? W * 0.38 - bw : W * 0.05;
      c.globalAlpha = 0.45 + b * 0.18;
      BOX(c, S, bx, by, bw, Math.max(3, H * 0.08), rightAligned ? '#16231c' : '#1a232a');
      FRAME(c, S, bx, by, bw, Math.max(3, H * 0.08), rightAligned ? accent.deep : dim);
      c.globalAlpha = 1;
    }
  }, [accent, scale, width, height], scale, width, height);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

// ════════════════════════════════════════════════════════════════
//  MUSHROOM INTELLIGENCE — HARVEST-READINESS DETECTION
//  Boxes snap onto oyster caps and resolve into masks, because cap AREA
//  is the harvest signal, not a bounding box. Every few seconds the
//  camera flips to nighttime infrared — half the real frames are IR,
//  and the model is measurably worse there. The scene shows that.
// ════════════════════════════════════════════════════════════════
// positions are fractions of (width, height); radius is a fraction of height
const CLUSTERS = [
  { fx: 0.36, fy: 0.28, fr: 0.13, n: 3, ready: true },
  { fx: 0.63, fy: 0.50, fr: 0.16, n: 4, ready: true },
  { fx: 0.40, fy: 0.74, fr: 0.11, n: 3, ready: false },
  { fx: 0.82, fy: 0.25, fr: 0.09, n: 2, ready: false },
];
export function PixelVision({ accent, scale = 4, width = 120, height = 60, style = {} }) {
  const ref = React.useRef(null);
  useScene(ref, (c, t, S) => {
    const W = width, H = height, tiny = W < 90;
    const cyc = t % 10000, ir = cyc > 6000;   // 6s day → 4s infrared
    const capRamp = ir ? ['#2b2b2b', '#4a4a4a', '#6d6d6d', '#949494', '#c4c4c4']
                       : ['#3a2f26', '#584639', '#7d6552', '#a2866c', '#c9ad8e'];

    c.fillStyle = ir ? '#080a09' : '#0a0f0c';
    c.fillRect(0, 0, W * S, H * S);
    sceneGrid(c, S, W, H);

    // substrate column the clusters grow from
    const subX = W * 0.04, subW = W * 0.1;
    BOX(c, S, subX, H * 0.1, subW, H * 0.8, ir ? '#1a1a1a' : '#241a12');
    FRAME(c, S, subX, H * 0.1, subW, H * 0.8, ir ? '#3a3a3a' : '#3d2e22');

    CLUSTERS.forEach((cl, ci) => {
      const cx = cl.fx * W, cy = cl.fy * H, r = Math.max(2, cl.fr * H);
      // stalk back to the substrate
      plotLine(c, subX + subW, cy, cx - r, cy, S, ir ? '#5a5a5a' : '#6b5641', 1);
      // overlapping fan caps, shaded top-left
      const caps = tiny ? Math.min(2, cl.n) : cl.n;
      for (let k = 0; k < caps; k++) {
        const ox = cx + (k - caps / 2) * (r * 0.7), oy = cy + (k % 2) * (r * 0.3);
        for (let dy = -r; dy <= 1; dy++) for (let dx = -r; dx <= r; dx++) {
          if ((dx / r) ** 2 + (dy / r) ** 2 > 1) continue;
          const n = (dx * -0.4 + dy * -0.8) / r;
          const idx = Math.max(0, Math.min(capRamp.length - 1, Math.round((0.45 + n * 0.6) * (capRamp.length - 1))));
          PX(c, S, ox + dx, oy + dy, capRamp[idx]);
        }
      }

      // ── detection ──
      // In IR the last cluster is missed entirely: that is the finding the
      // day/night split exists to surface, not a bug in the drawing.
      if (ir && ci === 3) return;
      const bw = r * caps * 0.8 + r, bh = r * 1.8;
      const bx = cx - bw / 2, by = cy - r - 1;
      const snap = Math.min(1, ((t / 1000 + ci * 0.4) % 3.2) / 0.5);
      const pad = Math.round((1 - snap) * (r * 0.6));
      const col = cl.ready ? accent.bright : (ir ? '#8f8f8f' : '#8a96a2');

      GLOW(c, S, () => {
        const L = Math.max(2, Math.round(r * 0.45));   // corner brackets, not a full box
        [[bx - pad, by - pad, 1, 1], [bx + bw + pad, by - pad, -1, 1],
         [bx - pad, by + bh + pad, 1, -1], [bx + bw + pad, by + bh + pad, -1, -1]]
          .forEach(([cx0, cy0, sx, sy]) => {
            for (let i = 0; i < L; i++) { PX(c, S, cx0 + sx * i, cy0, col); PX(c, S, cx0, cy0 + sy * i, col); }
          });
      }, cl.ready ? accent.glow : 'transparent', cl.ready ? 3 : 0);

      // once snapped, ready caps fill in as a mask — cap area is the signal
      if (snap >= 1 && cl.ready) {
        c.globalAlpha = 0.20 + 0.06 * Math.sin(t / 300 + ci);
        for (let k = 0; k < caps; k++) {
          const ox = cx + (k - caps / 2) * (r * 0.7), oy = cy + (k % 2) * (r * 0.3);
          for (let dy = -r; dy <= 1; dy++) for (let dx = -r; dx <= r; dx++) {
            if ((dx / r) ** 2 + (dy / r) ** 2 > 1) continue;
            PX(c, S, ox + dx, oy + dy, accent.base);
          }
        }
        c.globalAlpha = 1;
      }
      // confidence bar — lower in IR, which is the honest result
      if (!tiny) {
        const conf = (cl.ready ? 0.82 : 0.44) * (ir ? 0.72 : 1);
        BOX(c, S, bx, by - 3, r * 1.4, 1, '#1c2a22');
        GLOW(c, S, () => BOX(c, S, bx, by - 3, r * 1.4 * conf, 1, col), cl.ready ? accent.glow : 'transparent', cl.ready ? 2 : 0);
      }
    });

    // IR overlay: sensor banding + a recording pip
    if (ir) {
      c.globalAlpha = 0.10;
      for (let y = (Math.floor(t / 40) % 4); y < H; y += 4) { c.fillStyle = '#ffffff'; c.fillRect(0, y * S, W * S, S); }
      c.globalAlpha = 1;
      if (Math.sin(t / 300) > -0.2) GLOW(c, S, () => BOX(c, S, W - W * 0.08, H * 0.08, 2, 2, '#ff5470'), '#ff5470', 3);
    }
    void rnd;
  }, [accent, scale, width, height], scale, width, height);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}
