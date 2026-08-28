// pixel-ideas.jsx — a library of small animated pixel-art "magic shenanigans"
// used by the Laboratory's vial cabinet and inspect modals. Pure-canvas,
// setInterval-driven, self-contained (own mini wizard).

import React from 'react';
import { ACCENTS } from './crt-ui';
import { plotLine } from './pixel-fx';

// ── pixel helpers ───────────────────────────────────────────────
const I = {
  px: (c, S, x, y, col) => { c.fillStyle = col; c.fillRect(Math.round(x) * S, Math.round(y) * S, S, S); },
  rect: (c, S, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x) * S, Math.round(y) * S, w * S, h * S); },
  glow: (c, S, x, y, col, g, b = 2) => { c.save(); c.shadowColor = g; c.shadowBlur = S * b; c.fillStyle = col; c.fillRect(Math.round(x) * S, Math.round(y) * S, S, S); c.restore(); },
  disc: (c, S, cx, cy, r, col) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + 0.5) { c.fillStyle = col; c.fillRect(Math.round(cx + dx) * S, Math.round(cy + dy) * S, S, S); } },
  ring: (c, S, cx, cy, rx, ry, col, step = 0.18) => { for (let a = 0; a < Math.PI * 2; a += step) { c.fillStyle = col; c.fillRect(Math.round(cx + Math.cos(a) * rx) * S, Math.round(cy + Math.sin(a) * ry) * S, S, S); } },
  line: (c, x0, y0, x1, y1, S, col, w = 1) => plotLine(c, x0, y0, x1, y1, S, col, w),
};

// compact wizard, facing right; returns orb position. fy = feet baseline.
function miniWizard(c, S, cx, fy, P, opt = {}) {
  const a = opt.alpha == null ? 1 : opt.alpha;
  c.save(); c.globalAlpha = a;
  const px = (x, y, col) => { c.fillStyle = col; c.fillRect(Math.round(x) * S, Math.round(y) * S, S, S); };
  for (let y = fy - 12; y <= fy - 1; y++) { const f = (y - (fy - 12)) / 11, hw = Math.round(2 + f * 4); for (let x = cx - hw; x <= cx + hw; x++) px(x, y, x <= cx - hw + 1 ? P.bright : (x >= cx + hw - 1 ? P.deep : P.base)); }
  for (let y = fy - 14; y <= fy - 8; y++) { const hw = Math.round(3 - (y - (fy - 14)) * 0.5); for (let x = cx - hw; x <= cx + hw; x++) px(x, y, '#eef2f6'); }
  for (let y = fy - 17; y <= fy - 14; y++) for (let x = cx - 3; x <= cx + 2; x++) px(x, y, '#e0a36b');
  px(cx - 2, fy - 16, P.bright); px(cx + 1, fy - 16, P.bright);
  for (let y = fy - 26; y <= fy - 17; y++) { const f = (y - (fy - 26)) / 9, hw = Math.round(f * 5); for (let x = cx - hw; x <= cx + hw; x++) px(x, y, (x === cx - hw || x === cx + hw) ? '#0a0a0a' : P.deep); }
  for (let x = cx - 6; x <= cx + 6; x++) px(x, fy - 16, '#0a0a0a');
  px(cx, fy - 22, P.bright);
  const sx = opt.noStaff ? null : cx + 7;
  if (sx != null) { for (let y = fy - 20; y <= fy - 2; y++) px(sx, y, '#7d5230'); }
  c.restore();
  const orb = { x: (sx != null ? sx : cx), y: fy - 23 };
  if (!opt.noStaff) { c.save(); c.globalAlpha = a; c.shadowColor = P.glow; c.shadowBlur = S * 3; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (dx * dx + dy * dy <= 4) { c.fillStyle = (dx * dx + dy * dy <= 1) ? '#fff' : P.glow; c.fillRect((orb.x + dx) * S, (orb.y + dy) * S, S, S); } c.restore(); }
  return { orb };
}

const rand = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

