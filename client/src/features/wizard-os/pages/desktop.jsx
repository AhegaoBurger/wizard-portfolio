// desktop.jsx — the Wizard OS desktop: draggable windows on wide screens,
// a plain scrolling stack on narrow ones (dragging windows on a phone is a
// worse experience than not having them).

import React from 'react';
import { accentVars, Bar } from '../art/crt-ui';
import { PixelWizard } from '../art/pixel-wizard';
import { OSCtx } from '../shell/os-context';
import { PROFILE, PROJECTS } from '../data/site-data';
import { ProjectScene, StatusBadge } from './site-pages';

function DraggableWindow({ title, accent, x, y, w, children }) {
  const [pos, setPos] = React.useState({ x, y });
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef(null);
  const onDown = (e) => {
    e.preventDefault();
    drag.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    setDragging(true);
    const mv = (ev) => { if (!drag.current) return; setPos({ x: drag.current.ox + (ev.clientX - drag.current.px), y: drag.current.oy + (ev.clientY - drag.current.py) }); };
    const up = () => { drag.current = null; setDragging(false); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="crt-win crt-root" style={{ ...accentVars(accent), position: 'absolute', left: pos.x, top: pos.y, width: w, zIndex: dragging ? 20 : 10 }}>
      <div className="crt-bar" style={{ cursor: dragging ? 'grabbing' : 'grab' }} onPointerDown={onDown}>
        <span className="crt-close" /><span className="stripes" /><span className="crt-title pix">{title}</span>
      </div>
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}

function StaticWindow({ title, accent, children }) {
  return (
    <div className="crt-win crt-root" style={{ ...accentVars(accent), width: '100%' }}>
      <div className="crt-bar"><span className="crt-close" /><span className="stripes" /><span className="crt-title pix">{title}</span></div>
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}

// ── window bodies, shared between both layouts ──────────────────
function ProfileBody({ accent }) {
  const os = React.useContext(OSCtx);
  const P = PROFILE;
  return (
    <>
      <div className="crt-screen" style={{ ...accentVars(accent), height: 132, border: '1.5px solid #cfd6dd', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div className="pat-diag" style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 1 }} />
        <div className="pix glow-ac" style={{ position: 'absolute', top: 7, left: 0, right: 0, textAlign: 'center', fontSize: 8, zIndex: 42 }}>◇ {P.years} YEARS SHIPPING ◇</div>
        <div style={{ position: 'relative', zIndex: 30, marginBottom: -4 }}><PixelWizard accent={accent} mode="idle" scale={3.4} /></div>
      </div>
      <div style={{ border: '1.5px solid #e8edf2', marginTop: 10, padding: '10px 8px', textAlign: 'center' }}>
        <div className="pix glow" style={{ fontSize: 15, color: '#fff' }}>{P.name}</div>
        <div className="pix glow-ac" style={{ fontSize: 8, marginTop: 6 }}>{P.role}</div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#aeb8c2', marginTop: 7, lineHeight: 1.4 }}>{P.tagline}</div>
        <div className="pix" style={{ fontSize: 8, color: '#fff', marginTop: 12 }}>◢ {P.location}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {[['◈', 'grimoire', 'Grimoire'], ['✦', 'spells', 'Skills'], ['✉', 'contact', 'Contact']].map(([g, r, t]) => (
          <div key={r} title={t} onClick={() => os.navigate(r)} className="glow" style={{ flex: 1, height: 30, border: '1.5px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', cursor: 'pointer' }}>{g}</div>
        ))}
      </div>
    </>
  );
}

function GrimoireBody({ accent }) {
  const os = React.useContext(OSCtx);
  const preview = PROJECTS.slice(0, 2);
  return (
    <>
      <div className="pix glow" style={{ fontSize: 10, color: '#fff', marginBottom: 10 }}>◈ RECENT SPELLS</div>
      {preview.map((p) => (
        <div key={p.id} onClick={() => os.navigate('project', p.id)} style={{ border: '1.5px solid #2a3a32', padding: 7, marginBottom: 7, display: 'flex', gap: 8, cursor: 'pointer', alignItems: 'center' }}>
          <div className="crt-screen" style={{ ...accentVars(accent), width: 72, height: 50, flex: '0 0 auto', border: '1px solid #1f2c25', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProjectScene kind={p.scene} accent={accent} scale={1.2} thumb basePrice={p.basePrice} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><span className="pix glow" style={{ fontSize: 9, color: '#fff' }}>{p.title}</span><StatusBadge status={p.status} accent={accent} /></div>
            <div className="pix glow-ac" style={{ fontSize: 7, marginTop: 4 }}>{p.cat}</div>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 13, color: '#9fb0c0', marginTop: 4, lineHeight: 1.35 }}>{p.tagline}</div>
          </div>
        </div>
      ))}
      <div onClick={() => os.navigate('grimoire')} className="pix" style={{ fontSize: 9, textAlign: 'center', color: '#04110a', background: accent.base, padding: '7px', cursor: 'pointer', marginTop: 3, boxShadow: '0 0 10px ' + accent.glow }}>OPEN GRIMOIRE ▸</div>
    </>
  );
}

function SkillsBody({ accent }) {
  const os = React.useContext(OSCtx);
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PROFILE.skills.map(([l, v]) => <Bar key={l} label={l} value={v} />)}
      </div>
      <div onClick={() => os.navigate('spells')} className="pix" style={{ fontSize: 9, textAlign: 'center', color: accent.bright, border: '1.5px solid ' + accent.deep, padding: '7px', cursor: 'pointer', marginTop: 12 }}>VIEW SKILL TREE ▸</div>
    </>
  );
}

export function DesktopPage() {
  const os = React.useContext(OSCtx);
  const accent = os.accent;

  if (os.narrow) {
    return (
      <div id="os-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '18px 14px 30px' }}>
        <div className="pix glow" style={{ fontSize: 10, color: '#fff', marginBottom: 14 }}>◇ WELCOME — {PROFILE.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420, margin: '0 auto' }}>
          <StaticWindow title="WIZARD_PROFILE" accent={accent}><ProfileBody accent={accent} /></StaticWindow>
          <StaticWindow title="GRIMOIRE" accent={accent}><GrimoireBody accent={accent} /></StaticWindow>
          <StaticWindow title="MAGICAL_SKILLS" accent={accent}><SkillsBody accent={accent} /></StaticWindow>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* rune-grid wallpaper */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'linear-gradient(#0c1611 1px,transparent 1px),linear-gradient(90deg,#0c1611 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="glow-ac" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 220, opacity: 0.04, pointerEvents: 'none' }}>✦</div>
      <div className="pix glow" style={{ position: 'absolute', top: 16, left: 20, fontSize: 11, color: '#fff' }}>◇ WELCOME BACK, ARCH-MAGE</div>

      <DraggableWindow title="WIZARD_PROFILE" accent={accent} x={28} y={48} w={264}><ProfileBody accent={accent} /></DraggableWindow>
      <DraggableWindow title="GRIMOIRE" accent={accent} x={312} y={48} w={300}><GrimoireBody accent={accent} /></DraggableWindow>
      <DraggableWindow title="MAGICAL_SKILLS" accent={accent} x={632} y={48} w={250}><SkillsBody accent={accent} /></DraggableWindow>

      {/* familiar casting on the desktop */}
      <div style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 5, textAlign: 'center' }}>
        <PixelWizard accent={accent} mode="cast" scale={3} />
        <div className="pix glow-ac" style={{ fontSize: 8, marginTop: 2 }}>the familiar is casting…</div>
      </div>
    </div>
  );
}
