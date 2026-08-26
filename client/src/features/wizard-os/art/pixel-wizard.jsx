// pixel-wizard.jsx — procedural pixel-art wizard sprite, drawn to <canvas>.
// Crisp integer pixels (no SVG, no smoothing). Modes: idle bob, spell-cast
// with travelling bolt, and a two-wizard duel.
//
// The sprite is composed from geometric primitives evaluated per logical pixel
// so it stays symmetric and clean. Logical grid is W x H "big pixels"; each is
// drawn as a SCALE x SCALE rect.

import React from 'react';
import { ACCENTS } from './crt-ui';

const SPRITE_W = 30;
const SPRITE_H = 34;

// palette derived from a crt-ui ACCENT
function wizPalette(a, mono) {
  return {
    outline: '#080a0c',
    hat: a.deep, hatHi: a.base, star: a.bright,
    skin: mono ? '#b9c2cc' : '#e0a36b',
    skinSh: mono ? '#828d98' : '#b87a44',
    eye: a.bright,
    beard: '#eef2f6', beardSh: '#9aa6b2',
    robe: a.base, robeHi: a.bright, robeSh: a.deep,
    staff: mono ? '#8a929b' : '#7d5230', staffHi: mono ? '#c2c9d0' : '#a8703e',
    orbCore: '#ffffff', orbGlow: a.glow, br: a.bright, base: a.base, deep: a.deep,
  };
}

// Build a color index grid for the wizard body (facing right). Returns a 2D
// array [y][x] of palette keys or null. Computed once; bob/cast only shift it.
function buildWizardGrid() {
  const g = Array.from({ length: SPRITE_H }, () => new Array(SPRITE_W).fill(null));
  const set = (x, y, c) => { if (x >= 0 && x < SPRITE_W && y >= 0 && y < SPRITE_H && c) g[y][x] = c; };
  const cx = 12;            // body centre column
  const hatTop = 2, hatBase = 13, hatHalf = 7;

  // ── Hat (triangle) with slight rightward lean ──
  for (let y = hatTop; y <= hatBase; y++) {
    const f = (y - hatTop) / (hatBase - hatTop);
    const half = Math.round(f * hatHalf);
    const lean = Math.round((1 - f) * 2);     // tip leans right
    const c = cx + lean;
    for (let x = c - half; x <= c + half; x++) {
      let col = 'hat';
      if (x <= c - half + 1) col = 'hatHi';   // left highlight band
      if (x === c - half || x === c + half) col = 'outline';
      set(x, y, col);
    }
  }
  // hat star
  set(cx + 1, 8, 'star'); set(cx, 9, 'star'); set(cx + 2, 9, 'star');
  set(cx + 1, 9, 'orbCore'); set(cx + 1, 10, 'star');
  // brim
  for (let x = cx - hatHalf - 1; x <= cx + hatHalf + 1; x++) set(x, hatBase + 1, 'outline');
  for (let x = cx - hatHalf; x <= cx + hatHalf; x++) set(x, hatBase, 'hat');

  // ── Face (ellipse) under the brim ──
  const fcy = 17, fa = 4.2, fb = 3.4;
  for (let y = 15; y <= 20; y++) {
    for (let x = cx - 5; x <= cx + 5; x++) {
      const d = ((x - cx) / fa) ** 2 + ((y - fcy) / fb) ** 2;
      if (d <= 1) set(x, y, x >= cx + 3 ? 'skinSh' : 'skin');
    }
  }
  // glowing eyes
  set(cx - 2, 16, 'eye'); set(cx + 2, 16, 'eye');
  set(cx - 2, 17, 'outline'); set(cx + 2, 17, 'outline');

  // ── Robe (trapezoid) ──
  const robeTop = 21, robeBot = 31;
  for (let y = robeTop; y <= robeBot; y++) {
    const f = (y - robeTop) / (robeBot - robeTop);
    const half = Math.round(3 + f * 5);
    for (let x = cx - half; x <= cx + half; x++) {
      let col = 'robe';
      if (x <= cx - half + 1) col = 'robeHi';
      if (x >= cx + half - 1) col = 'robeSh';
      if (x === cx - half || x === cx + half) col = 'outline';
      set(x, y, col);
    }
  }
  // robe hem split + feet
  set(cx - 1, robeBot, 'outline'); set(cx, robeBot, 'outline'); set(cx + 1, robeBot, 'outline');
  set(cx - 4, robeBot + 1, 'robeSh'); set(cx - 3, robeBot + 1, 'robeSh');
  set(cx + 3, robeBot + 1, 'robeSh'); set(cx + 4, robeBot + 1, 'robeSh');

  // ── Beard (triangle, over chest) ──
  for (let y = 19; y <= 27; y++) {
    const half = Math.round(4 - (y - 19) * 0.46);
    if (half < 0) break;
    for (let x = cx - half; x <= cx + half; x++) {
      set(x, y, x >= cx + half - 1 && half > 1 ? 'beardSh' : 'beard');
    }
  }

  // ── Left arm/sleeve ──
  set(cx - 5, 22, 'robeHi'); set(cx - 6, 23, 'robeHi'); set(cx - 6, 24, 'robe');
  set(cx - 5, 23, 'robe'); set(cx - 5, 24, 'robe'); set(cx - 5, 25, 'robeSh');

  // ── Right arm reaching to the staff ──
  const arm = [[cx + 4, 22], [cx + 5, 22], [cx + 6, 23], [cx + 7, 23], [cx + 7, 24]];
  arm.forEach(([x, y]) => set(x, y, 'robe'));
  set(cx + 6, 22, 'robeSh');
  // hand
  set(cx + 7, 22, 'skin'); set(cx + 8, 23, 'skin');

  return g;
}

