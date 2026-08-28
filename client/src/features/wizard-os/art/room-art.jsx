// room-art.jsx — high-fidelity pixel-art wizard rooms.
// Three rooms: study (cozy), lab (creepy, with a vial cabinet of "spells"),
// garden (mushroom gnome village). Each room = { static(c,S,st), dynamic(c,t,S,st),
// hotspots, doors }. Static layer is drawn once to an offscreen buffer by
// pixel-room.jsx; dynamic layer (fire, glows, gnomes, fireflies) draws each frame.
//
// The toolkit emphasises multi-tone shading RAMPS, ordered DITHER between tones,
// soft contact shadows (AO), bevelled panels, surface noise, and colored
// atmospheric light pools.

export const ROOM_W = 248, ROOM_H = 152, FLOOR_Y = 104;

// ── ordered-dither matrix ───────────────────────────────────────
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bth = (x, y) => BAYER[(((x % 4) + 4) % 4) + (((y % 4) + 4) % 4) * 4];
const sr = (i) => { const x = Math.sin(i * 127.1 + 13.7) * 43758.5; return x - Math.floor(x); };

// ── colour ramps (dark → light) ─────────────────────────────────
export const RAMPS = {
  stoneCool: ['#0e0b16', '#171327', '#221c38', '#2f2749', '#3d345c', '#4d4470'],
  stoneWarm: ['#140f12', '#211820', '#2f222a', '#3e2f33', '#503e3c', '#645049'],
  mortar:    ['#0a0710', '#120d18'],
  woodDark:  ['#1c1108', '#2a1a0d', '#3a2614', '#4d341d', '#623f24'],
  wood:      ['#2a1a0d', '#3d2715', '#553720', '#6f4a2c', '#8a6038', '#a67a48'],
  iron:      ['#101218', '#1b1f27', '#2a303b', '#3c4450', '#545d6b', '#727b8a'],
  brass:     ['#3a2a10', '#5a4015', '#866020', '#b88a32', '#e0b34c', '#ffd877'],
  floor:     ['#160f0a', '#231811', '#33241a', '#442f20', '#573d29', '#6b4d34'],
  paper:     ['#6f6347', '#8d805d', '#a89a72', '#c6b88c', '#e0d3a6', '#f3ead0'],
  bone:      ['#7c7560', '#988f76', '#b4ab8e', '#d0c8aa', '#e8e1c6', '#f7f1dd'],
  cloth:     ['#3a1420', '#54202f', '#732e3f', '#974153', '#bd5a6b'],
  fire:      ['#5a1500', '#9c2c00', '#d44e00', '#ff7a14', '#ffb13e', '#ffe9a8'],
  ember:     ['#7a2400', '#c23a00', '#ff6a00', '#ffd166'],
  green:     ['#063b1c', '#0c7a37', '#1ec25a', '#2fe070', '#9dffc0'],
  violet:    ['#2a1056', '#5320a8', '#8a4ee6', '#a86bff', '#e0ccff'],
  cyan:      ['#06414f', '#0b6f86', '#1fb6d0', '#46c8ff', '#cdf3ff'],
  amber:     ['#5a3500', '#8a5200', '#cf8400', '#ffb000', '#ffe199'],
  red:       ['#54121f', '#8a1f2f', '#c23347', '#ff5470', '#ffb3c0'],
  sky:       ['#10122e', '#1b1e44', '#2a2f63', '#3f4685', '#5d63a8', '#8a7fb8'],
  grass:     ['#0c2417', '#123620', '#1b4a2b', '#266138', '#347a47', '#46945a'],
  capRed:    ['#5a0f17', '#8a1820', '#bd2630', '#e84150', '#ff6a78'],
  capSpot:   ['#cdbf9a', '#e6dcbf', '#f7f1dd'],
  stalk:     ['#5a4b34', '#7a6646', '#9c855e', '#c0a87a', '#e0cb9a'],
};

// ── pixel ops ───────────────────────────────────────────────────
export function makeD(c, S) {
  const P = (x, y, col) => { c.fillStyle = col; c.fillRect((x | 0) * S, (y | 0) * S, S, S); };
  const RECT = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect((x | 0) * S, (y | 0) * S, Math.round(w) * S, Math.round(h) * S); };
  const vgrad = (x, y, w, h, ramp, j = 0) => {
    x |= 0; y |= 0; w = Math.round(w); h = Math.round(h);
    const top = ramp.length - 1;
    for (let yy = 0; yy < h; yy++) {
      const f = h <= 1 ? 0 : yy / (h - 1);
      const tone = (1 - f) * top;
      const lo = Math.floor(tone), frac = tone - lo;
      for (let xx = 0; xx < w; xx++) {
        const t = bth(x + xx, y + yy + j);
        const idx = frac > t ? Math.min(top, lo + 1) : lo;
        c.fillStyle = ramp[idx];
        c.fillRect((x + xx) * S, (y + yy) * S, S, S);
      }
    }
  };
  const dither = (x, y, w, h, colA, colB, ratio) => {
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { c.fillStyle = ratio > bth(x + xx, y + yy) ? colB : colA; c.fillRect((x + xx | 0) * S, (y + yy | 0) * S, S, S); }
  };
  const panel = (x, y, w, h, ramp, hiI, loI, midI) => {
    midI = midI == null ? ramp.length - 3 : midI; hiI = hiI == null ? ramp.length - 1 : hiI; loI = loI == null ? 0 : loI;
    RECT(x, y, w, h, ramp[Math.max(0, midI)]);
    RECT(x, y, w, 1, ramp[hiI]); RECT(x, y, 1, h, ramp[hiI]);
    RECT(x, y + h - 1, w, 1, ramp[loI]); RECT(x + w - 1, y, 1, h, ramp[loI]);
  };
  const disc = (cx, cy, r, col) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + 0.4) P(cx + dx, cy + dy, col); };
  const discSh = (cx, cy, r, ramp, lx = -0.5, ly = -0.6) => {
    const top = ramp.length - 1;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const d = dx * dx + dy * dy; if (d > r * r + 0.4) continue; const n = (dx * lx + dy * ly) / r; let tone = (0.5 + n * 0.7); tone = Math.max(0, Math.min(1, tone)) * top; const lo = Math.floor(tone), frac = tone - lo; const idx = frac > bth(cx + dx, cy + dy) ? Math.min(top, lo + 1) : lo; P(cx + dx, cy + dy, ramp[idx]); }
  };
  const ring = (cx, cy, rx, ry, col, step = 0.16) => { for (let a = 0; a < Math.PI * 2; a += step) P(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, col); };
  const line = (x0, y0, x1, y1, col, w = 1) => { x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0; const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx - dy; c.fillStyle = col; for (;;) { c.fillRect(x0 * S, y0 * S, S * w, S * w); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 > -dy) { e -= dy; x0 += sx; } if (e2 < dx) { e += dx; y0 += sy; } } };
  const ao = (cx, cy, rx, ry, strength = 0.5) => { for (let dy = -ry; dy <= ry; dy++) for (let dx = -rx; dx <= rx; dx++) { const d = (dx / rx) ** 2 + (dy / ry) ** 2; if (d > 1) continue; const a = (1 - d) * strength; if (a > bth(cx + dx, cy + dy)) P(cx + dx, cy + dy, '#05040a'); } };
  const noise = (x, y, w, h, ramp, density, seed = 0) => { for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const r = sr((x + xx) * 7 + (y + yy) * 31 + seed); if (r < density) P(x + xx, y + yy, ramp[Math.floor(sr(r * 99) * ramp.length)]); } };
  return { P, RECT, vgrad, dither, panel, disc, discSh, ring, line, ao, noise, c, S };
}