// ── scene draws: (ctx, t, S, P, W, H) ───────────────────────────
export const SCENES = {
  summon(c, t, S, P, W, H) {
    const ccx = 45, ccy = H - 5;
    const k = 0.6 + 0.4 * Math.sin(t / 280);
    c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 3 * k; I.ring(c, S, ccx, ccy, 14, 4, P.base, 0.2); c.restore();
    for (let i = 0; i < 6; i++) { const ang = t / 600 + i * Math.PI / 3; I.glow(c, S, ccx + Math.cos(ang) * 11, ccy + Math.sin(ang) * 3, P.bright, P.glow, 2); }
    const rise = Math.max(0, Math.sin(t / 1500)) * 16, top = ccy - rise;
    if (rise > 1) { for (let y = top - 8; y <= ccy - 1; y++) { const hw = y < top - 4 ? 2 : 3; for (let x = ccx - hw; x <= ccx + hw; x++) I.px(c, S, x, y, '#1b2620'); } I.glow(c, S, ccx - 1, top - 5, P.bright, P.glow, 2); I.glow(c, S, ccx + 1, top - 5, P.bright, P.glow, 2); }
    for (let i = 0; i < 9; i++) { const ph = ((t / 36 + i * 60) % 90) / 90; c.globalAlpha = 1 - ph; I.px(c, S, ccx + Math.sin(i * 1.7 + t / 400) * 9, ccy - ph * 24, P.bright); c.globalAlpha = 1; }
    miniWizard(c, S, 15, H - 2, P);
  },
  fireball(c, t, S, P, W, H) {
    miniWizard(c, S, 16, H - 2, P, { noStaff: true });
    const ph = (t % 1500) / 1500;
    const ox = 24, oy = H - 16;
    if (ph < 0.4) { const r = 1 + ph * 5; c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 4; I.disc(c, S, ox, oy, Math.round(r), P.base); I.disc(c, S, ox, oy, Math.round(r) - 1, P.bright); c.restore(); }
    else { const tt = (ph - 0.4) / 0.6; const fx = ox + tt * (W - ox - 2), fy = oy - Math.sin(tt * Math.PI) * 6; c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 5; I.disc(c, S, fx, fy, 3, P.base); I.disc(c, S, fx, fy, 2, P.bright); c.restore(); for (let k = 1; k < 6; k++) { c.globalAlpha = 1 - k / 6; I.px(c, S, fx - tt * 6 - k * 1.6, fy + (k % 2 ? 1 : -1), P.base); c.globalAlpha = 1; } }
  },
  cauldron(c, t, S, P, W, H) {
    const cx = W / 2, cy = H - 8;
    I.rect(c, S, cx - 9, cy - 6, 18, 7, '#2a3138'); I.rect(c, S, cx - 10, cy - 7, 20, 2, '#3a444c');
    I.px(c, S, cx - 8, cy + 1, '#2a3138'); I.px(c, S, cx + 7, cy + 1, '#2a3138');
    I.rect(c, S, cx - 8, cy - 8, 16, 2, P.deep); c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 2; I.rect(c, S, cx - 8, cy - 8, 16, 1, P.base); c.restore();
    for (let i = 0; i < 5; i++) { const ph = ((t / 30 + i * 50) % 70) / 70; const bx = cx - 6 + ((i * 5) % 13); const by = cy - 8 - ph * 12; c.globalAlpha = 1 - ph; I.glow(c, S, bx, by, P.bright, P.glow, 2); c.globalAlpha = 1; }
    if (Math.sin(t / 300) > 0.8) I.glow(c, S, cx + 5, cy - 14, '#fff', P.glow, 3);
    for (let i = 0; i < 6; i++) { const fy = cy + 2 + (rand(i + Math.floor(t / 120)) > 0.5 ? 0 : 1); I.px(c, S, cx - 6 + i * 2, fy, i % 2 ? '#ff6a00' : '#ffd166'); }
  },
  crystalBall(c, t, S, P, W, H) {
    const cx = W / 2, cy = H / 2 - 2, r = 12;
    I.rect(c, S, cx - 7, cy + r - 1, 14, 4, '#2a2118'); I.rect(c, S, cx - 9, cy + r + 2, 18, 2, '#3a2e1f');
    I.disc(c, S, cx, cy, r, '#0a1a14'); c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 2; I.ring(c, S, cx, cy, r, r, P.deep, 0.14); c.restore();
    for (let i = 0; i < 14; i++) { const a = t / 500 + i * 0.7; const rr = (r - 3) * (0.3 + 0.6 * rand(i)); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a * 1.3) * rr * 0.7; c.globalAlpha = 0.7; I.px(c, S, x, y, i % 3 ? P.base : P.bright); c.globalAlpha = 1; }
    I.px(c, S, cx - 4, cy - 5, 'rgba(255,255,255,.8)'); I.px(c, S, cx - 3, cy - 5, 'rgba(255,255,255,.5)');
  },
  lightning(c, t, S, P, W, H) {
    miniWizard(c, S, 15, H - 2, P);
    if ((t % 1100) / 1100 < 0.32) {
      let x = 33, y = H - 26; c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 4;
      while (y < H - 4) { const nx = x + (rand(Math.floor(t / 40) + y) - 0.5) * 6, ny = y + 3; I.line(c, x, y, nx, ny, S, P.bright, 1); x = nx; y = ny; }
      c.restore(); I.glow(c, S, x, H - 4, '#fff', P.glow, 3);
    }
  },
  portal(c, t, S, P, W, H) {
    const cx = W / 2, cy = H / 2;
    for (let ring = 0; ring < 4; ring++) { const rr = 5 + ring * 3 + Math.sin(t / 300 + ring) * 1; c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 2; I.ring(c, S, cx, cy, rr, rr * 1.2, ring % 2 ? P.base : P.deep, 0.16 + ring * 0.02); c.restore(); }
    for (let i = 0; i < 16; i++) { const a = t / 360 + i * 0.4; const rr = 14 - ((t / 30 + i * 4) % 14); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 1.2; c.globalAlpha = rr / 14; I.px(c, S, x, y, P.bright); c.globalAlpha = 1; }
    I.disc(c, S, cx, cy, 3, '#04110a'); I.glow(c, S, cx, cy, P.bright, P.glow, 3);
  },
  owl(c, t, S, P, W, H) {
    const cx = W / 2, cy = H / 2 + 2;
    const flap = Math.sin(t / 180);
    I.disc(c, S, cx, cy, 6, P.deep); I.disc(c, S, cx, cy + 1, 4, P.base);
    const wy = cy + Math.round(flap * 2);
    I.rect(c, S, cx - 11, wy - 1, 5, 3, P.deep); I.rect(c, S, cx + 7, wy - 1, 5, 3, P.deep);
    I.disc(c, S, cx, cy - 6, 5, P.base);
    const blink = Math.sin(t / 700) > -0.2;
    I.glow(c, S, cx - 2, cy - 6, blink ? '#fff' : P.deep, P.glow, 2); I.glow(c, S, cx + 2, cy - 6, blink ? '#fff' : P.deep, P.glow, 2);
    I.px(c, S, cx, cy - 4, '#ff9d2f');
    I.px(c, S, cx - 4, cy - 11, P.deep); I.px(c, S, cx + 4, cy - 11, P.deep);
  },
  levitate(c, t, S, P, W, H) {
    miniWizard(c, S, 18, H - 2, P, { noStaff: true });
    const cx = 38, cy = H / 2 + 2;
    for (let i = 0; i < 3; i++) { const a = t / 500 + i * (Math.PI * 2 / 3); const x = cx + Math.cos(a) * 12, y = cy + Math.sin(a) * 6; c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 1.5; I.rect(c, S, x - 1, y - 1, 3, 3, '#6a6f76'); I.px(c, S, x - 1, y - 1, '#9aa6b2'); c.restore(); }
    I.glow(c, S, cx, cy, P.bright, P.glow, 2);
  },
  enchant(c, t, S, P, W, H) {
    const cx = W / 2, by = H - 6;
    I.rect(c, S, cx - 1, by - 22, 2, 18, '#cfd6dd'); I.px(c, S, cx, by - 22, '#fff');
    I.rect(c, S, cx - 4, by - 5, 9, 2, '#7d5230'); I.rect(c, S, cx - 1, by - 4, 2, 4, '#5c4326');
    for (let i = 0; i < 6; i++) { const ph = ((t / 26 + i * 40) % 60) / 60; const x = cx + Math.sin(i * 2 + t / 300) * 8; const y = by - 4 - ph * 22; c.globalAlpha = 1 - ph; I.glow(c, S, x, y, i % 2 ? P.bright : P.base, P.glow, 2); c.globalAlpha = 1; }
    if (Math.sin(t / 250) > 0) { c.save(); c.globalAlpha = 0.5; c.shadowColor = P.glow; c.shadowBlur = S * 3; I.rect(c, S, cx - 1, by - 22, 2, 18, P.bright); c.restore(); }
  },
  ward(c, t, S, P, W, H) {
    miniWizard(c, S, W / 2, H - 2, P, { noStaff: true });
    const cx = W / 2, cy = H / 2 + 2, r = 16 + Math.sin(t / 300);
    c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 2; c.globalAlpha = 0.85;
    for (let a = 0; a < Math.PI * 2; a += 0.12) { const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; I.px(c, S, x, y, ((a * 6 + t / 200) % 2 < 1) ? P.base : P.deep); }
    c.restore();
    for (let i = 0; i < 6; i++) { const a = t / 800 + i * Math.PI / 3; I.glow(c, S, cx + Math.cos(a) * r, cy + Math.sin(a) * r, '#fff', P.glow, 2); }
  },
  teleport(c, t, S, P, W, H) {
    const ph = (t % 2000) / 2000;
    let alpha = 1; if (ph < 0.4) alpha = 1 - ph / 0.4; else if (ph < 0.55) alpha = 0; else alpha = (ph - 0.55) / 0.45;
    const cx = ph < 0.5 ? W / 2 - 8 : W / 2 + 8;
    miniWizard(c, S, cx, H - 2, P, { alpha });
    for (let i = 0; i < 10; i++) { const pp = (ph < 0.5 ? ph / 0.5 : (ph - 0.55) / 0.45); const rr = (ph < 0.5 ? pp : 1 - pp) * 12; const a = i * 0.63 + t / 300; c.globalAlpha = 1 - pp; I.px(c, S, cx + Math.cos(a) * rr, (H - 12) + Math.sin(a) * rr, P.bright); c.globalAlpha = 1; }
  },
  coffee(c, t, S, P, W, H) {
    const cx = W / 2, by = H - 8;
    I.rect(c, S, cx - 8, by - 10, 16, 12, '#cfd6dd'); I.rect(c, S, cx - 8, by - 10, 16, 3, '#9aa6b2');
    I.rect(c, S, cx - 6, by - 8, 12, 3, '#5c4326');
    I.rect(c, S, cx + 8, by - 7, 3, 5, '#9aa6b2'); I.px(c, S, cx + 10, by - 6, '#9aa6b2');
    for (let i = 0; i < 3; i++) { const ph = ((t / 26 + i * 40) % 60) / 60; const x = cx - 3 + i * 3 + Math.sin(ph * 6 + i) * 1.5; const y = by - 11 - ph * 12; c.globalAlpha = 1 - ph; I.px(c, S, x, y, '#aeb8c2'); c.globalAlpha = 1; }
  },
  terminal(c, t, S, P, W, H) {
    I.rect(c, S, 6, 4, W - 12, H - 8, '#04110a'); c.save(); c.shadowColor = P.glow; c.shadowBlur = S; I.rect(c, S, 6, 4, W - 12, 1, P.base); c.restore();
    const n = Math.floor(t / 300);
    for (let r = 0; r < 6; r++) { const seed = n - 5 + r; const wlen = 4 + Math.floor(rand(seed) * 18); c.globalAlpha = r === 5 ? 1 : 0.4 + r * 0.1; I.rect(c, S, 9, 8 + r * 4, wlen, 1, P.base); c.globalAlpha = 1; }
    if (Math.sin(t / 250) > 0) I.rect(c, S, 9, 8 + 5 * 4, 2, 1, P.bright);
  },
  cat(c, t, S, P, W, H) {
    const cx = W / 2, by = H - 8;
    I.disc(c, S, cx, by - 2, 7, P.deep); I.disc(c, S, cx, by - 2, 5, P.base);
    I.disc(c, S, cx - 8, by - 4, 4, P.base);
    I.px(c, S, cx - 11, by - 7, P.deep); I.px(c, S, cx - 6, by - 7, P.deep);
    const blink = Math.sin(t / 600) > -0.3; I.px(c, S, cx - 9, by - 4, blink ? '#04110a' : P.base);
    const tf = Math.sin(t / 400) * 3; I.line(c, cx + 6, by - 1, cx + 11, by - 4 + tf, S, P.base, 1);
    const zp = (t / 40) % 40; c.globalAlpha = 1 - zp / 40; I.px(c, S, cx - 6 + zp * 0.2, by - 12 - zp * 0.2, P.bright); c.globalAlpha = 1;
  },
};