// Draw a prebuilt grid with optional vertical offset + facing.
function blitGrid(ctx, grid, P, S, faceRight, dx, dy, glowKeys) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const key = grid[y][x];
      if (!key) continue;
      const px = faceRight ? x : (SPRITE_W - 1 - x);
      const sx = Math.round((px + dx) * S);
      const sy = Math.round((y + dy) * S);
      if (glowKeys && glowKeys[key]) {
        ctx.save(); ctx.shadowColor = P.orbGlow; ctx.shadowBlur = S * 2.2;
        ctx.fillStyle = P[key]; ctx.fillRect(sx, sy, S, S); ctx.restore();
      } else {
        ctx.fillStyle = P[key]; ctx.fillRect(sx, sy, S, S);
      }
    }
  }
}

// staff + orb drawn separately so the orb can pulse / raise during a cast.
function drawStaffOrb(ctx, P, S, faceRight, dx, dy, orbLift, pulse) {
  const cx = 12;
  const sxCol = faceRight ? (cx + 8) : (SPRITE_W - 1 - (cx + 8));
  // staff
  for (let y = 11; y <= 27; y++) {
    const sx = Math.round((sxCol + dx) * S);
    const sy = Math.round((y + dy) * S);
    ctx.fillStyle = (y % 2 === 0) ? P.staff : P.staffHi;
    ctx.fillRect(sx, sy, S, S);
  }
  // orb at staff top
  const ocx = sxCol + dx;
  const ocy = 9 - orbLift + dy;
  ctx.save();
  ctx.shadowColor = P.orbGlow;
  ctx.shadowBlur = S * (3 + pulse * 4);
  const r = 2;
  for (let oy = -r; oy <= r; oy++) {
    for (let ox = -r; ox <= r; ox++) {
      if (ox * ox + oy * oy > r * r + 1) continue;
      ctx.fillStyle = (ox * ox + oy * oy <= 1) ? P.orbCore : P.orbGlow;
      ctx.fillRect(Math.round((ocx + ox) * S), Math.round((ocy + oy) * S), S, S);
    }
  }
  ctx.restore();
  return { x: ocx, y: ocy };
}

