// pixel-room.jsx — WizardRoom: explorable, clickable pixel-art rooms.
// Renders the active room (room-art ROOMS) by blitting a cached offscreen
// STATIC layer then drawing the DYNAMIC layer each frame. Overlays DOM hotspots,
// an inspect modal, a vial-zoom modal (cabinet), a door-opening transition, and
// 3-room navigation (study · lab · garden).

import React from 'react';
import { ACCENTS, accentVars } from './crt-ui';
import { ROOMS, ROOM_W, ROOM_H, vialSlots, vialPalette } from './room-art';
import { IdeaFX, SCENES, grimoireHero, IDEAS } from './pixel-ideas';

export function WizardRoom({ accent, onNavigate, onExit, embedded, initialRoom }) {
  const W = ROOM_W, H = ROOM_H;
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const staticRef = React.useRef(null); // offscreen canvas
  const keyRef = React.useRef('');
  const [S, setS] = React.useState(5);
  const [fit, setFit] = React.useState(1);
  const [room, setRoom] = React.useState(initialRoom || 'lab');
  const [cabinet, setCabinet] = React.useState(false);
  const [inspect, setInspect] = React.useState(null);
  const [zoom, setZoom] = React.useState(null); // a vial scene
  const [hover, setHover] = React.useState(null);
  const [door, setDoor] = React.useState('opening');
  const cabRef = React.useRef(false); cabRef.current = cabinet;

  const R = ROOMS[room];

  // fit scale
  React.useEffect(() => {
    // Canvas scale stays an integer so the pixels stay crisp. On a viewport too
    // narrow for even 2x, a CSS transform shrinks the whole room to fit rather
    // than letting it crop — a cropped room hides the doors.
    const measure = () => {
      const el = wrapRef.current; if (!el) return;
      const s = Math.max(2, Math.floor(Math.min(el.clientWidth / W, el.clientHeight / H)));
      setS(s);
      setFit(Math.min(1, el.clientWidth / (W * s), el.clientHeight / (H * s)));
    };
    measure(); const ro = new ResizeObserver(measure); if (wrapRef.current) ro.observe(wrapRef.current); window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [W, H]);

  // draw loop with cached static layer
  React.useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * S * dpr; cv.height = H * S * dpr; cv.style.width = W * S + 'px'; cv.style.height = H * S + 'px';
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.imageSmoothingEnabled = false;
    const renderStatic = () => {
      const open = cabRef.current;
      const off = document.createElement('canvas'); off.width = W * S * dpr; off.height = H * S * dpr;
      const oc = off.getContext('2d'); oc.setTransform(dpr, 0, 0, dpr, 0, 0); oc.imageSmoothingEnabled = false;
      R.static(oc, S, { cabinet: open }); staticRef.current = off; keyRef.current = room + S + (open ? '1' : '0');
    };
    const loop = () => {
      const want = room + S + (cabRef.current ? '1' : '0');
      if (keyRef.current !== want) renderStatic();
      c.clearRect(0, 0, W * S, H * S);
      c.drawImage(staticRef.current, 0, 0, W * S, H * S);
      R.dynamic(c, performance.now(), S, { cabinet: cabRef.current });
    };
    renderStatic(); loop();
    const id = setInterval(loop, 1000 / 24);
    return () => clearInterval(id);
  }, [room, S, W, H, R]);

  // door transition on room change
  React.useEffect(() => { setDoor('opening'); const t = setTimeout(() => setDoor('open'), 1050); return () => clearTimeout(t); }, [room]);

  const gotoRoom = (r) => { if (r === room || !ROOMS[r]) return; setInspect(null); setZoom(null); setHover(null); setCabinet(false); setDoor('closing'); setTimeout(() => setRoom(r), 500); };

  const P = accent || ACCENTS[R.accent] || ACCENTS.green;
  const roomW = W * S, roomH = H * S;

  // build hotspot list (objects + doors); cabinet handled separately
  const spots = [...(R.hotspots || [])];
  (R.doors || []).forEach((d, i) => spots.push({ id: 'door' + i, ...d, isDoor: true }));

  const vials = (room === 'lab' && cabinet) ? vialSlots() : [];

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, background: '#050409', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: roomW, height: roomH, boxShadow: '0 0 70px rgba(0,0,0,.85)', transform: fit < 1 ? `scale(${fit})` : undefined, transformOrigin: 'center center' }}>
        <canvas ref={canvasRef} style={{ imageRendering: 'pixelated', display: 'block' }} />

        {/* the cabinet zone: hover opens its doors */}
        {door === 'open' && room === 'lab' && R.cabinet && (
          <div onMouseEnter={() => setCabinet(true)} onMouseLeave={() => { if (!zoom) setCabinet(false); }}
            style={{ position: 'absolute', left: (R.cabinet.x - 14) * S, top: (R.cabinet.y - 6) * S, width: (R.cabinet.w + 28) * S, height: (R.cabinet.h + 12) * S, zIndex: 4 }}>
            {!cabinet && (
              <div className="pix" style={{ position: 'absolute', left: '50%', top: -2, transform: 'translate(-50%,-100%)', whiteSpace: 'nowrap', fontSize: Math.max(9, S * 1.7), color: '#fff', background: 'rgba(8,6,12,.9)', border: '1.5px solid ' + P.base, padding: '4px 8px', textShadow: '0 0 6px ' + P.glow, pointerEvents: 'none' }}>Cabinet of Curiosities<span style={{ color: P.bright }}> ◌ hover to open</span></div>
            )}
            {vials.map((v) => (
              <div key={v.i} onClick={(e) => { e.stopPropagation(); setZoom(v); }} onMouseEnter={() => setHover('vial' + v.i)} onMouseLeave={() => setHover((h) => h === 'vial' + v.i ? null : h)}
                style={{ position: 'absolute', left: (v.cx - 14 - v.w / 2) * S, top: (v.cy - 6 - v.h / 2) * S, width: v.w * S, height: v.h * S, cursor: 'pointer', border: hover === 'vial' + v.i ? '1.5px solid ' + P.bright : '1.5px solid transparent', boxShadow: hover === 'vial' + v.i ? '0 0 12px ' + vialPalette(v.pal)[3] : 'none', borderRadius: 2 }}>
                {hover === 'vial' + v.i && <div className="pix" style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: Math.max(8, S * 1.5), color: '#fff', background: 'rgba(8,6,12,.92)', border: '1.5px solid ' + P.base, padding: '2px 6px', marginBottom: 4, pointerEvents: 'none' }}>{v.label}</div>}
              </div>
            ))}
          </div>
        )}

        {/* hotspot overlays */}
        {door === 'open' && spots.map((h) => (
          <div key={h.id} onClick={() => h.isDoor ? gotoRoom(h.to) : setInspect(h)} onMouseEnter={() => setHover(h.id)} onMouseLeave={() => setHover((v) => v === h.id ? null : v)}
            style={{ position: 'absolute', left: h.x * S, top: h.y * S, width: h.w * S, height: h.h * S, cursor: 'pointer',
              border: hover === h.id ? '2px solid ' + P.bright : '2px solid transparent',
              boxShadow: hover === h.id ? '0 0 16px ' + P.glow : 'none',
              background: hover === h.id && h.isDoor ? 'linear-gradient(90deg,' + P.glow + '22,transparent)' : 'transparent',
              transition: 'border-color .1s, box-shadow .1s', borderRadius: 2, zIndex: 3 }}>
            {hover === h.id && (
              <div className="pix" style={{ position: 'absolute', left: '50%', top: h.isDoor ? '50%' : -26, transform: h.isDoor ? 'translate(-50%,-50%)' : 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: Math.max(9, S * 1.7), color: '#fff', background: 'rgba(8,6,12,.9)', border: '1.5px solid ' + P.base, padding: '4px 8px', textShadow: '0 0 6px ' + P.glow, pointerEvents: 'none', zIndex: 6 }}>{h.label}{!h.isDoor && <span style={{ color: P.bright }}> ◌ inspect</span>}</div>
            )}
          </div>
        ))}

        {/* room label + hint */}
        {door === 'open' && (
          <div className="pix" style={{ position: 'absolute', left: 12, top: 10, fontSize: Math.max(11, S * 2.1), color: '#fff', textShadow: '0 0 10px ' + P.glow, pointerEvents: 'none', zIndex: 2 }}>
            {R.name}
            <div className="pix" style={{ fontSize: Math.max(7, S * 1.25), color: '#9a93a8', marginTop: 5, textShadow: 'none' }}>click the glowing things · doors lead elsewhere</div>
          </div>
        )}

        {door !== 'open' && <Doors S={S} W={W} H={H} state={door} accent={P} />}
        {inspect && <Inspect h={inspect} accent={P} onClose={() => setInspect(null)} onNavigate={onNavigate} />}
        {zoom && <VialZoom v={zoom} onClose={() => { setZoom(null); }} onPrev={() => setZoom(cycleVial(zoom, -1))} onNext={() => setZoom(cycleVial(zoom, 1))} />}
      </div>

      {!embedded && (
        <div onClick={() => onExit && onExit()} className="pix" style={{ position: 'absolute', right: 16, top: 16, fontSize: 11, color: '#fff', border: '1.5px solid ' + P.base, padding: '6px 10px', cursor: 'pointer', background: 'rgba(8,6,12,.8)', zIndex: 10 }}>✕ LEAVE</div>
      )}
    </div>
  );
}

