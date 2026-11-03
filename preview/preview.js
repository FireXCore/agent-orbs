import { buildScene } from './core/scenes.js';
import { paint } from './core/render.js';
import { ORB_STATES } from './core/core-types.js';

const desc = {
  working: 'Four precessing tracks with orbital wake highlights',
  searching: 'Geodetic points reveal a traveling scan',
  solving: 'Particle lattice disperses and reconstructs',
  listening: 'Pressure waves cross concentric rings',
  connecting: 'A 3D graph activates its connections',
  weaving: 'Three spiral threads wrap a volume',
  composing: 'Layered ribbons undulate in sequence',
  breathing: 'A soft toroidal halo expands and contracts',
  shaping: 'Geometric outlines transition continuously'
};
const phrases = {
  working:'Processing request', searching:'Searching suppliers', solving:'Validating results',
  listening:'Listening to input', connecting:'Connecting to API', weaving:'Planning next steps',
  composing:'Composing draft', breathing:'Waiting for response', shaping:'Building preview'
};
const root = document.getElementById('app');
const grid = document.getElementById('grid');
const feature = document.getElementById('feature');
const instances = [];
let light = false, paused = false, accent = false, speed = 1, selected = 'searching';
let reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', e => reduced = e.matches);
function add(canvas, state, diameter, compact){
  const dpr = Math.min(2,window.devicePixelRatio||1);
  canvas.width = Math.round(diameter*dpr);canvas.height = Math.round(diameter*dpr);
  canvas.style.width=diameter+'px';canvas.style.height=diameter+'px';
  instances.push({canvas,state,diameter,compact,dpr,visible:true});
}
for(const [i,state] of ORB_STATES.entries()) {
  const card=document.createElement('button');card.type='button';card.className='card'+(state===selected?' selected':'');card.dataset.state=state;
  card.innerHTML=`<div class="stage"><canvas class="big" aria-hidden="true"></canvas><canvas class="small" aria-hidden="true"></canvas></div><div class="meta"><small>${String(i+1).padStart(2,'0')}</small><div><b>${state}</b><p>${desc[state]}</p></div></div>`;
  const big=card.querySelector('.big'), small=card.querySelector('.small');
  add(big,state,76,false);add(small,state,24,true);
  card.addEventListener('click',()=>{selected=state;document.getElementById('status').textContent=phrases[state];document.querySelectorAll('.card').forEach(x=>x.classList.toggle('selected',x.dataset.state===state));draw(performance.now()/1000);});
  grid.appendChild(card);
}
add(feature,selected,112,false);
const io=new IntersectionObserver(entries=>entries.forEach(e=>{const inst=instances.find(x=>x.canvas===e.target);if(inst)inst.visible=e.isIntersecting;}));
instances.forEach(i=>io.observe(i.canvas));
function draw(t){
  const ink=light?'#202c3b':'#eef4ff';
  for(const i of instances){
    if(!i.visible)continue;
    if(i.canvas===feature)i.state=selected;
    const ctx=i.canvas.getContext('2d');if(!ctx)continue;
    ctx.setTransform(i.dpr,0,0,i.dpr,0,0);
    paint(ctx, buildScene(i.state,reduced?0.7:t*speed,i.compact),{diameter:i.diameter,ink,accent:accent?'#55b3ff':ink});
  }
}
let frozenTime=0;
function animate(ms){ if(!paused&&!reduced)frozenTime=ms/1000; if(!document.hidden)draw(frozenTime);requestAnimationFrame(animate);}
requestAnimationFrame(animate);
const themeButton=document.getElementById('theme');themeButton.onclick=()=>{light=!light;root.classList.toggle('light',light);themeButton.textContent=light?'Dark mode':'Light mode';draw(frozenTime);};
const pauseButton=document.getElementById('pause');pauseButton.onclick=()=>{paused=!paused;pauseButton.textContent=paused?'Play motion':'Pause motion';};
const accentButton=document.getElementById('accent');accentButton.onclick=()=>{accent=!accent;accentButton.textContent=accent?'Monochrome':'Accent color';draw(frozenTime);};
const speedButton=document.getElementById('speed');speedButton.onclick=()=>{speed=speed===1?1.5:speed===1.5?2:speed===2?0.5:1;speedButton.textContent=`Speed ${speed}×`;};

