// site-pages.jsx — page components for Wizard OS. Navigation comes from OSCtx
// (provided by the shell); the scenes come from ../art.

import React from 'react';
import { OSCtx } from '../shell/os-context';
import { ACCENTS, accentVars } from '../art/crt-ui';
import { PixelWizard, PixelDuel } from '../art/pixel-wizard';
import { PixelChart, PixelOptionsArb } from '../art/pixel-fx';
import { PixelMCP, PixelApproval, PixelHebrew, PixelVision } from '../art/pixel-projects';
import { PROFILE, PROJECTS, EXPERIENCE, SKILL_NODES, SKILL_EDGES, SKILL_LIT } from '../data/site-data';

const useNav = () => React.useContext(OSCtx);

// ── shared atoms ────────────────────────────────────────────────
export function ProjectScene({ kind, accent, scale, thumb, basePrice }) {
  const t = thumb ? { width: 58, height: 40 } : {};
  if (kind === 'mcp') return <PixelMCP accent={accent} scale={scale} {...(thumb ? { width: 60, height: 40 } : {})} />;
  if (kind === 'approval') return <PixelApproval accent={accent} scale={scale} {...(thumb ? { width: 60, height: 40 } : {})} />;
  if (kind === 'hebrew') return <PixelHebrew accent={accent} scale={scale} {...(thumb ? { width: 60, height: 40 } : {})} />;
  if (kind === 'vision') return <PixelVision accent={accent} scale={scale} {...(thumb ? { width: 60, height: 40 } : {})} />;
  if (kind === 'optionsarb') return <PixelOptionsArb accent={accent} scale={scale} basePrice={basePrice} {...(thumb ? { width: 60, height: 42 } : {})} />;
  if (kind === 'chart') return <PixelChart accent={accent} scale={scale} basePrice={basePrice} {...t} />;
  return null;
}
export function StatusBadge({ status, accent }) {
  // MERGED / LIVE read as "this is real and you can go look at it".
  const solid = status === 'LIVE' || status === 'MERGED';
  const outline = status === 'BUILT';
  return <span className="pix" style={{ fontSize: 8, color: solid ? '#04110a' : outline ? accent.bright : '#aab4c0', background: solid ? accent.base : 'transparent', border: '1.5px solid ' + (solid ? accent.base : outline ? accent.deep : '#52606b'), padding: '2px 6px', boxShadow: solid ? '0 0 8px ' + accent.glow : 'none' }}>{status}</span>;
}
function Chip({ children, accent }) {
  return <span className="pix" style={{ fontSize: 8, color: accent.bright, border: '1.5px solid ' + accent.deep, padding: '3px 6px', textShadow: '0 0 6px ' + accent.glow }}>{children}</span>;
}
function Metric({ m, accent }) {
  const danger = m[2] === 'danger';
  return (
    <div style={{ border: '1.5px solid #2a3a32', padding: '9px 11px', minWidth: 96 }}>
      <div className="pix" style={{ fontSize: 18, color: danger ? '#ff5470' : accent.bright, textShadow: '0 0 8px ' + (danger ? '#ff5470' : accent.glow) }}>{m[0]}</div>
      <div className="pix" style={{ fontSize: 7.5, color: '#8a96a2', marginTop: 6 }}>{m[1]}</div>
    </div>
  );
}
function Placeholder({ label }) {
  return (
    <div className="pat-diag" style={{ flex: 1, height: 88, border: '1.5px solid #2a3a32', position: 'relative', opacity: 0.9 }}>
      <span className="pix" style={{ position: 'absolute', left: 7, bottom: 6, fontSize: 8, color: '#7e8c98', background: '#04110a', padding: '2px 5px' }}>{label}</span>
    </div>
  );
}
function hudPos(code) {
  return ({
    l: { top: 12, left: 14 }, r: { top: 12, right: 14 }, lr: { top: 13, left: 92 },
    bl: { bottom: 12, left: 14 }, br: { bottom: 12, right: 14 },
  })[code] || { top: 12, left: 14 };
}