function cycleVial(v, dir) {
  const slots = vialSlots(); const idx = slots.findIndex((s) => s.i === v.i);
  return slots[(idx + dir + slots.length) % slots.length];
}

// double doors that part to reveal the room
function Doors({ S, W, H, state, accent }) {
  const open = state === 'opening'; const halfW = (W * S) / 2;
  const doorStyle = (side) => ({ position: 'absolute', top: 0, [side]: 0, width: halfW, height: H * S, background: 'repeating-linear-gradient(180deg,#2c1f12 0 6px,#241a0f 6px 12px)', borderRight: side === 'left' ? '2px solid #160f08' : 'none', borderLeft: side === 'right' ? '2px solid #160f08' : 'none', transform: open ? `translateX(${side === 'left' ? '-' : ''}100%)` : 'translateX(0)', transition: 'transform 1s cubic-bezier(.6,.02,.3,1)', zIndex: 20, overflow: 'hidden' });
  const band = (top) => ({ position: 'absolute', left: 0, right: 0, top, height: S * 3, background: '#3a4048', boxShadow: 'inset 0 1px #5b636d, inset 0 -1px #22262d' });
  const knob = (side) => ({ position: 'absolute', [side]: S * 3, top: '50%', transform: 'translateY(-50%)', width: S * 6, height: S * 6, borderRadius: '50%', border: `${S}px solid #5b636d`, boxShadow: '0 0 ' + S * 3 + 'px ' + accent.glow });
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
      <div style={doorStyle('left')}><div style={band(H * S * 0.25)} /><div style={band(H * S * 0.62)} /><div style={knob('right')} /></div>
      <div style={doorStyle('right')}><div style={band(H * S * 0.25)} /><div style={band(H * S * 0.62)} /><div style={knob('left')} /></div>
    </div>
  );
}

