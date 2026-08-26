// crt-ui.jsx — Retro-Mac "wizard OS" chrome + phosphor CRT styling.
// Ported from the Claude Design project; the `window` global registry the
// design version used is replaced with real ES exports.
// Fonts (Silkscreen + VT323) are loaded from index.html.

// ── Phosphor accents ──────────────────────────────────────────
// Each direction is one hue family: deep (shadow), base (mid), bright (hi),
// glow (the bloom color). Mono keeps the screen achromatic but still lets the
// orb glow read as "magic".
export const ACCENTS = {
  mono:   { key: 'mono',   name: 'Phosphor White', deep: '#5a5f66', base: '#c4ccd4', bright: '#ffffff', glow: '#9fb8d6', ink: '#aab4c0' },
  amber:  { key: 'amber',  name: 'Amber CRT',      deep: '#8a4e00', base: '#ffae00', bright: '#ffd877', glow: '#ff9d2f', ink: '#ffbd3d' },
  green:  { key: 'green',  name: 'Arcane Green',   deep: '#0a7a37', base: '#2fe070', bright: '#a6ffc4', glow: '#28e36a', ink: '#54e98a' },
  violet: { key: 'violet', name: 'Magic Violet',   deep: '#5320a8', base: '#a173ff', bright: '#d9c2ff', glow: '#9a5cff', ink: '#bb9bff' },
  cyan:   { key: 'cyan',   name: 'Aether Cyan',    deep: '#0b6f86', base: '#2bd6e6', bright: '#aef3fb', glow: '#22cfe0', ink: '#5fe2ee' },
};

export function accentVars(a) {
  return {
    '--ac-deep': a.deep, '--ac': a.base, '--ac-br': a.bright,
    '--ac-glow': a.glow, '--ac-ink': a.ink,
  };
}

// ── One-time CSS injection ────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('crt-ui-styles')) {
  const s = document.createElement('style');
  s.id = 'crt-ui-styles';
  s.textContent = `
  .crt-root{ font-family:'VT323',monospace; color:#e8edf2; -webkit-font-smoothing:none; }
  .pix{ font-family:'Silkscreen',monospace; letter-spacing:.02em; }

  /* Screen: black CRT with a faint accent vignette + scanlines so the void
     stops being dead. Curvature via inset shadow. */
  .crt-screen{ position:relative; background:#040506; overflow:hidden; }
  .crt-screen::before{ content:''; position:absolute; inset:0; pointer-events:none; z-index:40;
    background:repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,.28) 2px 3px); }
  .crt-screen::after{ content:''; position:absolute; inset:0; pointer-events:none; z-index:41;
    box-shadow:inset 0 0 120px 10px rgba(0,0,0,.7), inset 0 0 40px rgba(0,0,0,.5);
    background:radial-gradient(120% 120% at 50% 40%, color-mix(in srgb, var(--ac-glow,#fff) 7%, transparent), transparent 60%); }
  .crt-flicker{ animation:crt-flick 5.5s steps(1) infinite; }
  @keyframes crt-flick{ 0%,97%,100%{opacity:1} 98%{opacity:.94} 99%{opacity:.985} }

  /* Mac window */
  .crt-win{ position:relative; background:#050608; border:2px solid #f2f5f8;
    box-shadow:0 0 0 2px #000, 0 0 22px -2px color-mix(in srgb, var(--ac-glow) 45%, transparent), 0 14px 40px rgba(0,0,0,.6);
    image-rendering:pixelated; }
  .crt-bar{ display:flex; align-items:center; gap:8px; height:26px; padding:0 8px;
    background:#050608; border-bottom:2px solid #f2f5f8; position:relative; }
  .crt-bar .stripes{ position:absolute; left:34px; right:14px; top:50%; transform:translateY(-50%); height:11px;
    background:repeating-linear-gradient(0deg, color-mix(in srgb,var(--ac) 60%, #fff) 0 1px, transparent 1px 3px);
    opacity:.5; }
  .crt-close{ width:13px; height:13px; border:2px solid #f2f5f8; background:#050608; flex:0 0 auto; position:relative; z-index:1; }
  .crt-title{ position:relative; z-index:1; background:#050608; padding:0 8px; font-size:13px;
    color:#fff; text-shadow:0 0 8px color-mix(in srgb,var(--ac-glow) 70%, transparent); white-space:nowrap; }
  .crt-body{ padding:14px; }

  .glow{ text-shadow:0 0 6px color-mix(in srgb,var(--ac-glow) 80%, transparent), 0 0 2px color-mix(in srgb,var(--ac-glow) 90%, transparent); }
  .glow-ac{ color:var(--ac-br); text-shadow:0 0 8px var(--ac-glow); }

  /* Pattern fills from the original system, kept */
  .pat-check{ background-image:
      linear-gradient(45deg,#fff 25%,transparent 25%,transparent 75%,#fff 75%),
      linear-gradient(45deg,#fff 25%,transparent 25%,transparent 75%,#fff 75%);
    background-size:6px 6px; background-position:0 0,3px 3px; opacity:.92; }
  .pat-diag{ background-image:repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 5px); }

  .crt-bars-row{ display:flex; align-items:center; gap:8px; }
  .crt-meter{ flex:1; height:13px; border:1.5px solid #e8edf2; padding:1.5px; }
  .crt-meter > i{ display:block; height:100%; background:var(--ac); box-shadow:0 0 8px var(--ac-glow); }

  .crt-cursor::after{ content:'_'; animation:crt-blink 1s steps(1) infinite; }
  @keyframes crt-blink{ 50%{opacity:0} }

  /* Mobile: the OS chrome has to survive a phone. */
  @media (max-width: 720px) {
    .crt-win{ box-shadow:0 0 0 2px #000, 0 6px 18px rgba(0,0,0,.6); }
  }
  `;
  document.head.appendChild(s);
}

// ── Components ─────────────────────────────────────────────────
export function MacWindow({ title, accent, children, style = {}, bodyStyle = {} }) {
  const a = accent || ACCENTS.mono;
  return (
    <div className="crt-win crt-root" style={{ ...accentVars(a), ...style }}>
      <div className="crt-bar">
        <span className="crt-close" />
        <span className="stripes" />
        <span className="crt-title pix">{title}</span>
      </div>
      <div className="crt-body" style={bodyStyle}>{children}</div>
    </div>
  );
}

// Bare CRT screen (full-bleed black phosphor area) — for boot, duel, etc.
export function CRTFrame({ accent, children, style = {}, className = '' }) {
  const a = accent || ACCENTS.mono;
  return (
    <div className={`crt-screen crt-root crt-flicker ${className}`} style={{ ...accentVars(a), ...style }}>
      {children}
    </div>
  );
}

export function GlowText({ children, style = {}, className = '' }) {
  return <span className={`glow-ac ${className}`} style={style}>{children}</span>;
}

// Skill meter row
export function Bar({ label, value }) {
  return (
    <div className="crt-bars-row" style={{ fontSize: 17 }}>
      <span className="pix" style={{ fontSize: 10, width: 88, flex: '0 0 auto', color: '#dfe6ec' }}>{label}</span>
      <span className="crt-meter"><i style={{ width: value + '%' }} /></span>
    </div>
  );
}