// living grimoire hero: book auto-writing + a card rising + a scribe owl
export function grimoireHero(c, t, S, P, W, H) {
  const cx = W / 2, by = H - 14;
  I.rect(c, S, cx - 4, by + 8, 8, 6, '#2a2118'); I.rect(c, S, cx - 10, by + 13, 20, 2, '#3a2e1f');
  for (let i = 0; i < 18; i++) { const h = 12 - Math.abs(i - 9) * 0.3; I.rect(c, S, cx - 18 + i, by + 8 - h, 1, h, '#e8e0cf'); }
  I.rect(c, S, cx - 1, by - 6, 2, 14, '#b8a98a');
  I.rect(c, S, cx - 19, by - 5, 38, 1, '#9c8e72');
  const cyc = (t / 2600) % 1; const lines = Math.floor(cyc * 8);
  c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 0.8;
  for (let r = 0; r < Math.min(4, lines); r++) I.rect(c, S, cx - 16, by - 3 + r * 3, 4 + ((r * 5) % 9), 1, P.base);
  for (let r = 0; r < Math.min(4, Math.max(0, lines - 4)); r++) I.rect(c, S, cx + 3, by - 3 + r * 3, 4 + ((r * 7) % 10), 1, P.base);
  c.restore();
  const rise = Math.max(0, Math.sin(cyc * Math.PI)) * 22; const card = by - 8 - rise;
  if (rise > 1) { c.save(); c.shadowColor = P.glow; c.shadowBlur = S * 3; I.rect(c, S, cx - 4, card - 5, 8, 10, '#06140d'); I.ring(c, S, cx, card, 4, 5, P.base, 0.4); I.glow(c, S, cx, card, P.bright, P.glow, 2); c.restore(); for (let i = 0; i < 5; i++) { c.globalAlpha = 0.8 - i / 6; I.px(c, S, cx + Math.sin(i + t / 200) * 4, card + 5 + i * 2, P.bright); c.globalAlpha = 1; } }
  const sx = W - 14 + Math.sin(t / 400) * 2, sy = 14 + Math.sin(t / 300) * 2;
  I.disc(c, S, sx, sy, 4, P.deep); I.disc(c, S, sx, sy - 4, 3, P.base);
  const fl = Math.sin(t / 150); I.rect(c, S, sx - 7, sy - 1 + Math.round(fl), 4, 2, P.deep); I.rect(c, S, sx + 4, sy - 1 - Math.round(fl), 4, 2, P.deep);
  I.glow(c, S, sx - 1, sy - 4, '#fff', P.glow, 2); I.glow(c, S, sx + 1, sy - 4, '#fff', P.glow, 2);
  I.rect(c, S, sx - 1, sy + 4, 2, 4, '#e8e0cf');
}