/** MIT-licensed optional family: Schoolees/thinking-orbs; see third_party/thinking-orbs/NOTICE.md. */
import { ThinkingOrb, ORB_STATES as INTERACTIVE_STATES } from './heritage/index.js';

const heritageSection = document.createElement('section');
heritageSection.className = 'heritage';
heritageSection.innerHTML = `<div class="header"><span>03 / INTERACTIVE CONTOUR FAMILY</span><span>9 STATES / TWO STYLES / FOUR SIZES</span></div>
  <p class="heritage-intro">A separately licensed, optional contour and dot family. Hover or drag to deform an orb. The original FireXCore geometry above remains unchanged.</p>
  <div class="heritage-tools">
    <button type="button" id="heritage-variant">Style: Contour</button>
    <button type="button" id="heritage-pointer">Pointer: On</button>
    <button type="button" id="heritage-size">Size: 96px</button>
  </div>
  <div class="grid" id="heritage-grid"></div>
  <p class="heritage-credit">MIT adaptation of <a href="https://github.com/Schoolees/thinking-orbs" target="_blank" rel="noopener noreferrer">Schoolees/thinking-orbs</a>, derived from Jakub Antalik's work.</p>`;
root.insertBefore(heritageSection, root.querySelector('footer'));
const heritageGrid = document.getElementById('heritage-grid');
const heritageOrbs = [];
let heritageVariant = 'contour', heritagePointer = true, heritageSize = 96;
for (const [i, state] of INTERACTIVE_STATES.entries()) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `<div class="stage"><canvas class="heritage-main" aria-hidden="true"></canvas><canvas class="heritage-tiny" aria-hidden="true"></canvas></div><div class="meta"><small>${String(i + 1).padStart(2,'0')}</small><div><b>${state}</b><p>${state==='idle' ? 'Ready for input' : state==='responding' ? 'Streaming response' : 'Classic particles or motion-matched contours'}</p></div></div>`;
  heritageGrid.appendChild(card);
  const main = card.querySelector('.heritage-main');
  const tiny = card.querySelector('.heritage-tiny');
  main.style.maxWidth = '128px';
  main.style.maxHeight = '128px';
  tiny.style.position = 'absolute';
  tiny.style.top = '14px';
  tiny.style.right = '14px';
  tiny.style.opacity = '0.85';
  heritageOrbs.push({
    state, main: new ThinkingOrb(main, { state, size: heritageSize, variant: heritageVariant, interactive: heritagePointer, theme: light ? 'light' : 'dark', paused, speed }),
    tiny: new ThinkingOrb(tiny, { state, size: 32, variant: heritageVariant, theme: light ? 'light' : 'dark', paused, speed })
  });
}
function syncHeritage() {
  for (const item of heritageOrbs) {
    item.main.update({variant:heritageVariant,interactive:heritagePointer,size:heritageSize,paused,speed,theme:light?'light':'dark'});
    item.tiny.update({variant:heritageVariant,paused,speed,theme:light?'light':'dark'});
  }
}
document.getElementById('heritage-variant').onclick = () => {
  heritageVariant = heritageVariant === 'contour' ? 'classic' : 'contour';
  document.getElementById('heritage-variant').textContent = 'Style: ' + (heritageVariant === 'contour' ? 'Contour' : 'Classic dots');
  syncHeritage();
};
document.getElementById('heritage-pointer').onclick = () => {
  heritagePointer = !heritagePointer;
  document.getElementById('heritage-pointer').textContent = 'Pointer: ' + (heritagePointer ? 'On' : 'Off');
  syncHeritage();
};
document.getElementById('heritage-size').onclick = () => {
  heritageSize = ({32:64,64:96,96:128,128:32})[heritageSize];
  document.getElementById('heritage-size').textContent = 'Size: ' + heritageSize + 'px';
  syncHeritage();
};
themeButton.addEventListener('click', syncHeritage);
pauseButton.addEventListener('click', syncHeritage);
speedButton.addEventListener('click', syncHeritage);
window.addEventListener('pagehide', () => { for(const item of heritageOrbs){item.main.destroy();item.tiny.destroy();} }, {once:true});