// inspect modal — animated mini scene + flavor + optional nav
function Inspect({ h, accent, onClose, onNavigate }) {
  const pal = ACCENTS[h.pal] || accent;
  const sceneFn = h.scene === 'grimoireHero' ? grimoireHero : SCENES[h.scene];
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(4,3,8,.74)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} className="crt-root" style={{ width: 380, maxWidth: '88%', background: '#0a0810', border: '2px solid ' + pal.base, boxShadow: '0 0 44px -6px ' + pal.glow }}>
        <div className="crt-screen" style={{ ...accentVars(pal), height: 130, borderBottom: '1.5px solid ' + pal.deep, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {sceneFn && <IdeaFX scene={sceneFn} palette={pal} w={70} h={46} scale={2.6} />}
        </div>
        <div style={{ padding: 16 }}>
          <div className="pix" style={{ fontSize: 13, color: '#fff', textShadow: '0 0 8px ' + pal.glow }}>{h.title}</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#c9c2d2', lineHeight: 1.45, marginTop: 10 }}>{h.body}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {h.action && onNavigate && <button onClick={() => onNavigate(h.action)} className="pix" style={{ fontSize: 9, color: '#04110a', background: pal.base, border: 'none', padding: '7px 12px', cursor: 'pointer', boxShadow: '0 0 10px ' + pal.glow }}>{h.action === 'grimoire' ? 'OPEN THE GRIMOIRE →' : 'READ THE TOMES →'}</button>}
            <button onClick={onClose} className="pix" style={{ fontSize: 9, color: pal.bright, background: 'transparent', border: '1.5px solid ' + pal.deep, padding: '7px 12px', cursor: 'pointer' }}>✕ CLOSE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// vial zoom — a big look at one "spell" with prev/next
function VialZoom({ v, onClose, onPrev, onNext }) {
  const palMap = { green: ACCENTS.green, violet: ACCENTS.violet, cyan: ACCENTS.cyan, amber: ACCENTS.amber, fire: { deep: '#7a2a00', base: '#ff6a00', bright: '#ffd166', glow: '#ff5a1f' }, ice: { deep: '#0b6f86', base: '#5fd0ff', bright: '#d8f4ff', glow: '#49c6ff' }, red: ACCENTS.cyan };
  const pal = palMap[v.pal] || ACCENTS.green;
  const sceneFn = SCENES[v.scene];
  const caption = IDEAS().find((d) => d[0] === v.scene);
  React.useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext(); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [onClose, onPrev, onNext]);
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(3,2,7,.82)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="pix" style={navArrow('left', pal)}>‹</button>
      <div onClick={(e) => e.stopPropagation()} className="crt-root" style={{ width: 420, maxWidth: '86%', background: '#08060e', border: '2px solid ' + pal.base, boxShadow: '0 0 60px -8px ' + pal.glow }}>
        <div className="crt-screen" style={{ ...accentVars(pal), height: 230, borderBottom: '1.5px solid ' + pal.deep, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px ' + pal.glow + '44', pointerEvents: 'none' }} />
          {sceneFn && <IdeaFX scene={sceneFn} palette={pal} w={92} h={62} scale={3.2} />}
          <div className="pix" style={{ position: 'absolute', top: 10, left: 12, fontSize: 9, color: pal.bright, textShadow: '0 0 6px ' + pal.glow }}>VIAL №{String(v.i + 1).padStart(2, '0')}</div>
        </div>
        <div style={{ padding: 18 }}>
          <div className="pix" style={{ fontSize: 15, color: '#fff', textShadow: '0 0 8px ' + pal.glow }}>{v.label}</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#c9c2d2', lineHeight: 1.45, marginTop: 10 }}>{caption ? caption[3] : 'A bottled spell from the cabinet.'}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div className="pix" style={{ fontSize: 8, color: '#6a6478' }}>← → to browse · ESC to close</div>
            <button onClick={onClose} className="pix" style={{ fontSize: 9, color: pal.bright, background: 'transparent', border: '1.5px solid ' + pal.deep, padding: '7px 12px', cursor: 'pointer' }}>✕ CLOSE</button>
          </div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="pix" style={navArrow('right', pal)}>›</button>
    </div>
  );
}
function navArrow(side, pal) {
  return { position: 'absolute', [side]: 'max(16px, 6vw)', top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, fontSize: 22, color: '#fff', background: 'rgba(8,6,12,.8)', border: '1.5px solid ' + pal.base, cursor: 'pointer', zIndex: 41 };
}