// ── React component ───────────────────────────────────────────
// mode: 'idle' | 'cast'. scale = pixels per logical cell.
export function PixelWizard({ accent, mode = 'idle', scale = 6, mono = false, style = {}, facing = 'right' }) {
  const ref = React.useRef(null);
  const a = accent || ACCENTS.mono;
  const W = SPRITE_W + (mode === 'cast' ? 26 : 4); // extra room for the bolt
  const H = SPRITE_H + 4;

  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = scale;
    cv.width = W * S * dpr; cv.height = H * S * dpr;
    cv.style.width = W * S + 'px'; cv.style.height = H * S + 'px';
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
    const P = wizPalette(a, mono);
    const grid = buildWizardGrid();
    const faceRight = facing === 'right';
    const bolts = [];
    const t0 = performance.now();
    let lastCast = -9999;

    const glowKeys = { eye: 1, star: 1, orbCore: 1 };

    const frame = (now) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W * S, H * S);
      const bob = Math.round(Math.sin(t / 560) * 1.0);
      const baseDx = faceRight ? 2 : (W - SPRITE_W - 2);
      const baseDy = 3 + bob;

      let orbLift = 0, pulse = 0.5 + 0.5 * Math.sin(t / 320);

      if (mode === 'cast') {
        const period = 1500;
        const ph = (t % period) / period;
        // charge & raise
        if (ph < 0.34) { orbLift = Math.round((ph / 0.34) * 3); pulse = 0.4 + (ph / 0.34) * 1.4; }
        else if (ph < 0.46) { orbLift = 3; pulse = 2.2; }
        else { orbLift = Math.round((1 - (ph - 0.46) / 0.54) * 3); }
        // spawn a bolt at release
        if (ph >= 0.44 && lastCast < t - period * 0.8) {
          lastCast = t;
          const dir = faceRight ? 1 : -1;
          bolts.push({ x: faceRight ? (baseDx + 20) : (baseDx + 10), y: baseDy + 9, dir, life: 0 });
        }
      }

      // body + staff/orb
      blitGrid(ctx, grid, P, S, faceRight, baseDx, baseDy, glowKeys);
      const orb = drawStaffOrb(ctx, P, S, faceRight, baseDx, baseDy, orbLift, pulse);

      // bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life += 1; b.x += b.dir * 0.9;
        const bx = b.x, by = orb.y + (b.y - (baseDy + 9)) + Math.sin(b.life / 3) * 0.4;
        ctx.save();
        ctx.shadowColor = P.orbGlow; ctx.shadowBlur = S * 3;
        // trailing sparks
        for (let tr = 0; tr < 5; tr++) {
          const tx = bx - b.dir * tr * 1.4;
          const al = 1 - tr / 5;
          ctx.globalAlpha = al;
          ctx.fillStyle = tr === 0 ? P.orbCore : P.orbGlow;
          const s2 = tr === 0 ? 2 : 1;
          ctx.fillRect(Math.round(tx * S), Math.round((by + (tr % 2 ? 0.5 : -0.5)) * S), S * s2, S * s2);
        }
        ctx.restore();
        if (bx > W + 2 || bx < -2) bolts.splice(i, 1);
      }
    };
    // rAF is throttled in some embedded/preview contexts; an interval driver
    // plus an immediate first paint guarantees a visible, animating sprite.
    frame(performance.now());
    const id = setInterval(() => frame(performance.now()), 1000 / 30);
    return () => clearInterval(id);
  }, [a, mode, scale, mono, facing, W, H]);

  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