// ── React wrapper ───────────────────────────────────────────────
export function IdeaFX({ scene, palette, w = 64, h = 48, scale = 4, fps = 30, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = w * scale * dpr; cv.height = h * scale * dpr;
    cv.style.width = w * scale + 'px'; cv.style.height = h * scale + 'px';
    const c = cv.getContext('2d'); c.scale(dpr, dpr); c.imageSmoothingEnabled = false;
    const fn = typeof scene === 'function' ? scene : SCENES[scene];
    if (!fn) return;
    const t0 = performance.now();
    const loop = () => { const t = performance.now() - t0; c.clearRect(0, 0, w * scale, h * scale); fn(c, t, scale, palette, w, h); };
    loop(); const id = setInterval(loop, 1000 / fps); return () => clearInterval(id);
  }, [scene, palette, w, h, scale, fps]);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

export const PAL = () => ({
  green: ACCENTS.green, violet: ACCENTS.violet, cyan: ACCENTS.cyan, amber: ACCENTS.amber,
  fire: { deep: '#7a2a00', base: '#ff6a00', bright: '#ffd166', glow: '#ff5a1f' },
  ice: { deep: '#0b6f86', base: '#5fd0ff', bright: '#d8f4ff', glow: '#49c6ff' },
});

// vial captions — flavour, but each one points at something real in the work.
export function IDEAS() {
  const p = PAL();
  return [
    ['summon', p.green, 'SUMMON', 'Call a remote MCP server into being. No local process required.'],
    ['fireball', p.fire, 'FIREBALL', 'Ship it. Then find out what production does to it.'],
    ['lightning', p.cyan, 'CHAIN LIGHTNING', 'One embedding pass, many markets matched at once.'],
    ['cauldron', p.green, 'BREW POTION', 'The labelling pipeline: VLM in, SAM masks out, reviewed by hand.'],
    ['crystalBall', p.violet, 'SCRY', 'A Brownian model guessing where the price lands in five minutes.'],
    ['portal', p.violet, 'OPEN A PORTAL', 'HTTP transport. The server can live anywhere now.'],
    ['owl', p.amber, 'FAMILIAR', 'An agent that drafts for you — and waits to be told to send.'],
    ['levitate', p.green, 'LEVITATE', 'Two legs, executed concurrently, so neither is left hanging.'],
    ['enchant', p.ice, 'ENCHANT', 'Per-user memory, bound to a Durable Object that never forgets.'],
    ['ward', p.green, 'WARD', 'The approval queue. Nothing leaves without a human saying so.'],
    ['teleport', p.violet, 'BLINK', 'Lisbon today. Wherever the work is, tomorrow.'],
    ['coffee', p.amber, 'DEV FUEL', 'A steaming mug — because, obviously.'],
    ['terminal', p.green, 'TERMINAL', 'Where most of this actually happened.'],
    ['cat', p.amber, 'LOAF', 'A sleeping cat familiar. Pure vibes.'],
  ];
}