// ── GRIMOIRE GALLERY ────────────────────────────────────────────
function GalleryCard({ p, accent }) {
  const os = useNav();
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={() => os.navigate('project', p.id)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ border: '1.5px solid ' + (hover ? accent.base : '#2a3a32'), display: 'flex', gap: 12, padding: 10, background: hover ? '#08160f' : '#05100b', cursor: 'pointer', boxShadow: hover ? '0 0 16px -2px ' + accent.glow : 'none', transition: 'border-color .12s, box-shadow .12s, background .12s' }}>
      <div className="crt-screen" style={{ ...accentVars(accent), width: 124, height: 88, flex: '0 0 auto', border: '1.5px solid #1f2c25', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ProjectScene kind={p.scene} accent={accent} scale={2} thumb basePrice={p.basePrice} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div className="pix glow" style={{ fontSize: 12, color: '#fff' }}>{p.title}</div>
          <StatusBadge status={p.status} accent={accent} />
        </div>
        <div className="pix glow-ac" style={{ fontSize: 8, marginTop: 6 }}>{p.cat} · {p.branch}</div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#aeb8c2', marginTop: 7, lineHeight: 1.4 }}>{p.tagline}</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 9, flexWrap: 'wrap' }}>{p.chips.slice(0, 4).map((c) => <Chip key={c} accent={accent}>{c}</Chip>)}</div>
        <div className="pix" style={{ fontSize: 9, color: accent.bright, marginTop: 10, textShadow: '0 0 6px ' + accent.glow }}>OPEN&nbsp;▸</div>
      </div>
    </div>
  );
}
export function GrimoirePage({ accent }) {
  const [filter, setFilter] = React.useState('ALL');
  const cats = ['ALL', ...Array.from(new Set(PROJECTS.map((p) => p.cat)))];
  const list = PROJECTS.filter((p) => filter === 'ALL' || p.cat === filter);
  return (
    <PageColumn width={760}>
      <PageHead accent={accent} kicker="◈ THE GRIMOIRE" title="SPELLS CAST" sub="Things I built and shipped. Click any spell to read the full incantation." />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {cats.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="pix" style={{ fontSize: 9, padding: '6px 12px', cursor: 'pointer', color: filter === f ? '#04110a' : '#aeb8c2', background: filter === f ? accent.base : 'transparent', border: '1.5px solid ' + (filter === f ? accent.base : '#2a3a32'), boxShadow: filter === f ? '0 0 8px ' + accent.glow : 'none' }}>{f}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((p) => <GalleryCard key={p.id} p={p} accent={accent} />)}
      </div>
      <ChronicleSection accent={accent} />
    </PageColumn>
  );
}