// ── Duel: two wizards lobbing bolts that clash in the middle ──
export function PixelDuel({ left, right, scale = 5, style = {} }) {
  const ref = React.useRef(null);
  const GAP = 30; // logical cells between the two sprites
  const W = SPRITE_W * 2 + GAP;
  const H = SPRITE_H + 6;

  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = scale;
    cv.width = W * S * dpr; cv.height = H * S * dpr;
    cv.style.width = W * S + 'px'; cv.style.height = H * S + 'px';
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr); ctx.imageSmoothingEnabled = false;

    const PL = wizPalette(left, false);
    const PR = wizPalette(right, false);
    const grid = buildWizardGrid(); // geometry identical; palette differs at blit
    const glowKeys = { eye: 1, star: 1, orbCore: 1 };
    const lx = 2, rx = W - SPRITE_W - 2;
    const midX = W / 2;
    const t0 = performance.now();
    let boltL = null, boltR = null, clashT = 0;

    const frame = (now) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W * S, H * S);
      const bobL = Math.round(Math.sin(t / 540));
      const bobR = Math.round(Math.sin(t / 540 + 1.6));
      const pulse = 0.6 + 0.5 * Math.sin(t / 260);

      // bodies (left faces right, right faces left)
      blitGrid(ctx, grid, PL, S, true, lx, 4 + bobL, glowKeys);
      blitGrid(ctx, grid, PR, S, false, rx, 4 + bobR, glowKeys);
      const orbL = drawStaffOrb(ctx, PL, S, true, lx, 4 + bobL, 2, pulse);
      const orbR = drawStaffOrb(ctx, PR, S, false, rx, 4 + bobR, 2, pulse);

      const period = 2600;
      const ph = (t % period) / period;
      // launch both near the start of each cycle
      if (ph < 0.02) { boltL = { x: orbL.x + 2, y: orbL.y }; boltR = { x: orbR.x - 2, y: orbR.y }; clashT = 0; }
      const clashX = midX;
      if (boltL && boltR && clashT === 0) {
        boltL.x += 0.55; boltR.x -= 0.55;
        drawBolt(ctx, PL, S, boltL.x, orbL.y + (Math.sin(t / 3) * 0.4), 1);
        drawBolt(ctx, PR, S, boltR.x, orbR.y + (Math.sin(t / 3 + 1) * 0.4), -1);
        if (boltL.x >= clashX - 1) clashT = t;
      } else if (clashT) {
        // clash burst
        const age = (t - clashT);
        if (age < 520) {
          const rad = 2 + age / 60;
          ctx.save(); ctx.shadowColor = '#ffffff'; ctx.shadowBlur = S * 4;
          for (let k = 0; k < 14; k++) {
            const ang = (k / 14) * Math.PI * 2 + age / 120;
            const rr = rad * (0.6 + (k % 3) * 0.25);
            const px = midX + Math.cos(ang) * rr;
            const py = (orbL.y + orbR.y) / 2 + Math.sin(ang) * rr * 0.7;
            ctx.globalAlpha = Math.max(0, 1 - age / 520);
            ctx.fillStyle = k % 2 ? PL.bright : PR.bright;
            ctx.fillRect(Math.round(px * S), Math.round(py * S), S, S);
          }
          ctx.globalAlpha = Math.max(0, 1 - age / 300);
          ctx.fillStyle = '#fff';
          ctx.fillRect(Math.round((midX - 1) * S), Math.round(((orbL.y + orbR.y) / 2 - 1) * S), S * 2, S * 2);
          ctx.restore();
        }
      }
    };
    frame(performance.now());
    const id = setInterval(() => frame(performance.now()), 1000 / 30);
    return () => clearInterval(id);
  }, [left, right, scale, W, H]);

  return <canvas ref={ref} style={{ imageRendering: 'pixelated', display: 'block', ...style }} />;
}

function drawBolt(ctx, P, S, x, y, dir) {
  ctx.save(); ctx.shadowColor = P.orbGlow; ctx.shadowBlur = S * 3;
  for (let tr = 0; tr < 5; tr++) {
    const tx = x - dir * tr * 1.4; const al = 1 - tr / 5;
    ctx.globalAlpha = al; ctx.fillStyle = tr === 0 ? '#fff' : P.orbGlow;
    const s2 = tr === 0 ? 2 : 1;
    ctx.fillRect(Math.round(tx * S), Math.round((y + (tr % 2 ? 0.5 : -0.5)) * S), S * s2, S * s2);
  }
  ctx.restore();
}

export { SPRITE_W, SPRITE_H };
