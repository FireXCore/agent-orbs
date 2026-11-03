import { useState } from 'react';
import { AgentOrb, AgentOrbLabel, ORB_STATES, InteractiveOrb, INTERACTIVE_ORB_STATES } from '../src';
import type { InteractiveOrbSize } from '../src';
import type { OrbState } from '../src';

const descriptions: Record<OrbState, string> = {
  working: 'Four precessing tracks with orbital wake highlights',
  searching: 'A geodetic globe with moving search illumination',
  solving: 'Particles align, disperse and reconstruct',
  listening: 'Pressure waves travel over latitude rings',
  connecting: 'An independent 3D graph activates its links',
  weaving: 'Three intertwined spirals exchange perspective',
  composing: 'Layered ribbons drift through a virtual volume',
  breathing: 'A softly expanding toroidal halo',
  shaping: 'An outline morphs across geometric primitives'
};
const statuses: Record<OrbState, string> = {
  working: 'Processing request', searching: 'Searching suppliers', solving: 'Validating results',
  listening: 'Listening to input', connecting: 'Connecting to API', weaving: 'Planning next steps',
  composing: 'Composing draft', breathing: 'Waiting for response', shaping: 'Building preview'
};

export function App() {
  const [dark, setDark] = useState(true);
  const [paused, setPaused] = useState(false);
  const [accent, setAccent] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<OrbState>('searching');
  const [contour, setContour] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [interactiveSize, setInteractiveSize] = useState<InteractiveOrbSize>(96);
  return <div className="site" data-theme={dark ? 'dark' : 'light'}>
    <div className="content">
      <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">✳</span> FireXCore <span> / AGENT ORBS</span></a><span className="version">v0.2.0 · TWO MOTION ENGINES</span></header>
      <section className="hero" id="top">
        <div className="eyebrow">MOTION SYSTEM / 001</div>
        <h1>A language for<br/><em>systems in motion.</em></h1>
        <p className="intro">Nine original procedural states plus an optional nine-state interactive contour family for assistants, agents and operational interfaces. Built with React, TypeScript and Canvas 2D — no WebGL, GIFs or external animation engines.</p>
        <div className="toolbar" aria-label="Preview controls">
          <button type="button" onClick={() => setDark(!dark)}>{dark ? 'Light mode' : 'Dark mode'}</button>
          <button type="button" onClick={() => setPaused(!paused)}>{paused ? 'Play motion' : 'Pause motion'}</button>
          <button type="button" onClick={() => setAccent(!accent)}>{accent ? 'Monochrome' : 'Accent color'}</button>
          <label className="speed">Speed <select value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
        </div>
      </section>
      <section aria-labelledby="gallery" className="gallery-section"><div className="section-title"><h2 id="gallery">01 / The collection</h2><span>76 PX / 24 PX</span></div>
        <div className="orb-grid">{ORB_STATES.map((state, index) => <button
          type="button" key={state} onClick={() => setSelected(state)} aria-pressed={selected === state}
          className={'orb-card' + (selected === state ? ' is-selected' : '')}>
          <div className="orb-preview"><div className="halo"><AgentOrb state={state} size="regular" theme="auto" paused={paused} speed={speed} accent={accent ? '#6fbcff' : undefined}/></div><span className="orb-tiny"><AgentOrb state={state} size="small" theme="auto" paused={paused} speed={speed} accent={accent ? '#6fbcff' : undefined}/></span></div>
          <div className="orb-meta"><span className="orb-number">{String(index + 1).padStart(2, '0')}</span><h3>{state}</h3><p>{descriptions[state]}</p></div>
        </button>)}</div>
      </section>
      <section className="integration" aria-labelledby="integrate"><div className="section-title"><h2 id="integrate">02 / Integration</h2><span>READY FOR RMS</span></div>
        <div className="integration-grid"><div className="live-example"><span className="eyebrow">ACTIVE STATE</span><div className="live-orb"><AgentOrb state={selected} size={112} theme="auto" paused={paused} speed={speed} accent={accent ? '#6fbcff' : undefined}/></div><AgentOrbLabel state={selected} theme="auto" paused={paused} speed={speed}>{statuses[selected]}</AgentOrbLabel><div className="live-foot">Live status preview — select a card above</div></div>
          <div className="code-panel"><span className="eyebrow">REACT / TYPESCRIPT</span><pre><code>{`import { AgentOrb, AgentOrbLabel } from '@firexcore/agent-orbs';\n\n<AgentOrb state="${selected}" size="regular" />\n\n<AgentOrbLabel state="${selected}">\n  ${statuses[selected]}\n</AgentOrbLabel>`}</code></pre><p>One shared animation clock. Offscreen pause. Reduced motion. High-DPI canvas. Accessible labels. Auto light/dark.</p></div></div>
      </section>
      <section className="gallery-section heritage-section" aria-labelledby="heritage-gallery">
        <div className="section-title"><h2 id="heritage-gallery">03 / Interactive contour family</h2><span>9 STATES / 2 VARIANTS / POINTER REACTIVE</span></div>
        <p className="heritage-intro">Optional MIT-licensed engine adapted from Schoolees/thinking-orbs. Original FireXCore states above are preserved. Try hovering or dragging over an orb.</p>
        <div className="toolbar heritage-toolbar">
          <button type="button" aria-pressed={contour} onClick={() => setContour(!contour)}>Style: {contour ? 'Contour' : 'Classic dots'}</button>
          <button type="button" aria-pressed={interactive} onClick={() => setInteractive(!interactive)}>Pointer: {interactive ? 'On' : 'Off'}</button>
          <label className="speed">Size <select value={interactiveSize} onChange={e => setInteractiveSize(Number(e.target.value) as InteractiveOrbSize)}>
            <option value="32">32px</option><option value="64">64px</option><option value="96">96px</option><option value="128">128px</option>
          </select></label>
        </div>
        <div className="orb-grid">{INTERACTIVE_ORB_STATES.map((state, index) =>
          <article key={state} className="orb-card heritage-card">
            <div className="orb-preview"><div className="heritage-halo">
              <InteractiveOrb state={state} size={interactiveSize} variant={contour ? 'contour' : 'classic'} theme="auto" interactive={interactive} paused={paused} speed={speed} />
            </div><span className="orb-tiny"><InteractiveOrb state={state} size={32} variant={contour ? 'contour' : 'classic'} theme="auto" paused={paused} speed={speed} /></span></div>
            <div className="orb-meta"><span className="orb-number">{String(index + 1).padStart(2, '0')}</span><h3>{state}</h3><p>{state === 'idle' ? 'Ready for input' : state === 'responding' ? 'Streaming the answer' : 'Motion-matched contour and dot treatments'}</p></div>
          </article>
        )}</div>
        <p className="heritage-credit">Adapted from <a href="https://github.com/Schoolees/thinking-orbs" target="_blank" rel="noreferrer">Schoolees/thinking-orbs</a> and the original work of Jakub Antalik (MIT).</p>
      </section>
      <footer><span>© 2026 FIREXCORE</span><span>ORIGINAL PROCEDURAL GEOMETRY · MIT</span></footer>
    </div>
  </div>;
}