// ── WHERE THE WORK HAPPENED ─────────────────────────────────────
export function ChronicleSection({ accent }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div className="pix glow-ac" style={{ fontSize: 10 }}>◷ THE CHRONICLE</div>
      <div className="pix glow" style={{ fontSize: 20, color: '#fff', marginTop: 8, marginBottom: 16 }}>WHERE THE WORK HAPPENED</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {EXPERIENCE.map((e) => (
          <div key={e.id} style={{ border: '1.5px solid #2a3a32', padding: 12, background: '#05100b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div className="pix glow" style={{ fontSize: 12, color: '#fff' }}>{e.org}</div>
                <div className="pix glow-ac" style={{ fontSize: 8, marginTop: 6 }}>{e.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pix" style={{ fontSize: 9, color: accent.bright }}>{e.period}</div>
                <div className="pix" style={{ fontSize: 7.5, color: '#8a96a2', marginTop: 5 }}>{e.place}</div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {e.bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <span className="pix" style={{ fontSize: 8, color: accent.deep, flex: '0 0 auto', marginTop: 3 }}>◆</span>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#aeb8c2', lineHeight: 1.4 }}>{b}</span>
                </div>
              ))}
            </div>
            {e.link && (
              <a href={e.link[1]} target="_blank" rel="noreferrer" className="pix" style={{ display: 'inline-block', fontSize: 8, color: accent.bright, border: '1.5px solid ' + accent.deep, padding: '4px 9px', marginTop: 11, textDecoration: 'none' }}>{e.link[0]} ↗</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROJECT DETAIL ──────────────────────────────────────────────
export function ProjectPage({ project, accent }) {
  const os = useNav();
  const p = project;
  return (
    <PageColumn width={760}>
      <button onClick={() => os.navigate('grimoire')} className="pix" style={{ alignSelf: 'flex-start', fontSize: 9, padding: '5px 10px', cursor: 'pointer', color: accent.bright, background: 'transparent', border: '1.5px solid ' + accent.deep, marginBottom: 14 }}>← GRIMOIRE</button>
      {/* hero */}
      <div className="crt-screen" style={{ ...accentVars(accent), position: 'relative', border: '1.5px solid #cfd6dd', height: 300, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ProjectScene kind={p.scene} accent={accent} scale={4.6} basePrice={p.basePrice} />
        {p.hud.map(([txt, pos], i) => (
          <div key={i} className={'pix ' + (/◉/.test(txt) ? '' : 'glow-ac')} style={{ position: 'absolute', zIndex: 42, fontSize: pos.startsWith('b') ? 8 : 9, color: /◉/.test(txt) ? '#ff5470' : undefined, textShadow: /◉/.test(txt) ? '0 0 6px #ff5470' : undefined, ...hudPos(pos) }}>{txt}</div>
        ))}
      </div>
      {/* title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="pix glow" style={{ fontSize: 22, color: '#fff' }}>{p.title}</div>
            <StatusBadge status={p.status} accent={accent} />
          </div>
          <div className="pix glow-ac" style={{ fontSize: 9, marginTop: 8 }}>{p.cat} · {p.branch}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {p.links.length ? p.links.map(([l, href]) => (
            <a key={l} href={href} target="_blank" rel="noreferrer" className="pix" style={{ fontSize: 9, color: l.includes('▸') ? '#04110a' : accent.bright, background: l.includes('▸') ? accent.base : 'transparent', border: '1.5px solid ' + accent.deep, padding: '5px 10px', boxShadow: l.includes('▸') ? '0 0 10px ' + accent.glow : 'none', cursor: 'pointer', textDecoration: 'none' }}>{l}</a>
          )) : (
            // Honest about it rather than linking a repo that isn't ready to be read.
            <span className="pix" style={{ fontSize: 8, color: '#8a96a2', border: '1.5px solid #2a3a32', padding: '5px 10px' }}>PRIVATE REPO — HAPPY TO WALK THROUGH IT</span>
          )}
        </div>
      </div>
      {/* body */}
      <div style={{ display: 'flex', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px' }}>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#cdd6df', lineHeight: 1.5 }}>{p.desc}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>{p.chips.map((c) => <Chip key={c} accent={accent}>{c}</Chip>)}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>{p.media.map((m) => <Placeholder key={m} label={m} />)}</div>
        </div>
        <div style={{ flex: '1 1 220px' }}>
          <div className="pix" style={{ fontSize: 8, color: '#8a96a2', marginBottom: 10 }}>BY THE NUMBERS</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{p.metrics.map((m) => <Metric key={m[1]} m={m} accent={accent} />)}</div>
        </div>
      </div>
    </PageColumn>
  );
}

// ── SKILL TREE PAGE ─────────────────────────────────────────────
export function SpellsPage({ accent }) {
  const N = SKILL_NODES, E = SKILL_EDGES, LIT = SKILL_LIT;
  const [sel, setSel] = React.useState('mcp');
  const node = N[sel];
  const stMap = {
    mastered: { bg: accent.base, bd: accent.base, tx: '#04110a', g: accent.glow },
    proficient: { bg: 'color-mix(in srgb,' + accent.base + ' 26%, #04110a)', bd: accent.base, tx: '#fff', g: accent.glow },
    learning: { bg: '#04110a', bd: '#e8edf2', tx: '#fff', g: 'transparent' },
    planned: { bg: '#04110a', bd: '#52606b', tx: '#8a96a2', g: 'transparent' },
  };
  const lvl = { mastered: 100, proficient: 66, learning: 33, planned: 8 }[node.state];
  return (
    <PageColumn width={820}>
      <PageHead accent={accent} kicker="✦ THE SPELLBOOK" title="SKILL TREE" sub="Click a spell to inspect it. Lit paths are unlocked." />
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="crt-screen" style={{ ...accentVars(accent), position: 'relative', flex: '1 1 420px', height: 400, border: '1.5px solid #2a3a32', overflow: 'hidden' }}>
          <div className="pix" style={{ position: 'absolute', left: 16, top: 10, fontSize: 9, color: '#5d6b76', zIndex: 5 }}>WEB / PRODUCT</div>
          <div className="pix" style={{ position: 'absolute', left: 250, top: 10, fontSize: 9, color: '#5d6b76', zIndex: 5 }}>SYSTEMS / AI</div>
          <div className="pix" style={{ position: 'absolute', left: 415, top: 10, fontSize: 9, color: '#5d6b76', zIndex: 5 }}>ML / DELIVERY</div>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            {E.map(([a, b]) => {
              const k = a + '-' + b; const on = LIT.has(k);
              return <line key={k} x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y} stroke={on ? accent.base : '#324039'} strokeWidth={on ? 2 : 1.2} style={on ? { filter: 'drop-shadow(0 0 4px ' + accent.glow + ')' } : {}} />;
            })}
          </svg>
          {Object.entries(N).map(([id, n]) => {
            const s = stMap[n.state]; const active = id === sel;
            return (
              <div key={id} onClick={() => setSel(id)} className="pix" style={{ position: 'absolute', left: n.x, top: n.y, transform: 'translate(-50%,-50%)', zIndex: 4, cursor: 'pointer', background: s.bg, border: '1.5px solid ' + (active ? '#fff' : s.bd), color: s.tx, fontSize: 9, padding: '6px 9px', whiteSpace: 'nowrap', boxShadow: (active ? '0 0 0 2px ' + accent.base + ',' : '') + (s.g !== 'transparent' ? '0 0 12px ' + s.g : 'none') }}>{n.label}</div>
            );
          })}
        </div>
        {/* detail panel */}
        <div style={{ width: 240, flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ border: '1.5px solid #2a3a32', padding: 12 }}>
            <div className="pix glow" style={{ fontSize: 13, color: '#fff' }}>{node.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}><span className="pix" style={{ fontSize: 8, color: '#8a96a2' }}>LEVEL</span><span className="pix glow-ac" style={{ fontSize: 8 }}>{node.state.toUpperCase()}</span></div>
            <div style={{ height: 12, border: '1.5px solid #e8edf2', padding: 2, marginTop: 6 }}>{node.state === 'learning' ? <div className="pat-check" style={{ height: '100%', width: lvl + '%' }} /> : <i style={{ display: 'block', height: '100%', width: lvl + '%', background: accent.base, boxShadow: '0 0 8px ' + accent.glow }} />}</div>
          </div>
          <div style={{ border: '1.5px solid #2a3a32', padding: 12 }}>
            <div className="pix" style={{ fontSize: 8, color: '#8a96a2' }}>BRANCH</div>
            <div className="pix glow-ac" style={{ fontSize: 10, marginTop: 6 }}>{node.branch}</div>
            <div className="pix" style={{ fontSize: 8, color: '#8a96a2', marginTop: 12 }}>DESCRIPTION</div>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#cdd6df', lineHeight: 1.4, marginTop: 5 }}>{node.desc}</div>
          </div>
          <div style={{ border: '1.5px solid #2a3a32', padding: 12 }}>
            <div className="pix" style={{ fontSize: 8, color: '#8a96a2' }}>UNLOCKS</div>
            {node.unlocks.length ? node.unlocks.map((u) => <div key={u} className="pix glow-ac" style={{ fontSize: 9, marginTop: 6 }}>□ {u}</div>) : <div className="pix" style={{ fontSize: 9, color: '#52606b', marginTop: 6 }}>—</div>}
          </div>
        </div>
      </div>
    </PageColumn>
  );
}

// ── CONTACT ─────────────────────────────────────────────────────
export function ContactPage({ accent }) {
  const P = PROFILE;
  return (
    <PageColumn width={560}>
      <PageHead accent={accent} kicker="✉ SEND A RAVEN" title="CONTACT WIZARD" sub="Open to Applied AI / full-stack roles. Remote now, in Israel on arrival." />
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <div className="crt-screen" style={{ ...accentVars(accent), width: 130, height: 150, flex: '0 0 auto', border: '1.5px solid #1f2c25', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
          <PixelWizard accent={accent} mode="idle" scale={3} />
        </div>
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#cdd6df', lineHeight: 1.45 }}>{P.blurb}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <a href={'mailto:' + P.email} className="pix" style={{ fontSize: 10, color: '#04110a', background: accent.base, padding: '9px 14px', textDecoration: 'none', boxShadow: '0 0 12px ' + accent.glow, textAlign: 'center' }}>✉ {P.email}</a>
            <div style={{ display: 'flex', gap: 8 }}>
              {P.links.map(([l, href]) => (
                <a key={l} href={href} target="_blank" rel="noreferrer" className="pix" style={{ flex: 1, fontSize: 9, color: accent.bright, border: '1.5px solid ' + accent.deep, padding: '8px 12px', textDecoration: 'none', textAlign: 'center' }}>{l} ↗</a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ border: '1.5px solid #2a3a32', padding: 12, marginTop: 18 }}>
        <div className="pix" style={{ fontSize: 8, color: '#8a96a2' }}>AVAILABILITY</div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#cdd6df', marginTop: 7, lineHeight: 1.4 }}>
          Remote, immediately. In-country in Israel from arrival — I have Israeli work rights as an oleh, so there is no visa question to resolve.
        </div>
        <div className="pix glow-ac" style={{ fontSize: 9, marginTop: 10 }}>◢ {P.location}</div>
      </div>
    </PageColumn>
  );
}

// ── 404 DUEL ────────────────────────────────────────────────────
export function DuelPage({ accent }) {
  const os = useNav();
  const A = ACCENTS;
  return (
    <PageColumn width={620}>
      <div className="crt-screen" style={{ ...accentVars(A.amber), position: 'relative', border: '1.5px solid #2a3a32', height: 360, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 16, left: 18, zIndex: 34, width: 160 }}>
          <div className="pix" style={{ fontSize: 9, color: A.amber.bright }}>P1 · ARTUR</div>
          <div style={{ height: 9, border: '1.5px solid ' + A.amber.base, marginTop: 4 }}><i style={{ display: 'block', height: '100%', width: '88%', background: A.amber.base, boxShadow: '0 0 8px ' + A.amber.glow }} /></div>
        </div>
        <div style={{ position: 'absolute', top: 16, right: 18, zIndex: 34, width: 160, textAlign: 'right' }}>
          <div className="pix" style={{ fontSize: 9, color: A.cyan.bright }}>P2 · BUGS</div>
          <div style={{ height: 9, border: '1.5px solid ' + A.cyan.base, marginTop: 4 }}><i style={{ display: 'block', height: '100%', width: '46%', marginLeft: 'auto', background: A.cyan.base, boxShadow: '0 0 8px ' + A.cyan.glow }} /></div>
        </div>
        <div className="pix glow" style={{ position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', fontSize: 30, color: '#fff', zIndex: 34 }}>404</div>
        <div className="pix" style={{ position: 'absolute', top: 104, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#aeb8c2', zIndex: 34 }}>THIS PAGE WAS LOST TO THE VOID</div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, zIndex: 32, display: 'flex', justifyContent: 'center' }}>
          <PixelDuel left={A.amber} right={A.cyan} scale={5} />
        </div>
      </div>
      <button onClick={() => os.navigate('desktop')} className="pix" style={{ alignSelf: 'center', marginTop: 18, fontSize: 11, color: '#04110a', background: accent.base, border: 'none', padding: '9px 18px', cursor: 'pointer', boxShadow: '0 0 12px ' + accent.glow }}>▸ FIGHT BACK TO DESKTOP</button>
    </PageColumn>
  );
}

// ── layout helpers ──────────────────────────────────────────────
function PageColumn({ width, children }) {
  return <div style={{ width: '100%', maxWidth: width, margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>{children}</div>;
}
function PageHead({ kicker, title, sub, accent }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="pix glow-ac" style={{ fontSize: 10 }}>{kicker}</div>
      <div className="pix glow" style={{ fontSize: 26, color: '#fff', marginTop: 8 }}>{title}</div>
      {sub && <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#9fb0c0', marginTop: 8 }}>{sub}</div>}
    </div>
  );
}
