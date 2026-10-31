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