// additive colored light pool (call during dynamic pass)
function lightPool(c, S, cx, cy, r, col, alpha) {
  c.save(); c.globalCompositeOperation = 'lighter';
  const g = c.createRadialGradient(cx * S, cy * S, 0, cx * S, cy * S, r * S);
  g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.globalAlpha = alpha; c.fillStyle = g; c.fillRect((cx - r) * S, (cy - r) * S, r * 2 * S, r * 2 * S);
  c.restore();
}
function glowPx(c, S, x, y, w, h, col, g, b) { c.save(); c.shadowColor = g; c.shadowBlur = S * b; c.fillStyle = col; c.fillRect((x | 0) * S, (y | 0) * S, Math.round(w) * S, Math.round(h) * S); c.restore(); }
function vignette(c, S, strength = 0.62) {
  const g = c.createRadialGradient(ROOM_W * S / 2, ROOM_H * S * 0.42, ROOM_H * S * 0.18, ROOM_W * S / 2, ROOM_H * S / 2, ROOM_W * S * 0.66);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(2,1,6,${strength})`);
  c.fillStyle = g; c.fillRect(0, 0, ROOM_W * S, ROOM_H * S);
}

// ── shared static structure ─────────────────────────────────────
function brickWall(D, S, ramp) {
  const { vgrad, RECT, ao, noise } = D;
  vgrad(0, 0, ROOM_W, FLOOR_Y, ramp);
  for (let y = 0; y < FLOOR_Y; y += 7) {
    RECT(0, y, ROOM_W, 1, RAMPS.mortar[0]);
    const off = ((y / 7) % 2) ? 0 : 9;
    for (let x = -off; x < ROOM_W; x += 18) {
      RECT(x + 16, y, 1, 7, RAMPS.mortar[0]);
      const v = sr(x * 3 + y);
      if (v > 0.62) D.dither(x, y + 1, 16, 5, ramp[Math.floor(2 + v * 2)], ramp[1], 0.4);
      RECT(x, y + 1, 16, 1, ramp[Math.min(ramp.length - 1, 4)]);
      RECT(x, y + 5, 16, 1, ramp[1]);
    }
  }
  noise(0, 0, ROOM_W, FLOOR_Y, [ramp[0], ramp[1]], 0.04, 5);
  ao(0, 0, 40, 30, 0.6); ao(ROOM_W, 0, 40, 30, 0.6);
  RECT(0, FLOOR_Y - 2, ROOM_W, 2, ramp[0]);
}
function woodFloor(D, S, ramp) {
  const { vgrad, RECT, noise, ao } = D;
  vgrad(0, FLOOR_Y, ROOM_W, ROOM_H - FLOOR_Y, ramp, 2);
  RECT(0, FLOOR_Y, ROOM_W, 1, ramp[ramp.length - 1]);
  let y = FLOOR_Y + 2, gap = 4;
  const seams = [];
  while (y < ROOM_H) { seams.push(y); RECT(0, y, ROOM_W, 1, ramp[0]); RECT(0, y + 1, ROOM_W, 1, ramp[2]); y += gap; gap += 1; }
  seams.forEach((sy, r) => { for (let x = (r % 2) * 14; x < ROOM_W; x += 26) RECT(x, sy, 1, gap, ramp[1]); });
  noise(0, FLOOR_Y, ROOM_W, ROOM_H - FLOOR_Y, [ramp[1], ramp[2], ramp[4]], 0.06, 9);
  ao(ROOM_W / 2, FLOOR_Y + 1, ROOM_W, 4, 0.5);
}

// ── DOORS ───────────────────────────────────────────────────────
// A clearly-lit arched doorway with a warm glow spilling from the room beyond,
// so it reads as a way out even before you hover it.
function doorway(D, S, x, w, glowRamp) {
  const { RECT, P, panel } = D; const top = 26, bot = FLOOR_Y;
  panel(x - 7, top - 10, w + 14, bot - top + 10, RAMPS.stoneCool, 5, 0, 3);
  panel(x - 3, top - 6, w + 6, bot - top + 6, RAMPS.stoneCool, 3, 0, 1);
  D.noise(x - 6, top - 9, w + 12, 6, [RAMPS.stoneCool[1], RAMPS.stoneCool[3]], 0.06, 7);
  RECT(x, top, w, bot - top, '#06040c');
  for (let i = 0; i <= w; i++) { const yy = top - Math.round(Math.sin((i / w) * Math.PI) * 10); RECT(x + i, yy, 1, top - yy + 1, '#06040c'); P(x + i, yy - 1, RAMPS.stoneCool[4]); P(x + i, yy, RAMPS.stoneCool[2]); }
  RECT(x + w / 2 - 2, top - 11, 4, 4, RAMPS.stoneCool[4]); P(x + w / 2 - 1, top - 10, RAMPS.stoneCool[5]);
  for (let yy = top; yy < bot; yy++) { const f = (yy - top) / (bot - top); D.c.save(); D.c.globalAlpha = 0.06 + f * 0.22; D.c.fillStyle = glowRamp[3]; D.c.fillRect(x * S, yy * S, w * S, S); D.c.restore(); }
  RECT(x - 4, bot - 1, w + 8, 2, RAMPS.stoneCool[2]); RECT(x - 2, bot + 1, w + 4, 1, RAMPS.stoneCool[1]);
  D.c.save(); D.c.globalAlpha = 0.16; D.c.fillStyle = glowRamp[3]; D.c.fillRect((x - 10) * S, bot * S, (w + 20) * S, 12 * S); D.c.restore();
  const lx = x + w / 2; RECT(lx, top - 5, 1, 4, RAMPS.iron[2]); panel(lx - 2, top - 1, 5, 5, RAMPS.iron, 4, 0, 1); RECT(lx - 1, top, 3, 3, glowRamp[1]);
}
function doorBeacon(c, S, x, w, ramp, t, dir) {
  const lx = x + w / 2, top = 26;
  lightPool(c, S, lx, FLOOR_Y - 8, 30, ramp[3], 0.32 + 0.1 * Math.sin(t / 520));
  const fl = Math.sin(t / 120) > 0 ? 0 : 1; glowPx(c, S, lx, top + 1 - fl, 1, 1 + fl, ramp[4], ramp[3], 3);
  const bob = Math.round(Math.sin(t / 420) * 1.5);
  c.save(); c.globalAlpha = 0.45 + 0.3 * Math.sin(t / 420);
  for (let k = 0; k < 3; k++) glowPx(c, S, lx + dir * (k - 1), FLOOR_Y - 30 + bob - k, 1, 2 * k + 1, ramp[4], ramp[3], 2);
  c.restore();
}
// a cosy round wooden door in a mossy stone arch — the way back inside (garden)
function towerDoor(D, S, x) {
  const { RECT, P, panel, disc, noise } = D; const top = 44, bot = G_GROUND + 18, w = 30;
  panel(x - 8, 18, w + 16, bot - 18 + 6, RAMPS.stoneCool, 5, 0, 2);
  noise(x - 8, 18, w + 16, bot - 18, [RAMPS.stoneCool[1], RAMPS.stoneCool[3]], 0.05, 6);
  for (let i = 0; i < 26; i++) { const mx = x - 6 + sr(i) * (w + 12), my = 22 + sr(i + 4) * (bot - 24); P(mx, my, RAMPS.grass[Math.floor(2 + sr(i) * 3)]); }
  RECT(x, top, w, bot - top, '#0a0712');
  for (let i = 0; i <= w; i++) { const yy = top - Math.round(Math.sin((i / w) * Math.PI) * 11); RECT(x + i, yy, 1, top - yy + 1, '#0a0712'); P(x + i, yy - 1, RAMPS.stoneWarm[4]); }
  const dY = top + 4; panel(x + 3, dY, w - 6, bot - dY, RAMPS.wood, 5, 0, 2);
  for (let i = 0; i <= w - 6; i++) { const yy = dY - Math.round(Math.sin((i / (w - 6)) * Math.PI) * 8); for (let k = yy; k < dY; k++) P(x + 3 + i, k, RAMPS.wood[3 + (i % 2)]); }
  RECT(x + 3, dY, 1, bot - dY, RAMPS.woodDark[1]); for (let p = 0; p < 3; p++) RECT(x + 6 + p * 7, dY, 1, bot - dY - 4, RAMPS.woodDark[2]);
  disc(x + w - 9, dY + 14, 1, RAMPS.brass[4]);
  D.c.save(); D.c.globalAlpha = 0.5; glowPx(D.c, S, x + w / 2, dY + 2, 2, bot - dY - 4, RAMPS.amber[3], RAMPS.amber[3], 2); D.c.restore();
  D.c.save(); D.c.globalAlpha = 0.16; D.c.fillStyle = RAMPS.amber[3]; D.c.fillRect((x - 6) * S, bot * S, (w + 12) * S, 10 * S); D.c.restore();
  RECT(x - 4, top - 2, 1, 5, RAMPS.iron[2]); panel(x - 6, top + 3, 5, 5, RAMPS.iron, 4, 0, 1); RECT(x - 5, top + 4, 3, 3, RAMPS.amber[2]);
  RECT(x + 2, bot, w - 4, 2, RAMPS.cloth[2]); RECT(x + 4, bot, w - 8, 1, RAMPS.cloth[3]);
  RECT(x + w + 4, bot - 14, 1, 16, RAMPS.woodDark[1]); panel(x + w + 1, bot - 20, 9, 6, RAMPS.wood, 5, 1, 3); RECT(x + w + 3, bot - 18, 5, 1, RAMPS.woodDark[2]); RECT(x + w + 3, bot - 16, 4, 1, RAMPS.woodDark[2]);
}

// ════════════════════════════════════════════════════════════════
//  STUDY
// ════════════════════════════════════════════════════════════════
function studyStatic(c, S) {
  const D = makeD(c, S); const { RECT, P, panel, vgrad, disc, discSh, ao, line, noise, dither } = D;
  brickWall(D, S, RAMPS.stoneWarm);
  // arched window with moon + stars + mullions
  const wx = 92, wy = 12, ww = 40, wh = 40;
  panel(wx - 4, wy - 4, ww + 8, wh + 8, RAMPS.wood, 5, 1, 3);
  vgrad(wx, wy, ww, wh, RAMPS.sky);
  for (let i = 0; i < 18; i++) { const sx = wx + 3 + sr(i) * (ww - 6), sy = wy + 3 + sr(i + 7) * (wh - 8); P(sx, sy, i % 4 ? '#9fb0d6' : '#e6ecff'); }
  discSh(wx + 27, wy + 12, 6, RAMPS.bone, -0.5, -0.5); disc(wx + 24, wy + 9, 4, RAMPS.sky[1]);
  RECT(wx + ww / 2 - 0.5, wy, 1, wh, RAMPS.woodDark[2]); RECT(wx, wy + wh / 2 - 0.5, ww, 1, RAMPS.woodDark[2]);
  RECT(wx - 4, wy + wh + 3, ww + 8, 2, RAMPS.wood[4]);
  // bookshelf
  const bx = 150, by = 14, bw = 44, bh = 90;
  panel(bx, by, bw, bh, RAMPS.woodDark, 4, 0, 2);
  RECT(bx + 2, by + 2, bw - 4, bh - 4, RAMPS.woodDark[0]);
  for (let r = 0; r < 5; r++) {
    const sy = by + 4 + r * 17; RECT(bx + 2, sy + 14, bw - 4, 2, RAMPS.wood[3]); RECT(bx + 2, sy + 14, bw - 4, 1, RAMPS.wood[5]);
    let x = bx + 4;
    while (x < bx + bw - 6) { const bwid = 2 + Math.floor(sr(r * 9 + x) * 3); const lean = sr(x + r) > 0.85 ? 3 : 0; const ramp = [RAMPS.green, RAMPS.violet, RAMPS.red, RAMPS.amber, RAMPS.cyan, RAMPS.wood][Math.floor(sr(x * 2 + r) * 6)]; const h = 13 - lean; panel(x, sy + 2 + lean, bwid, h, ramp, ramp.length - 1, 0, 2); P(x + 1, sy + 4 + lean, ramp[ramp.length - 1]); x += bwid + 1; }
  }
  discSh(bx + 10, by + 50, 3, RAMPS.bone); RECT(bx + 8, by + 51, 5, 3, RAMPS.bone[2]); P(bx + 9, by + 51, '#0a0608'); P(bx + 11, by + 51, '#0a0608');
  // fireplace
  const fx = 6, fy = 30;
  panel(fx, fy, 50, FLOOR_Y - fy, RAMPS.stoneCool, 4, 0, 2);
  RECT(fx + 6, fy + 8, 38, FLOOR_Y - fy - 8, '#070406');
  for (let i = 0; i <= 38; i++) { const yy = fy + 8 - Math.round(Math.sin((i / 38) * Math.PI) * 5); RECT(fx + 6 + i, yy, 1, fy + 8 - yy, '#070406'); }
  panel(fx - 2, fy - 6, 54, 6, RAMPS.wood, 5, 1, 3);
  noise(fx, fy, 50, FLOOR_Y - fy, [RAMPS.stoneCool[0], RAMPS.stoneCool[2]], 0.05, 3);
  for (let i = 0; i < 3; i++) discSh(fx + 16 + i * 7, FLOOR_Y - 8, 3, RAMPS.woodDark);
  RECT(fx - 2, FLOOR_Y - 2, 54, 4, RAMPS.stoneCool[1]);
  woodFloor(D, S, RAMPS.floor);
  // rug
  const rx = 78, ry = 116;
  for (let i = 0; i < 5; i++) { const ramp = [RAMPS.cloth, RAMPS.amber][i % 2]; RECT(rx + i * 4, ry + i * 2, 96 - i * 8, 26 - i * 4, ramp[Math.min(ramp.length - 1, 1 + i)]); }
  dither(rx + 8, ry + 6, 80, 14, RAMPS.amber[2], RAMPS.cloth[3], 0.5);
  for (let x = rx + 6; x < rx + 90; x += 6) line(x, ry + 4, x, ry + 22, RAMPS.amber[1]);
  // desk
  const dx = 86, dy = 86;
  ao(dx + 30, dy + 30, 44, 8, 0.55);
  panel(dx, dy, 60, 5, RAMPS.wood, 5, 1, 4);
  RECT(dx + 3, dy + 5, 5, 22, RAMPS.woodDark[1]); RECT(dx + 52, dy + 5, 5, 22, RAMPS.woodDark[1]);
  RECT(dx + 3, dy + 14, 54, 4, RAMPS.woodDark[2]);
  for (let i = 0; i < 3; i++) { RECT(dx + 6 + i, dy - 5 - i, 16, 6, RAMPS.paper[4 - i]); P(dx + 9, dy - 4, RAMPS.paper[1]); P(dx + 13, dy - 3, RAMPS.paper[1]); }
  RECT(dx + 46, dy - 6, 5, 6, RAMPS.iron[1]); P(dx + 48, dy - 7, RAMPS.violet[3]); line(dx + 49, dy - 13, dx + 50, dy - 7, RAMPS.bone[3]);
  panel(dx + 26, dy - 4, 14, 4, RAMPS.red, 4, 0, 2); panel(dx + 28, dy - 8, 12, 4, RAMPS.cyan, 4, 0, 2);
  doorway(D, S, 206, 28, RAMPS.green);
  vignette(c, S, 0.5);
}
function studyDynamic(c, t, S) {
  const D = makeD(c, S); const { P, RECT } = D;
  const fx = 6, fy = 30;
  const baseY = FLOOR_Y - 8;
  for (let i = 0; i < 16; i++) { const fxx = fx + 12 + i * 1.7; const flick = sr(i + Math.floor(t / 90)); const h = 9 + Math.round(Math.abs(Math.sin(t / 150 + i)) * 7) - Math.abs(i - 8) - (flick > 0.6 ? 3 : 0); for (let k = 0; k < h; k++) { const tone = k / h; const col = tone > 0.7 ? RAMPS.fire[5] : tone > 0.4 ? RAMPS.fire[3] : RAMPS.fire[1]; P(fxx, baseY - k, col); } }
  glowPx(c, S, fx + 18, baseY - 3, 12, 3, RAMPS.fire[4], RAMPS.ember[2], 4);
  for (let i = 0; i < 8; i++) { const ph = ((t / 30 + i * 50) % 120) / 120; c.globalAlpha = 1 - ph; P(fx + 16 + sr(i) * 18 + Math.sin(t / 200 + i) * 2, baseY - ph * 30, RAMPS.fire[4]); c.globalAlpha = 1; }
  lightPool(c, S, fx + 24, baseY - 6, 46, 'rgba(255,140,40,0.5)', 0.5 + 0.08 * Math.sin(t / 160));
  candleFlame(c, S, fx + 4, fy - 6, t, 1); candleFlame(c, S, fx + 44, fy - 6, t, 3);
  const dx = 86, dy = 86;
  candleFlame(c, S, dx + 50, dy - 6, t, 2);
  RECT(dx + 24, dy - 5, 20, 5, RAMPS.woodDark[1]);
  RECT(dx + 24, dy - 6, 9, 6, RAMPS.paper[4]); RECT(dx + 34, dy - 6, 9, 6, RAMPS.paper[4]); RECT(dx + 33, dy - 7, 1, 7, RAMPS.woodDark[2]);
  const cyc = (t / 2400) % 1, lines = Math.floor(cyc * 6);
  c.save(); c.shadowColor = RAMPS.green[3]; c.shadowBlur = S * 1.5;
  for (let r = 0; r < Math.min(3, lines); r++) RECT(dx + 26, dy - 4 + r, 5 + ((r * 4) % 4), 0.6, RAMPS.green[3]);
  for (let r = 0; r < Math.min(3, Math.max(0, lines - 3)); r++) RECT(dx + 36, dy - 4 + r, 5 + ((r * 5) % 4), 0.6, RAMPS.green[3]);
  c.restore();
  const gp = (t / 40) % 26; c.globalAlpha = 1 - gp / 26; P(dx + 34 + Math.sin(t / 200) * 3, dy - 7 - gp * 0.5, RAMPS.green[4]); c.globalAlpha = 1;
  lightPool(c, S, dx + 34, dy - 4, 22, 'rgba(40,230,110,0.45)', 0.4 + 0.08 * Math.sin(t / 300));
  catSleep(c, S, 58, 132, t);
  doorBeacon(c, S, 206, 28, RAMPS.green, t, 1);
  for (let i = 0; i < 14; i++) { const x = (sr(i) * ROOM_W + t / (50 + i)) % ROOM_W; const y = 30 + sr(i + 3) * 60 + Math.sin(t / 600 + i) * 4; c.globalAlpha = 0.12 + 0.12 * Math.sin(t / 400 + i); P(x, y, '#ffcaa0'); } c.globalAlpha = 1;
  vignette(c, S, 0.28);
}

// ════════════════════════════════════════════════════════════════
//  LABORATORY — with the spell-vial cabinet
// ════════════════════════════════════════════════════════════════
const CAB = { x: 48, y: 30, w: 58, h: 72, cols: 3, rows: 4 };
const CAB_VIALS = [
  ['summon', 'green', 'SUMMON'], ['fireball', 'fire', 'FIREBALL'], ['lightning', 'cyan', 'LIGHTNING'],
  ['cauldron', 'green', 'BREW'], ['crystalBall', 'violet', 'SCRY'], ['portal', 'violet', 'PORTAL'],
  ['owl', 'amber', 'FAMILIAR'], ['levitate', 'green', 'LEVITATE'], ['enchant', 'ice', 'ENCHANT'],
  ['ward', 'green', 'WARD'], ['teleport', 'violet', 'BLINK'], ['coffee', 'amber', 'DEV FUEL'],
];
export function vialSlots() {
  const slots = []; const padX = 8, padTop = 8, cw = (CAB.w - padX * 2) / CAB.cols, ch = (CAB.h - padTop - 6) / CAB.rows;
  for (let r = 0; r < CAB.rows; r++) for (let cI = 0; cI < CAB.cols; cI++) {
    const i = r * CAB.cols + cI; if (i >= CAB_VIALS.length) continue;
    slots.push({ i, scene: CAB_VIALS[i][0], pal: CAB_VIALS[i][1], label: CAB_VIALS[i][2], cx: CAB.x + padX + cw * cI + cw / 2, cy: CAB.y + padTop + ch * r + ch / 2, w: cw, h: ch });
  }
  return slots;
}
export function vialPalette(key) {
  const map = { green: RAMPS.green, violet: RAMPS.violet, cyan: RAMPS.cyan, amber: RAMPS.amber, fire: RAMPS.fire, ice: RAMPS.cyan, red: RAMPS.red };
  return map[key] || RAMPS.green;
}

function labStatic(c, S, st) {
  const D = makeD(c, S); const { RECT, P, panel, disc, discSh, dither } = D;
  brickWall(D, S, RAMPS.stoneCool);
  for (let i = 0; i < 5; i++) { const x = 30 + i * 44 + sr(i) * 10; dither(x, 2, 2, 20 + sr(i + 2) * 30, RAMPS.stoneCool[0], RAMPS.green[0], 0.4); }
  for (let i = 0; i < 5; i++) { const hx = 96 + i * 9; RECT(hx, 0, 1, 5 + (i % 2) * 4, RAMPS.woodDark[1]); const ramp = i % 2 ? RAMPS.grass : RAMPS.green; panel(hx - 1, 5 + (i % 2) * 4, 3, 6, ramp, ramp.length - 1, 0, 1); }
  RECT(150, 0, 1, 6, RAMPS.iron[0]); disc(150, 8, 2, '#0d0a14'); P(149, 7, '#0d0a14'); P(151, 7, '#0d0a14');
  const shx = 116, shy = 30;
  panel(shx, shy, 52, 3, RAMPS.wood, 5, 1, 3);
  for (let i = 0; i < 6; i++) { const x = shx + 3 + i * 7; const ramp = [RAMPS.green, RAMPS.violet, RAMPS.red, RAMPS.cyan, RAMPS.amber][i % 5]; bottle(D, x, shy, 4, 9, ramp); }
  const skx = shx + 47; discSh(skx, shy - 6, 4, RAMPS.bone); RECT(skx - 3, shy - 4, 7, 5, RAMPS.bone[3]); RECT(skx - 2, shy + 1, 6, 2, RAMPS.bone[2]);
  RECT(skx - 2, shy - 5, 2, 2, '#0a0608'); RECT(skx + 1, shy - 5, 2, 2, '#0a0608');
  woodFloor(D, S, RAMPS.floor);
  alchemyStatic(D, 140, 86);
  doorway(D, S, 4, 26, RAMPS.amber);
  doorway(D, S, 212, 26, RAMPS.cyan);
  cabinet(D, S, st && st.cabinet);
  vignette(c, S, 0.55);
}
function labDynamic(c, t, S, st) {
  const D = makeD(c, S); const { P, RECT } = D;
  alchemyDynamic(D, c, S, 140, 86, t);
  const shx = 116, shy = 30;
  for (let i = 0; i < 6; i++) { const x = shx + 3 + i * 7; const ramp = [RAMPS.green, RAMPS.violet, RAMPS.red, RAMPS.cyan, RAMPS.amber][i % 5]; if (Math.sin(t / 400 + i) > 0.5) glowPx(c, S, x + 1, shy - 5, 2, 4, ramp[3], ramp[3], 2); }
  const skx = shx + 47; const sm = Math.sin(t / 1300) > 0; glowPx(c, S, skx - 2, shy - 5, 2, 2, sm ? RAMPS.green[3] : RAMPS.green[0], RAMPS.green[3], sm ? 3 : 1); glowPx(c, S, skx + 1, shy - 5, 2, 2, sm ? RAMPS.green[3] : RAMPS.green[0], RAMPS.green[3], sm ? 3 : 1);
  const bf = Math.sin(t / 160) > 0 ? 0 : 1; RECT(147, 8 + bf, 2, 1, '#0d0a14'); RECT(151, 8 + bf, 2, 1, '#0d0a14');
  shadowCorner(c, S, t);
  doorBeacon(c, S, 4, 26, RAMPS.amber, t, -1);
  doorBeacon(c, S, 212, 26, RAMPS.cyan, t, 1);
  if (st && st.cabinet) vialsDynamic(c, S, t);
  for (let i = 0; i < 16; i++) { const x = (sr(i) * ROOM_W + t / (60 + i)) % ROOM_W; const y = 24 + sr(i + 3) * 70 + Math.sin(t / 500 + i) * 4; c.globalAlpha = 0.14 + 0.14 * Math.sin(t / 400 + i); P(x, y, '#9affc8'); } c.globalAlpha = 1;
  vignette(c, S, 0.3);
}

function bottle(D, x, y, w, h, ramp) {
  const { RECT, P } = D;
  RECT(x, y - h, w, h, ramp[0]);
  RECT(x, y - h + 2, w, h - 2, ramp[1]);
  RECT(x, y - Math.floor(h * 0.5), w, Math.floor(h * 0.5), ramp[2]);
  P(x, y - h + 1, ramp[4]);
  RECT(x + 1, y - h - 2, w - 2, 2, RAMPS.wood[3]);
}
function cabinet(D, S, open) {
  const { RECT, panel, ao } = D;
  const { x, y, w, h } = CAB;
  ao(x + w / 2, y + h, w / 2 + 4, 8, 0.6);
  panel(x - 4, y - 4, w + 8, h + 8, RAMPS.woodDark, 4, 0, 2);
  RECT(x, y, w, h, '#0a0608');
  if (open) {
    const slots = vialSlots();
    const shelfYs = [...new Set(slots.map((s) => Math.round(s.cy + s.h / 2 - 1)))];
    shelfYs.forEach((sy) => { RECT(x + 1, sy, w - 2, 2, RAMPS.wood[2]); RECT(x + 1, sy, w - 2, 1, RAMPS.wood[4]); });
    D.c.save(); D.c.globalAlpha = 0.12; D.c.fillStyle = '#1ec25a'; D.c.fillRect(x * S, y * S, w * S, h * S); D.c.restore();
    slots.forEach((s) => { const ramp = vialPalette(s.pal); drawVial(D, s.cx, Math.round(s.cy + s.h / 2 - 2), ramp); });
    panel(x - 13, y - 4, 9, h + 8, RAMPS.woodDark, 4, 0, 2); panel(x + w + 4, y - 4, 9, h + 8, RAMPS.woodDark, 4, 0, 2);
    for (const dy2 of [y + 6, y + h - 6]) { RECT(x - 12, dy2, 3, 3, RAMPS.iron[4]); RECT(x + w + 9, dy2, 3, 3, RAMPS.iron[4]); }
  } else {
    for (const side of [0, 1]) { const dx = x + side * (w / 2); panel(dx, y, w / 2, h, RAMPS.wood, 5, 1, 3); RECT(dx + 3, y + 3, w / 2 - 6, h - 6, RAMPS.woodDark[2]); RECT(dx + 4, y + 4, w / 2 - 8, h - 8, RAMPS.wood[2]); D.noise(dx + 4, y + 4, w / 2 - 8, h - 8, [RAMPS.wood[1], RAMPS.wood[3]], 0.05, side + 2); }
    const mid = x + w / 2; RECT(mid - 2, y + h / 2 - 4, 2, 8, RAMPS.iron[4]); RECT(mid, y + h / 2 - 4, 2, 8, RAMPS.iron[4]);
    for (const dy2 of [y + 8, y + h - 8]) { RECT(x + 1, dy2, 3, 2, RAMPS.iron[3]); RECT(x + w - 4, dy2, 3, 2, RAMPS.iron[3]); }
    D.c.save(); D.c.globalAlpha = 0.5; glowPx(D.c, S, mid - 0.5, y + 6, 1, h - 12, RAMPS.green[2], RAMPS.green[3], 1.4); D.c.restore();
  }
}
function drawVial(D, cx, baseY, ramp) {
  const { RECT, P } = D; const h = 11, w = 5;
  RECT(cx - w / 2 + 0.5, baseY - h, w, h, ramp[0]);
  RECT(cx - w / 2 + 0.5, baseY - h, w, 1, RAMPS.iron[2]); P(cx, baseY - h - 1, RAMPS.wood[3]);
  const lh = h - 3; RECT(cx - w / 2 + 0.5, baseY - lh, w, lh, ramp[1]); RECT(cx - w / 2 + 0.5, baseY - lh, w, 1, ramp[3]);
  P(cx - w / 2 + 0.5, baseY - lh + 1, ramp[4]);
  glowPx(D.c, D.S, cx - w / 2 + 0.5, baseY - lh, w, lh, ramp[1], ramp[3], 1.6);
}
function vialsDynamic(c, S, t) {
  const slots = vialSlots();
  slots.forEach((s, k) => { const ramp = vialPalette(s.pal); const baseY = Math.round(s.cy + s.h / 2 - 2);
    const ph = ((t / 26 + k * 30) % 70) / 70; c.save(); c.shadowColor = ramp[3]; c.shadowBlur = S * 2; c.globalAlpha = 1 - ph; c.fillStyle = ramp[4]; c.fillRect(Math.round(s.cx) * S, Math.round(baseY - 8 - ph * 4) * S, S, S); c.restore(); });
}
function alchemyStatic(D, cx, base) {
  const { RECT, panel, ao, discSh, line } = D;
  ao(cx, base + 6, 28, 7, 0.55);
  panel(cx - 26, base, 52, 5, RAMPS.stoneCool, 4, 0, 2);
  RECT(cx - 24, base + 5, 6, 14, RAMPS.iron[1]); RECT(cx + 18, base + 5, 6, 14, RAMPS.iron[1]);
  discSh(cx - 12, base - 5, 9, RAMPS.iron, -0.5, -0.6);
  RECT(cx - 21, base - 8, 18, 4, RAMPS.iron[1]); RECT(cx - 21, base - 8, 18, 1, RAMPS.iron[4]);
  RECT(cx - 22, base - 6, 1, 2, RAMPS.iron[3]); RECT(cx - 3, base - 6, 1, 2, RAMPS.iron[3]);
  RECT(cx + 8, base - 5, 4, 5, RAMPS.cyan[0]); discSh(cx + 10, base - 8, 3, RAMPS.cyan, -0.4, -0.5);
  RECT(cx + 12, base - 7, 6, 1, RAMPS.iron[4]); RECT(cx + 18, base - 12, 1, 7, RAMPS.iron[4]);
  RECT(cx + 15, base - 5, 6, 5, RAMPS.violet[0]); RECT(cx + 15, base - 3, 6, 3, RAMPS.violet[1]);
  line(cx - 2, base - 1, cx + 4, base - 1, RAMPS.iron[3]);
}
function alchemyDynamic(D, c, S, cx, base, t) {
  const { P, RECT } = D;
  RECT(cx - 19, base - 9, 14, 2, RAMPS.green[1]); glowPx(c, S, cx - 19, base - 9, 14, 1, RAMPS.green[3], RAMPS.green[3], 3);
  for (let i = 0; i < 6; i++) { const ph = ((t / 24 + i * 40) % 64) / 64; const bx = cx - 17 + ((i * 4) % 13); glowPx(c, S, bx, base - 9 - ph * 3, 1 + (ph < 0.3 ? 1 : 0), 1, RAMPS.green[4], RAMPS.green[3], 2); }
  c.globalAlpha = 0.4; for (let i = 0; i < 5; i++) { const ph = ((t / 16 + i * 50) % 90) / 90; P(cx - 12 + Math.sin(ph * 6 + i) * 5, base - 12 - ph * 16, '#9affc8'); } c.globalAlpha = 1;
  for (let i = 0; i < 8; i++) { const fl = sr(i + Math.floor(t / 110)); P(cx - 18 + i * 1.8, base + 1 + (fl > 0.5 ? 0 : 1), i % 2 ? RAMPS.violet[3] : RAMPS.cyan[3]); }
  lightPool(c, S, cx - 12, base - 9, 40, 'rgba(40,230,110,0.45)', 0.45 + 0.08 * Math.sin(t / 200));
  glowPx(c, S, cx + 9, base - 9, 3, 3, RAMPS.cyan[3], RAMPS.cyan[3], 2);
  const dp = Math.floor(t / 360) % 3; P(cx + 18, base - 5 + dp, RAMPS.violet[3]);
  glowPx(c, S, cx + 15, base - 5, 6, 1, RAMPS.violet[3], RAMPS.violet[3], 2);
}
function shadowCorner(c, S, t) {
  const D = makeD(c, S); const { RECT } = D;
  c.save(); c.globalAlpha = 0.6; c.fillStyle = '#04030a'; c.fillRect(170 * S, 22 * S, 34 * S, (FLOOR_Y - 8) * S); c.restore();
  c.save(); c.globalAlpha = 0.4; for (let i = 1; i <= 4; i++) D.line(170, 22, 170 + i * 8, 22 + i * 4, '#3a3548'); c.restore();
  const ex = 184 + Math.sin(t / 1300) * 4, ey = 54 + Math.sin(t / 1700) * 3; const blink = Math.sin(t / 1500) > -0.12; const col = Math.sin(t / 3000) > 0 ? RAMPS.red[3] : RAMPS.violet[3];
  if (blink) { glowPx(c, S, ex, ey, 2, 1, col, col, 4); glowPx(c, S, ex + 6, ey, 2, 1, col, col, 4); }
  c.save(); c.globalAlpha = 0.5 + 0.2 * Math.sin(t / 600); for (let i = 0; i < 4; i++) RECT(196 + i * 2, 72 - (i % 2), 1, 7 + (i % 2) * 2, '#0d0a14'); c.restore();
}

// shared little animated props ------------------------------------
function candleFlame(c, S, x, y, t, seed) {
  const D = makeD(c, S); const { RECT, P } = D;
  RECT(x, y - 1, 2, 5, RAMPS.bone[3]); RECT(x, y - 1, 1, 5, RAMPS.bone[5]);
  const fl = Math.sin(t / 110 + seed) > 0 ? 0 : 1;
  glowPx(c, S, x, y - 3 - fl, 2, 2 + fl, RAMPS.fire[4], RAMPS.ember[2], 3); P(x, y - 4 - fl, '#fff7df');
  lightPool(c, S, x + 0.5, y - 3, 14, 'rgba(255,170,60,0.35)', 0.4);
}
function catSleep(c, S, cx, by, t) {
  const D = makeD(c, S); const { P, discSh, line } = D;
  const breathe = Math.sin(t / 760) > 0 ? 0 : 1;
  D.ao(cx + 2, by + 3, 12, 3, 0.5);
  discSh(cx, by - 2 + breathe, 7, ['#17121c', '#241a26', '#332840', '#43354f', '#564364'], -0.5, -0.7);
  discSh(cx - 9, by - 4, 4, ['#17121c', '#241a26', '#332840', '#43354f', '#564364'], -0.4, -0.5);
  P(cx - 12, by - 7, '#241a26'); P(cx - 6, by - 7, '#241a26');
  P(cx - 10, by - 4, Math.sin(t / 900) > -0.3 ? '#0a0608' : RAMPS.green[3]);
  const tf = Math.sin(t / 480) * 3; line(cx + 6, by, cx + 11, by - 4 + tf, '#332840'); P(cx + 11, by - 4 + tf, '#43354f');
  const zp = (t / 46) % 34; c.globalAlpha = 1 - zp / 34; P(cx - 7 + zp * 0.22, by - 12 - zp * 0.3, RAMPS.bone[4]); c.globalAlpha = 1;
}

// ════════════════════════════════════════════════════════════════
//  GARDEN (outside — mushroom gnome village)
// ════════════════════════════════════════════════════════════════
const G_GROUND = 96;
const GNOME_HOMES = [
  { x: 74, capR: 15, cap: RAMPS.capRed, door: RAMPS.amber },
  { x: 138, capR: 19, cap: ['#3a1450', '#5a2078', '#7e2ea8', '#a050d0', '#c47ce8'], door: RAMPS.cyan },
  { x: 200, capR: 13, cap: ['#5a4a10', '#8a7018', '#bd9a26', '#e8c84a', '#fff0a0'], door: RAMPS.green },
];
const CAMPFIRE = { x: 110, y: 132 };
function gardenStatic(c, S) {
  const D = makeD(c, S); const { RECT, P, vgrad, disc, discSh, line, noise, dither, panel } = D;
  vgrad(0, 0, ROOM_W, G_GROUND, RAMPS.sky);
  for (let i = 0; i < 44; i++) { const x = sr(i) * ROOM_W, y = sr(i + 9) * (G_GROUND - 18); P(x, y, i % 5 ? '#aab0e0' : '#eef0ff'); }
  discSh(218, 22, 9, RAMPS.bone, -0.5, -0.5); disc(213, 18, 6, RAMPS.sky[2]);
  for (const [cx, cy] of [[58, 26], [150, 16]]) for (let i = 0; i < 5; i++) disc(cx + i * 4 - 8, cy + (i % 2), 2 + (i % 2), RAMPS.sky[2]);
  for (let x = 0; x < ROOM_W; x += 5) { const h = 9 + sr(x) * 14; dither(x, G_GROUND - h, 5, h, RAMPS.sky[1], RAMPS.grass[0], 0.6); }
  vgrad(0, G_GROUND, ROOM_W, ROOM_H - G_GROUND, RAMPS.grass, 1);
  RECT(0, G_GROUND, ROOM_W, 1, RAMPS.grass[5]);
  noise(0, G_GROUND, ROOM_W, ROOM_H - G_GROUND, [RAMPS.grass[1], RAMPS.grass[3], RAMPS.grass[5]], 0.08, 4);
  for (let y = G_GROUND + 2; y < ROOM_H; y += 1) { const cxp = 122 + Math.sin((y - G_GROUND) / 11) * 32; const wp = 7 + (y - G_GROUND) * 0.4; dither(cxp - wp / 2, y, wp, 1, RAMPS.stoneWarm[2], RAMPS.stoneWarm[4], 0.5); }
  discSh(224, 132, 12, ['#0a2330', '#0e3346', '#134a5e', '#1d6b7e'], -0.3, -0.4);
  c.save(); c.globalAlpha = 0.4; RECT(214, 128, 18, 1, RAMPS.cyan[4]); c.restore();
  disc(229, 131, 2, RAMPS.grass[3]); P(229, 131, RAMPS.capRed[3]);
  for (const rx of [213, 236]) { line(rx, 135, rx, 128, RAMPS.grass[3]); P(rx, 127, RAMPS.grass[4]); }
  for (let i = 0; i < 4; i++) RECT(52 + i * 6, G_GROUND + 16, 1, 8, RAMPS.wood[2]);
  RECT(52, G_GROUND + 18, 19, 1, RAMPS.wood[3]); RECT(52, G_GROUND + 21, 19, 1, RAMPS.wood[3]);
  towerDoor(D, S, 8);
  signpost(D, 48, G_GROUND + 24);
  GNOME_HOMES.forEach((h) => mushroomHouse(D, h));
  clothesline(D, 90, 120, G_GROUND - 4);
  campfireBase(D, CAMPFIRE.x, CAMPFIRE.y);
  panel(178, G_GROUND + 22, 8, 4, RAMPS.wood, 5, 1, 3); disc(180, G_GROUND + 27, 1, RAMPS.iron[2]); RECT(186, G_GROUND + 21, 2, 1, RAMPS.woodDark[1]);
  for (let i = 0; i < 8; i++) { const x = 18 + i * 28 + sr(i) * 8; if (Math.abs(x - CAMPFIRE.x) < 16) continue; toadstool(D, x, G_GROUND + 12 + sr(i + 2) * 20, 2 + Math.floor(sr(i) * 2)); }
  for (let i = 0; i < 18; i++) { const x = sr(i * 3) * ROOM_W, y = G_GROUND + 6 + sr(i + 5) * (ROOM_H - G_GROUND - 8); const col = [RAMPS.red[3], RAMPS.amber[3], RAMPS.violet[3], RAMPS.cyan[3]][i % 4]; P(x, y, RAMPS.grass[2]); P(x, y - 1, col); }
  for (let i = 0; i < 46; i++) { const x = sr(i * 5) * ROOM_W, y = G_GROUND + 4 + sr(i + 1) * (ROOM_H - G_GROUND - 6); line(x, y, x + (sr(i) > 0.5 ? 1 : -1), y - 2 - Math.floor(sr(i) * 2), RAMPS.grass[Math.floor(2 + sr(i) * 3)]); }
  vignette(c, S, 0.42);
}
function campfireBase(D, x, y) {
  const { discSh, RECT, ao } = D; ao(x, y + 2, 9, 2, 0.4);
  for (let a = 0; a < Math.PI * 2; a += 0.5) discSh(x + Math.cos(a) * 6, y + Math.sin(a) * 2.4, 1, RAMPS.stoneCool, -0.4, -0.5);
  RECT(x - 4, y - 1, 8, 2, RAMPS.woodDark[1]); RECT(x - 2, y - 2, 7, 2, RAMPS.woodDark[2]); RECT(x - 3, y - 1, 6, 1, RAMPS.wood[2]);
}
function signpost(D, x, y) {
  const { RECT, P, panel } = D;
  RECT(x, y - 16, 2, 18, RAMPS.woodDark[1]); P(x, y - 16, RAMPS.wood[3]);
  panel(x - 9, y - 16, 11, 4, RAMPS.wood, 5, 1, 3); P(x - 10, y - 14, RAMPS.wood[3]); RECT(x - 7, y - 15, 6, 1, RAMPS.woodDark[2]);
  panel(x + 2, y - 10, 11, 4, RAMPS.wood, 5, 1, 3); P(x + 13, y - 8, RAMPS.wood[3]); RECT(x + 4, y - 9, 6, 1, RAMPS.woodDark[2]);
}
function clothesline(D, x0, x1, y) {
  const { P, RECT } = D;
  RECT(x0, y - 4, 1, 8, RAMPS.woodDark[1]); RECT(x1, y - 4, 1, 8, RAMPS.woodDark[1]);
  for (let x = x0; x <= x1; x++) { const f = (x - x0) / (x1 - x0); const yy = y - 3 + Math.round(Math.sin(f * Math.PI) * 3); P(x, yy, RAMPS.stalk[1]); }
  [[x0 + 8, RAMPS.red], [x0 + 17, RAMPS.cyan], [x0 + 25, RAMPS.amber]].forEach(([ix, col]) => { const f = (ix - x0) / (x1 - x0); const yy = y - 3 + Math.round(Math.sin(f * Math.PI) * 3); RECT(ix, yy + 1, 3, 4, col[3]); P(ix + 1, yy + 1, col[4]); });
}
function mushroomHouse(D, h) {
  const { RECT, P, disc, ao } = D;
  const baseY = G_GROUND + 6, stalkW = Math.round(h.capR * 0.7);
  ao(h.x, baseY + 6, h.capR, 4, 0.32);
  for (let y = baseY; y > baseY - 22; y--) { const f = (baseY - y) / 22; const w = Math.round(stalkW * (1 - f * 0.12)); for (let x = -w / 2; x <= w / 2; x++) { const n = x / (w / 2); const idx = Math.round((0.5 + n * 0.5) * (RAMPS.stalk.length - 1)); P(h.x + x, y, RAMPS.stalk[Math.max(0, Math.min(RAMPS.stalk.length - 1, RAMPS.stalk.length - 1 - idx))]); } }
  const dy = baseY - 8; disc(h.x, dy, 4, RAMPS.woodDark[1]); for (let a = -Math.PI; a < 0; a += 0.2) P(h.x + Math.cos(a) * 4, dy + Math.sin(a) * 4, h.door[3]); RECT(h.x - 4, dy, 8, 4, RAMPS.woodDark[1]); P(h.x + 2, dy + 1, h.door[4]);
  disc(h.x - Math.round(stalkW * 0.32), baseY - 16, 1, RAMPS.amber[1]); disc(h.x + Math.round(stalkW * 0.32), baseY - 16, 1, RAMPS.amber[1]);
  const capY = baseY - 22;
  for (let dyc = -h.capR; dyc <= 2; dyc++) for (let dxc = -h.capR - 2; dxc <= h.capR + 2; dxc++) { const rr = (dxc / (h.capR + 2)) ** 2 + (dyc / h.capR) ** 2; if (rr > 1 || dyc > 1) continue; const n = (dxc * -0.4 + dyc * -0.7) / h.capR; const tone = Math.max(0, Math.min(1, 0.45 + n * 0.6)) * (h.cap.length - 1); const lo = Math.floor(tone), frac = tone - lo; const idx = frac > bth(h.x + dxc, capY + dyc) ? Math.min(h.cap.length - 1, lo + 1) : lo; P(h.x + dxc, capY + dyc, h.cap[idx]); }
  for (let i = 0; i < 6; i++) { const a = -2.6 + i * 0.42; const rr = h.capR * (0.4 + (i % 2) * 0.3); const sx = h.x + Math.cos(a) * rr, sy = capY + Math.sin(a) * rr * 0.8; if (sy < capY + 1) { disc(sx, sy, 1 + (i % 2), RAMPS.capSpot[2]); P(sx, sy, RAMPS.capSpot[1]); } }
  for (let dxc = -h.capR; dxc <= h.capR; dxc++) P(h.x + dxc, capY + 1, RAMPS.stalk[0]);
  RECT(h.x + Math.round(h.capR * 0.4), capY - h.capR + 1, 3, 4, RAMPS.woodDark[2]);
}
function toadstool(D, x, y, r) {
  const { P, discSh, RECT } = D; D.ao(x, y + 1, r + 1, 2, 0.28);
  RECT(x - 1, y - 2, 2, 3, RAMPS.stalk[3]); discSh(x, y - 3, r, RAMPS.capRed, -0.4, -0.6); for (let i = 0; i < 3; i++) P(x - r + 1 + i * r, y - 3 - (i % 2), RAMPS.capSpot[2]);
}
function gardenDynamic(c, t, S) {
  const D = makeD(c, S); const { P } = D;
  GNOME_HOMES.forEach((h, hi) => {
    const cx2 = h.x + Math.round(h.capR * 0.4) + 1, cy2 = (G_GROUND + 6 - 22) - h.capR + 1;
    c.globalAlpha = 0.35; for (let i = 0; i < 4; i++) { const ph = ((t / 18 + i * 50 + hi * 20) % 90) / 90; P(cx2 + Math.sin(ph * 6 + hi) * 4, cy2 - ph * 16, '#cfd4e0'); } c.globalAlpha = 1;
    const baseY = G_GROUND + 6, stalkW = Math.round(h.capR * 0.7); const fl = 0.6 + 0.4 * Math.sin(t / 300 + hi);
    glowPx(c, S, h.x - Math.round(stalkW * 0.32), baseY - 16, 1, 1, RAMPS.amber[4], RAMPS.amber[3], 2 * fl);
    glowPx(c, S, h.x + Math.round(stalkW * 0.32), baseY - 16, 1, 1, RAMPS.amber[4], RAMPS.amber[3], 2 * fl);
    lightPool(c, S, h.x, baseY - 12, 16, RAMPS.amber[3], 0.22 * fl);
  });
  campfireFlames(D, c, S, CAMPFIRE.x, CAMPFIRE.y, t);
  seatedGnome(D, CAMPFIRE.x - 11, CAMPFIRE.y + 1, t, 0, 1);
  seatedGnome(D, CAMPFIRE.x + 11, CAMPFIRE.y + 1, t, 3, -1);
  for (let i = 0; i < 4; i++) { const x = 216 + ((t / 40 + i * 4) % 16); c.globalAlpha = 0.4; P(x, 130 + (i % 2), RAMPS.cyan[4]); c.globalAlpha = 1; }
  if (Math.sin(t / 1400) > 0.9) glowPx(c, S, 222, 128, 1, 1, RAMPS.green[3], RAMPS.green[3], 2);
  for (let g = 0; g < 5; g++) gnome(D, t, g);
  snail(D, t);
  for (let b = 0; b < 3; b++) butterfly(D, t, b);
  for (let i = 0; i < 20; i++) { const x = (sr(i) * ROOM_W + Math.sin(t / 700 + i) * 20 + t / (30 + i)) % ROOM_W; const y = 58 + sr(i + 4) * 62 + Math.sin(t / 500 + i * 2) * 8; const bl = 0.5 + 0.5 * Math.sin(t / 300 + i * 1.7); c.globalAlpha = bl; glowPx(c, S, x, y, 1, 1, RAMPS.amber[4], RAMPS.amber[3], 3); c.globalAlpha = 1; }
  const hx = 23; lightPool(c, S, hx, G_GROUND + 10, 24, RAMPS.amber[3], 0.3 + 0.1 * Math.sin(t / 520));
  const bob = Math.round(Math.sin(t / 420) * 1.5); c.save(); c.globalAlpha = 0.5 + 0.3 * Math.sin(t / 420);
  for (let k = 0; k < 3; k++) glowPx(c, S, hx + (1 - k), G_GROUND - 2 + bob - k, 1, 2 * k + 1, RAMPS.amber[4], RAMPS.amber[3], 2); c.restore();
  vignette(c, S, 0.22);
}
function campfireFlames(D, c, S, x, y, t) {
  const { P } = D;
  for (let i = 0; i < 9; i++) { const fx = x - 4 + i; const fl = sr(i + Math.floor(t / 80)); const h = 4 + Math.round(Math.abs(Math.sin(t / 130 + i)) * 5) - Math.abs(i - 4) - (fl > 0.6 ? 2 : 0); for (let k = 0; k < h; k++) { const tone = k / Math.max(1, h); const col = tone > 0.66 ? RAMPS.fire[5] : tone > 0.4 ? RAMPS.fire[3] : RAMPS.fire[1]; P(fx, y - 1 - k, col); } }
  for (let i = 0; i < 5; i++) { const ph = ((t / 30 + i * 40) % 110) / 110; c.globalAlpha = 1 - ph; P(x - 3 + sr(i) * 7, y - 4 - ph * 22, RAMPS.fire[4]); c.globalAlpha = 1; }
  lightPool(c, S, x, y - 3, 34, RAMPS.fire[3], 0.42 + 0.08 * Math.sin(t / 130));
}
function seatedGnome(D, x, y, t, idx, face) {
  const { P, RECT } = D; const col = [RAMPS.red, RAMPS.cyan, RAMPS.green, RAMPS.amber][idx % 4]; const bob = Math.sin(t / 520 + idx) > 0 ? 0 : 1;
  RECT(x - 1, y - 3 + bob, 3, 3, col[2]); P(x, y - 4 + bob, RAMPS.bone[4]); P(x, y - 3 + bob, RAMPS.bone[5]);
  P(x, y - 5 + bob, col[3]); P(x + face, y - 2 + bob, RAMPS.bone[4]);
}
function snail(D, t) {
  const { P, discSh } = D; const x = 70 + ((t / 150) % 108), y = G_GROUND + 34;
  P(x - 3, y, RAMPS.cloth[3]); P(x - 4, y, RAMPS.cloth[2]); P(x - 5, y - 1, RAMPS.cloth[2]); P(x - 5, y - 2, RAMPS.bone[3]);
  discSh(x, y - 1, 2, RAMPS.amber, -0.4, -0.5); P(x, y - 1, RAMPS.amber[4]);
}
function butterfly(D, t, idx) {
  const { P } = D; const x = (50 + idx * 70 + Math.sin(t / 600 + idx) * 28 + t / 90) % ROOM_W; const y = 52 + Math.sin(t / 280 + idx) * 14 + idx * 6;
  const flap = Math.sin(t / 70 + idx) > 0 ? 1 : 0; const col = [RAMPS.violet, RAMPS.cyan, RAMPS.amber][idx % 3];
  P(x, y, col[1]); P(x - 1 - flap, y - flap, col[3]); P(x + 1 + flap, y - flap, col[3]); P(x - 1 - flap, y + 1, col[2]); P(x + 1 + flap, y + 1, col[2]);
}
function gnome(D, t, idx) {
  const { P, RECT } = D;
  const span = 50 + idx * 6, off = 56 + idx * 30;
  const phase = (t / (900 + idx * 120)) + idx;
  const dir = Math.sin(phase) >= 0 ? 1 : -1;
  const x = Math.round(off + (0.5 + 0.5 * Math.sin(phase)) * span);
  const y = G_GROUND + 18 + (idx % 3) * 13;
  const step = Math.sin(t / 90 + idx) > 0 ? 0 : 1;
  const yy = y - step;
  const capCol = [RAMPS.red, RAMPS.cyan, RAMPS.green, RAMPS.amber, RAMPS.violet][idx % 5];
  D.ao(x, y + 2, 2, 1, 0.25);
  RECT(x - 1, yy - 2, 3, 3, capCol === RAMPS.red ? RAMPS.cloth[2] : RAMPS.iron[3]);
  P(x, yy - 3, RAMPS.bone[4]);
  P(x, yy - 2, RAMPS.bone[5]);
  P(x, yy - 4, capCol[2]); P(x, yy - 5, capCol[3]);
  P(x - 1, yy + 1, step ? RAMPS.woodDark[2] : RAMPS.woodDark[1]); P(x + 1, yy + 1, step ? RAMPS.woodDark[1] : RAMPS.woodDark[2]);
  P(x + dir * 2, yy - 1, RAMPS.bone[4]);
}

// ── room registry + hotspots ────────────────────────────────────
// Copy rewritten from the design project's placeholders: the jokes stay, but
// they now point at work that exists.
export const ROOMS = {
  study: {
    name: '✦ THE STUDY', accent: 'amber', static: studyStatic, dynamic: studyDynamic,
    doors: [{ x: 206, y: 26, w: 30, h: 78, to: 'lab', label: '→ The Laboratory' }],
    hotspots: [
      { id: 'grimoire', x: 108, y: 78, w: 24, h: 14, label: 'The Grimoire', scene: 'grimoireHero', pal: 'green', title: 'THE LIVING GRIMOIRE', body: 'Five things I built, written out properly — what the problem was, what I chose, and the numbers attached. It keeps writing itself as I ship.', action: 'grimoire' },
      { id: 'fire', x: 6, y: 24, w: 50, h: 80, label: 'Hearth', scene: 'cauldron', pal: 'amber', title: 'THE EVERWARM HEARTH', body: 'Never goes out. Neither does the build, if you did the eval design properly the first time.' },
      { id: 'cat', x: 44, y: 122, w: 30, h: 18, label: 'Murr, the familiar', scene: 'cat', pal: 'amber', title: 'MURR, THE FAMILIAR', body: 'Sleeps 19 hours a day. Occasionally walks across the keyboard and commits straight to main, which is the one habit here I have not managed to break.' },
      { id: 'books', x: 148, y: 14, w: 46, h: 90, label: 'Bookshelf', scene: 'terminal', pal: 'green', title: 'THE STACKS', body: 'The MCP specification, the Rust book with a broken spine, a Hebrew grammar I am still losing to, and one volume that is entirely about why your rate limiter should count attempts and not successes.', action: 'spells' },
      { id: 'window', x: 88, y: 8, w: 48, h: 48, label: 'Moonlit window', scene: 'crystalBall', pal: 'violet', title: 'MOONLIT WINDOW', body: 'Lisbon out there for now. Moving soon — the paperwork is further along than the packing is.' },
    ],
  },
  lab: {
    name: '⚗ THE LABORATORY', accent: 'green', static: labStatic, dynamic: labDynamic,
    doors: [{ x: 2, y: 26, w: 30, h: 78, to: 'study', label: '→ The Study' }, { x: 208, y: 26, w: 32, h: 78, to: 'garden', label: '→ The Glade' }],
    hotspots: [
      { id: 'cauldron', x: 116, y: 64, w: 50, h: 26, label: 'Potion station', scene: 'cauldron', pal: 'green', title: 'THE BREWERY', body: 'Where the labelling pipeline lives: a vision model proposes, SAM turns boxes into masks, and then a human looks at every single one anyway. The green one is definitely not for drinking.' },
      { id: 'shelf', x: 114, y: 18, w: 54, h: 14, label: 'Reagent shelf', scene: 'enchant', pal: 'cyan', title: 'REAGENTS', body: 'Bottled essences, sorted by how much of a headache they were, and one judgmental skull that glows when your evaluation split is shuffled instead of temporal.' },
      { id: 'shadow', x: 170, y: 22, w: 36, h: 62, label: '???', scene: 'portal', pal: 'violet', title: 'SOMETHING IN THE DARK', body: 'You do not look directly at it. It reviews your PRs. It took seven weeks over the last one, and it was right about most of it.' },
    ],
    cabinet: { x: CAB.x, y: CAB.y, w: CAB.w, h: CAB.h },
  },
  garden: {
    name: '🍄 THE GLADE', accent: 'green', static: gardenStatic, dynamic: gardenDynamic,
    doors: [{ x: 2, y: 28, w: 44, h: 80, to: 'lab', label: '→ Back inside (Home)' }],
    hotspots: [
      { id: 'house1', x: 58, y: 52, w: 32, h: 54, label: 'Toadby Cottage', scene: 'owl', pal: 'red', title: 'TOADBY COTTAGE', body: 'Home of a gnome who has Opinions about your variable names. He is smaller than the mushroom he lives under and considerably louder.' },
      { id: 'house2', x: 118, y: 38, w: 42, h: 68, label: 'The Big Cap', scene: 'portal', pal: 'violet', title: 'THE BIG CAP', body: 'The village hall. The gnome council meets nightly to argue about tabs versus spaces, and has never once reached quorum.' },
      { id: 'house3', x: 184, y: 54, w: 32, h: 50, label: 'Goldgill Burrow', scene: 'levitate', pal: 'green', title: 'GOLDGILL BURROW', body: 'A tiny gnome lives here and tends the fireflies. He also grows oyster mushrooms, which is how I ended up with 8,286 labelled instances of them. Do not step on the flowers.' },
      { id: 'campfire', x: 96, y: 118, w: 28, h: 24, label: 'The gathering fire', scene: 'fireball', pal: 'amber', title: 'THE GATHERING FIRE', body: 'Gnomes gather here after dark to toast tiny marshmallows and roast your last deploy. Bring evidence or do not bother sitting down.' },
      { id: 'pond', x: 208, y: 120, w: 34, h: 26, label: 'Wishing pond', scene: 'crystalBall', pal: 'cyan', title: 'THE WISHING POND', body: 'Toss in a coin and a feature request floats back up. It goes into the approval queue like everything else. Currently froggy.' },
    ],
  },
};
