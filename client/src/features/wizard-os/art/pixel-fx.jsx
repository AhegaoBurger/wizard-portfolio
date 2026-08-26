// pixel-fx.jsx — shared canvas primitives + the two market scenes.
// PixelOptionsArb is the scene for pmbots (market price vs model-implied
// probability, two legs). PixelChart is kept as a general market backdrop.
// The rover and robot-arm scenes from the design project are deliberately gone:
// they illustrated projects that don't exist.

import React from 'react';

// tiny Bresenham line of S-sized cells
export function plotLine(ctx, x0, y0, x1, y1, S, col, w = 1) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  ctx.fillStyle = col;
  for (;;) {
    ctx.fillRect(x0 * S, y0 * S, S * w, S * w);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

// 3x5 pixel digit font for price tags
const DIGITS = {
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '111', '001', '111'],
  4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'],
  6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'],
  8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111'],
  ',': ['000', '000', '000', '010', '100'], '$': ['011', '110', '011', '110', '010'],
};
export function drawTinyNum(ctx, num, px, py, S) {
  const str = '$' + num.toLocaleString('en-US');
  let cx = px;
  for (const ch of str) {
    const g = DIGITS[ch]; if (!g) { cx += 2 * (S * 0.5); continue; }
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r][c] === '1') ctx.fillRect(cx + c * (S * 0.5), py + r * (S * 0.5), S * 0.5, S * 0.5);
    cx += 4 * (S * 0.5);
  }
}

// ── candlestick chart ───────────────────────────────────────────
export function PixelChart({ accent, scale = 4, width = 116, height = 56, style = {}, basePrice = 21800 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const S = scale;
    cv.width = width * S * dpr; cv.height = height * S * dpr;
    cv.style.width = width * S + 'px'; cv.style.height = height * S + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); ctx.imageSmoothingEnabled = false;

    const up = accent.base, upGlow = accent.glow, down = '#ff5470';
    const grid = '#11201a';
    const cw = 4, gap = 3, step = cw + gap;
    const pad = 14; // right gutter for price tag
    const n = Math.ceil(width / step) + 3;

    let seed = 20260826;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const lo = 8, hi = height - 8;
    const mk = (p) => {
      const dir = rng() < 0.54 ? 1 : -1; const body = 2 + rng() * 7;
      const o = p; let c = o + dir * body; c = Math.max(lo, Math.min(hi, c));
      const h = Math.max(o, c) + 1 + rng() * 3; const l = Math.min(o, c) - 1 - rng() * 3;
      return { o, h, l, c };
    };
    let price = height * 0.45;
    const candles = []; for (let i = 0; i < n; i++) { const cd = mk(price); candles.push(cd); price = cd.c; }
    const closes = () => candles.map((c) => c.c);
    const t0 = performance.now(); const stepMs = 560; let pushed = 0;

    const draw = (now) => {
      const t = now - t0; const prog = (t % stepMs) / stepMs;
      const total = Math.floor(t / stepMs);
      while (pushed < total) { const cd = mk(price); candles.push(cd); price = cd.c; candles.shift(); pushed++; }
      ctx.clearRect(0, 0, width * S, height * S);
      // grid
      ctx.fillStyle = grid;
      for (let gy = 4; gy < height; gy += 9) ctx.fillRect(0, gy * S, (width - pad) * S, 1);
      const xoff = prog * step;
      // moving average (4)
      const cl = closes();
      const ma = cl.map((_, i) => { const a = cl.slice(Math.max(0, i - 4), i + 1); return a.reduce((s, v) => s + v, 0) / a.length; });
      // candles
      candles.forEach((cd, i) => {
        const cx = Math.round(i * step - xoff) + 2;
        if (cx < -step || cx > width - pad + step) return;
        const yH = height - cd.h, yL = height - cd.l, yO = height - cd.o, yC = height - cd.c;
        const isUp = cd.c >= cd.o; const col = isUp ? up : down;
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(cx + cw / 2) * S, Math.round(yH) * S, S, Math.max(S, Math.round(yL - yH) * S));
        ctx.save(); ctx.shadowColor = isUp ? upGlow : down; ctx.shadowBlur = S * 1.4;
        const bt = Math.min(yO, yC), bh = Math.max(1, Math.abs(yC - yO));
        ctx.fillRect(cx * S, Math.round(bt) * S, cw * S, Math.round(bh) * S);
        ctx.restore();
      });
      // MA line (bright)
      ctx.save(); ctx.shadowColor = accent.bright; ctx.shadowBlur = S * 1.2;
      for (let i = 1; i < candles.length; i++) {
        const x0 = i * step - xoff + 2 + cw / 2, x1 = (i - 1) * step - xoff + 2 + cw / 2;
        if (x1 < -step || x0 > width - pad + step) continue;
        plotLine(ctx, x1, height - ma[i - 1], x0, height - ma[i], S, accent.bright, 1);
      }
      ctx.restore();
      // last price tag
      const lastClose = candles[candles.length - 1].c;
      const tagY = Math.round(height - lastClose);
      ctx.fillStyle = '#04110a';
      ctx.fillRect((width - pad) * S, 0, pad * S, height * S);
      // dashed marker line
      for (let x = 0; x < width - pad; x += 4) ctx.fillRect(x * S, tagY * S, 2 * S, 1);
      ctx.save(); ctx.shadowColor = upGlow; ctx.shadowBlur = S * 2;
      ctx.fillStyle = up; ctx.fillRect((width - pad) * S, (tagY - 4) * S, pad * S, 8 * S);
      ctx.restore();
      ctx.fillStyle = '#04110a';
      const pnum = Math.round(basePrice + lastClose * 120);
      drawTinyNum(ctx, pnum, (width - pad + 1) * S, (tagY - 2.2) * S, S);
    };
    draw(performance.now());
    const id = setInterval(() => draw(performance.now()), 1000 / 30);
    return () => clearInterval(id);
  }, [accent, scale, width, height, basePrice]);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

