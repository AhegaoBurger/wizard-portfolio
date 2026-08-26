// wizard-os.jsx — the Wizard OS shell: boot, menu bar, dock, theme.
//
// Differs from the Claude Design original in one structural way: navigation is
// backed by real router URLs instead of a `route` state string. A portfolio
// link has to be shareable — /grimoire/zed_mcp needs to open that project.

import React from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { ACCENTS, accentVars } from '../art/crt-ui';
import { OSCtx, ROUTE_PATHS } from './os-context';

const BOOT_KEY = 'wizardos:booted:v3';
const THEME_KEY = 'wizardos:theme:v3';

// localStorage throws in private-mode / embedded contexts. Never let the shell
// fail to render because a preference could not be read.
const readLS = (k, fallback) => { try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; } };
const writeLS = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

export function useIsNarrow(px = 860) {
  const [narrow, setNarrow] = React.useState(() => typeof window !== 'undefined' && window.innerWidth < px);
  React.useEffect(() => {
    const f = () => setNarrow(window.innerWidth < px);
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, [px]);
  return narrow;
}

// ── BOOT SCREEN ─────────────────────────────────────────────────
const BOOT_LINES = [
  '> ARCANE_BIOS v9.3 ......... OK',
  '> mounting /grimoire ....... OK',
  '> summoning familiars ...... OK',
  '> charging mana core ....... OK',
  '> loading spellbook ........ OK',
  '> WIZARD_OS ready.',
];
function BootScreen({ accent, onDone }) {
  const [shown, setShown] = React.useState(0);
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const li = setInterval(() => setShown((s) => Math.min(BOOT_LINES.length, s + 1)), 300);
    const pi = setInterval(() => setPct((p) => Math.min(100, p + 4)), 70);
    const done = setTimeout(onDone, 2600);
    return () => { clearInterval(li); clearInterval(pi); clearTimeout(done); };
  }, [onDone]);
  return (
    <div className="crt-screen crt-root crt-flicker" style={{ ...accentVars(accent), position: 'fixed', inset: 0, zIndex: 200, padding: 0, cursor: 'pointer' }}
      onClick={onDone}>
      <div style={{ position: 'relative', zIndex: 30, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 76, height: 76, border: '2px solid #e8edf2', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px ' + accent.glow }}>
          <span className="glow-ac" style={{ transform: 'rotate(-45deg)', fontSize: 36 }}>✦</span>
        </div>
        <div className="pix glow" style={{ fontSize: 20, color: '#fff', marginTop: 22 }}>WIZARD&nbsp;OS</div>
        <div className="pix glow-ac" style={{ fontSize: 9, marginTop: 8 }}>POWERING ON THE CRT…</div>
        <div style={{ width: 'min(320px, 84vw)', marginTop: 26, fontFamily: "'VT323',monospace", fontSize: 16, lineHeight: 1.4, minHeight: 130 }}>
          {BOOT_LINES.slice(0, shown).map((l, i) => <div key={l} className={i === BOOT_LINES.length - 1 ? 'glow-ac' : ''} style={{ color: i === BOOT_LINES.length - 1 ? accent.bright : '#cdd6df' }}>{l}</div>)}
          <span className="crt-cursor glow-ac" style={{ color: accent.bright }}>&nbsp;</span>
        </div>
        <div style={{ width: 'min(320px, 84vw)', marginTop: 14, height: 12, border: '1.5px solid #e8edf2', padding: 2 }}>
          <div className="pat-check" style={{ height: '100%', width: pct + '%' }} />
        </div>
      </div>
      <div className="pix" style={{ position: 'absolute', right: 22, bottom: 16, zIndex: 42, fontSize: 9, color: '#fff', border: '1.5px solid #fff', padding: '5px 11px' }}>SKIP ▸</div>
    </div>
  );
}

// ── MENU BAR ────────────────────────────────────────────────────
function MenuBar({ accent, theme, setTheme, narrow }) {
  const os = React.useContext(OSCtx);
  const [clock, setClock] = React.useState('');
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => {
    const f = () => { const d = new Date(); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'); const ap = h < 12 ? 'AM' : 'PM'; h = h % 12 || 12; setClock(`${h}:${m} ${ap}`); };
    f(); const i = setInterval(f, 1000); return () => clearInterval(i);
  }, []);
  const Menu = ({ id, label, items }) => (
    <div style={{ position: 'relative' }}>
      <span onClick={() => setOpen(open === id ? null : id)} className="pix" style={{ fontSize: 9, color: open === id ? '#04110a' : '#cdd6df', background: open === id ? accent.base : 'transparent', padding: '3px 6px', cursor: 'pointer' }}>{label}</span>
      {open === id && (
        <div className="crt-root" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#070d0a', border: '1.5px solid ' + accent.deep, minWidth: 150, zIndex: 90, boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}>
          {items.map(([t, fn]) => <div key={t} onClick={() => { setOpen(null); if (fn) fn(); }} className="pix" style={{ fontSize: 9, color: t === '—' ? '#52606b' : '#cdd6df', padding: '7px 10px', cursor: fn ? 'pointer' : 'default', borderTop: '1px solid #14201a' }} onMouseEnter={(e) => { if (fn) { e.currentTarget.style.background = accent.base; e.currentTarget.style.color = '#04110a'; } }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cdd6df'; }}>{t}</div>)}
        </div>
      )}
    </div>
  );
  return (
    <div className="crt-root" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, zIndex: 80, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', background: '#050a07', borderBottom: '1.5px solid #1c2a22' }}
      onClick={(e) => e.stopPropagation()}>
      <span onClick={() => os.navigate('desktop')} className="glow-ac" style={{ fontSize: 13, cursor: 'pointer', marginRight: 4 }}>✦</span>
      {!narrow && <>
        <Menu id="file" label="File" items={[['Open Grimoire', () => os.navigate('grimoire')], ['—', null], ['Contact', () => os.navigate('contact')]]} />
        <Menu id="view" label="View" items={[['Desktop', () => os.navigate('desktop')], ['Skill Tree', () => os.navigate('spells')], ['The Rooms', () => os.navigate('lab')]]} />
        <Menu id="special" label="Special" items={[['About this Wizard', () => os.navigate('contact')], ['Wizard Duel ⚔', () => os.navigate('404')], ['—', null], ['Replay Boot…', () => os.replayBoot()]]} />
      </>}
      <span style={{ flex: 1 }} />
      {/* live theme swatches */}
      <div style={{ display: 'flex', gap: 5, marginRight: 10 }} title="Phosphor theme">
        {['green', 'amber', 'violet', 'cyan'].map((k) => (
          <span key={k} onClick={() => setTheme(k)} style={{ width: 12, height: 12, cursor: 'pointer', background: ACCENTS[k].base, boxShadow: theme === k ? '0 0 0 1.5px #fff, 0 0 8px ' + ACCENTS[k].glow : '0 0 6px ' + ACCENTS[k].glow, opacity: theme === k ? 1 : 0.6 }} />
        ))}
      </div>
      <span className="pix" style={{ fontSize: 9, color: '#cdd6df' }}>◷ {clock}</span>
    </div>
  );
}

// ── DOCK ────────────────────────────────────────────────────────
const DOCK_ITEMS = [
  ['desktop', '◱', 'Desktop'], ['grimoire', '◈', 'Grimoire'], ['spells', '✦', 'Spellbook'],
  ['lab', '⚗', 'Rooms'], ['contact', '✉', 'Contact'], ['404', '⊘', 'Duel'],
];
function Dock({ accent, pathname }) {
  const os = React.useContext(OSCtx);
  const activeFor = (id) => {
    const p = ROUTE_PATHS[id];
    if (p === '/') return pathname === '/';
    return pathname.startsWith(p);
  };
  return (
    <div className="crt-root" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 3vw, 26px)', background: 'linear-gradient(0deg,#050a07,transparent)' }}>
      {DOCK_ITEMS.map(([id, glyph, label]) => {
        const on = activeFor(id);
        return (
          <div key={id} onClick={() => os.navigate(id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <div className="glow" style={{ width: 34, height: 28, border: '1.5px solid ' + (on ? accent.base : '#e8edf2'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: on ? accent.bright : '#fff', background: on ? 'color-mix(in srgb,' + accent.base + ' 18%, #050a07)' : '#050a07', boxShadow: on ? '0 0 12px ' + accent.glow : 'none' }}>{glyph}</div>
            <span className="pix" style={{ fontSize: 7.5, color: on ? accent.bright : '#cdd6df' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── SHELL ───────────────────────────────────────────────────────
export function WizardOSShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const narrow = useIsNarrow();

  const [themeKey, setThemeKey] = React.useState(() => readLS(THEME_KEY, 'green'));
  const accent = ACCENTS[themeKey] || ACCENTS.green;
  const [booting, setBooting] = React.useState(() => !readLS(BOOT_KEY, ''));
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => { writeLS(THEME_KEY, themeKey); }, [themeKey]);

  const api = React.useMemo(() => ({
    accent,
    narrow,
    navigate: (r, id) => {
      setFlash(true); setTimeout(() => setFlash(false), 170);
      if (r === 'project' && id) navigate({ to: '/grimoire/$projectId', params: { projectId: id } });
      else navigate({ to: ROUTE_PATHS[r] || '/' });
      const scroller = document.getElementById('os-scroll'); if (scroller) scroller.scrollTop = 0;
    },
    replayBoot: () => { try { localStorage.removeItem(BOOT_KEY); } catch { /* ignore */ } setBooting(true); },
  }), [accent, narrow, navigate]);

  const finishBoot = React.useCallback(() => { writeLS(BOOT_KEY, '1'); setBooting(false); }, []);

  // The Rooms page is full-bleed; every other page scrolls inside the frame.
  const isRooms = pathname.startsWith('/laboratory');
  const isDesktop = pathname === '/';

  return (
    <OSCtx.Provider value={api}>
      <div className="crt-screen crt-root crt-flicker" style={{ ...accentVars(accent), position: 'fixed', inset: 0, background: '#04110a' }}>
        <MenuBar accent={accent} theme={themeKey} setTheme={setThemeKey} narrow={narrow} />
        <div style={{ position: 'absolute', top: 28, left: 0, right: 0, bottom: 64, zIndex: 20 }}>
          {isRooms || isDesktop ? (
            <Outlet />
          ) : (
            <div id="os-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: narrow ? '20px 14px' : '32px 28px' }}>
              <Outlet />
            </div>
          )}
        </div>
        <Dock accent={accent} pathname={pathname} />
        {flash && <div style={{ position: 'absolute', inset: 0, zIndex: 95, pointerEvents: 'none', background: 'rgba(255,255,255,.04)', backgroundImage: 'repeating-linear-gradient(0deg,transparent 0 3px, rgba(255,255,255,.08) 3px 4px)' }} />}
        {booting && <BootScreen accent={accent} onDone={finishBoot} />}
      </div>
    </OSCtx.Provider>
  );
}