// ── pmbots: market price vs model-implied probability ───────────
// Top: scrolling BTC tick. Middle/bottom: the UP and DOWN legs, each with a
// MARKET marker (◆) against the model-implied marker (▢). The gap is the edge;
// it glows and flips an arrow when the model disagrees with the market.
export function PixelOptionsArb({ accent, scale = 4, width = 120, height = 60, style = {}, basePrice = 64200 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const S = scale;
    cv.width = width * S * dpr; cv.height = height * S * dpr;
    cv.style.width = width * S + 'px'; cv.style.height = height * S + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); ctx.imageSmoothingEnabled = false;

    const up = accent.base, glow = accent.glow, red = '#ff5470';
    let seed = 20260826;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const tickBand = 16; const series = []; let p = tickBand * 0.5;
    for (let i = 0; i < width; i++) { p += (rng() - 0.5) * 2.4; p = Math.max(2, Math.min(tickBand - 2, p)); series.push(p); }
    const t0 = performance.now(); let pushed = 0;
    const trackL = 26, trackR = width - 8, trackW = trackR - trackL;
    const clamp01 = (v) => Math.max(0.06, Math.min(0.94, v));

    const drawTrack = (y, marketP, impliedP) => {
      // guide
      ctx.fillStyle = '#1d2a23'; ctx.fillRect(trackL * S, y * S, trackW * S, 1);
      // 50% tick
      ctx.fillStyle = '#33433a'; ctx.fillRect(Math.round(trackL + trackW * 0.5) * S, (y - 3) * S, 1, 6 * S);
      const mx = trackL + trackW * marketP, ix = trackL + trackW * impliedP;
      const edge = impliedP - marketP;
      const big = Math.abs(edge) > 0.1;
      // edge bar between markers
      const c = edge > 0 ? up : red, g = edge > 0 ? glow : red;
      ctx.save(); if (big) { ctx.shadowColor = g; ctx.shadowBlur = S * 2.4; }
      ctx.fillStyle = c;
      const x0 = Math.min(mx, ix), w = Math.abs(ix - mx);
      ctx.fillRect(Math.round(x0) * S, (y - 1) * S, Math.max(1, Math.round(w)) * S, 2 * S);
      ctx.restore();
      // market marker = filled diamond
      ctx.fillStyle = '#cdd6df';
      for (let dy = -2; dy <= 2; dy++) { const w2 = 2 - Math.abs(dy); ctx.fillRect(Math.round(mx - w2) * S, Math.round(y + dy) * S, (w2 * 2 + 1) * S, S); }
      // implied marker = hollow square (glowing)
      ctx.save(); ctx.shadowColor = g; ctx.shadowBlur = S * (big ? 3 : 1.2); ctx.fillStyle = c;
      ctx.fillRect(Math.round(ix - 2) * S, (y - 2) * S, 5 * S, S);
      ctx.fillRect(Math.round(ix - 2) * S, (y + 2) * S, 5 * S, S);
      ctx.fillRect(Math.round(ix - 2) * S, (y - 2) * S, S, 5 * S);
      ctx.fillRect(Math.round(ix + 2) * S, (y - 2) * S, S, 5 * S);
      ctx.restore();
      // arb arrow when the gap clears fees and slippage
      if (big) {
        const dir = edge > 0 ? 1 : -1;
        ctx.save(); ctx.shadowColor = g; ctx.shadowBlur = S * 3; ctx.fillStyle = c;
        const ax = ix + dir * 5;
        for (let k = 0; k < 3; k++) ctx.fillRect(Math.round(ax + dir * k) * S, (y - k) * S, S, (2 * k + 1) * S);
        ctx.restore();
      }
    };

    const draw = (now) => {
      const t = now - t0;
      // scroll BTC ticks
      const total = Math.floor(t / 90);
      while (pushed < total) { p += (rng() - 0.5) * 2.4; p = Math.max(2, Math.min(tickBand - 2, p)); series.push(p); series.shift(); pushed++; }
      ctx.clearRect(0, 0, width * S, height * S);
      // grid
      ctx.fillStyle = '#0e1813';
      for (let gy = 0; gy < height; gy += 12) ctx.fillRect(0, gy * S, width * S, 1);
      // BTC tick line
      ctx.save(); ctx.shadowColor = glow; ctx.shadowBlur = S * 1.2;
      for (let i = 1; i < series.length; i++) plotLine(ctx, i - 1, 2 + series[i - 1], i, 2 + series[i], S, accent.bright, 1);
      ctx.restore();
      const headY = 2 + series[series.length - 1];
      ctx.save(); ctx.shadowColor = glow; ctx.shadowBlur = S * 3; ctx.fillStyle = accent.bright;
      ctx.fillRect((width - 2) * S, Math.round(headY) * S, 2 * S, 2 * S); ctx.restore();
      // price tag
      const px = Math.round(basePrice + (series[series.length - 1] - tickBand / 2) * 90);
      ctx.fillStyle = '#04110a'; ctx.fillRect(0, 0, 24 * S, 7 * S);
      drawTinyNum(ctx, px, 1 * S, 1.5 * S, S);

      // animated probabilities (drift + occasional divergence)
      const upMk = 0.5 + 0.16 * Math.sin(t / 1400) + 0.04 * Math.sin(t / 370);
      const upIm = 0.5 + 0.16 * Math.sin(t / 1400 + 0.5) + 0.14 * Math.sin(t / 900 + 1);
      const dnMk = 1 - upMk + 0.02 * Math.sin(t / 600);
      const dnIm = 1 - upIm - 0.04 * Math.sin(t / 1100);
      drawTrack(34, clamp01(upMk), clamp01(upIm));
      drawTrack(50, clamp01(dnMk), clamp01(dnIm));
    };
    draw(performance.now());
    const id = setInterval(() => draw(performance.now()), 1000 / 30);
    return () => clearInterval(id);
  }, [accent, scale, width, height, basePrice]);
  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}
