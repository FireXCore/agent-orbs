import { buildScene } from './core/scenes.js';
import { paint } from './core/render.js';
import { ORB_STATES } from './core/core-types.js';
import { ThinkingOrb, ORB_STATES as CONTOUR_STATES } from './heritage/index.js';

const $ = id => document.getElementById(id);
const descriptions = {
  working: 'Precessing orbital tracks in continuous motion',
  searching: 'A geodetic globe illuminated by a traveling scan',
  solving: 'A dispersed particle lattice finds its structure',
  listening: 'Pressure waves across a spherical lattice',
  connecting: 'Live links form between spatial nodes',
  weaving: 'Three threads spiral through perspective',
  composing: 'Layered ribbons flow like evolving ideas',
  breathing: 'A quiet toroidal halo gently expands',
  shaping: 'Fluid transition across geometric contours',
  idle: 'Ready for the next interaction',
  responding: 'Streaming an answer and revealing structure'
};
const messages = {
  working:'PROCESSING',searching:'SEARCHING',solving:'ANALYZING',
  listening:'LISTENING',connecting:'CONNECTING',weaving:'PLANNING',
  composing:'COMPOSING',breathing:'WAITING',shaping:'SHAPING',
  idle:'READY',responding:'RESPONDING'
};
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedQuery.matches;
let mode = 'original', light = false, paused = false, speed = 1;
let selectedOriginal = 'working', selectedContour = 'responding', selectedMono = 'listening', variant = 'contour';
let featureState = 'responding', pointerEnabled = true;
let clock = 0, previous = 0;
const originalInstances = [];
const contourInstances = [];
const monoInstances = [];
let monoInitialized = false;
const MONO_SIZES = [128, 96, 64, 32];
let featureInstance = null;
let integrationContour = null;

function originalInstance(canvas, state, size, options={}) {
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = Math.round(size*dpr); canvas.height = Math.round(size*dpr);
  canvas.style.width = size+'px'; canvas.style.height = size+'px';
  const instance = {canvas, state, size, dpr, fixedDark: !!options.fixedDark, visible:true, ctx:canvas.getContext('2d')};
  originalInstances.push(instance);
  return instance;
}
const hero = originalInstance($('hero-orb'), selectedOriginal, 248, {fixedDark:true});
const integration = originalInstance($('integration-orb'), selectedOriginal, 152);
const intersection = typeof IntersectionObserver === 'undefined' ? null :
  new IntersectionObserver(entries => entries.forEach(entry => {
    const item = originalInstances.find(instance => instance.canvas === entry.target);
    if(item)item.visible = entry.isIntersecting;
  }),{rootMargin:'50px'});
function watch(instance){intersection?.observe(instance.canvas);}

function makeOriginalCard(state,index) {
  const card = document.createElement('button');
  card.type='button';card.className='orb-card';
  card.dataset.state=state;
  card.setAttribute('aria-pressed',String(state===selectedOriginal));
  card.innerHTML = '<div class="orb-art"><span class="card-index">'+String(index+1).padStart(2,'0')+' / 09</span>'+
    '<span class="card-mark">ORIGINAL</span><canvas aria-hidden="true"></canvas></div>'+
    '<div class="orb-meta"><div><h3>'+state+'</h3><p>'+descriptions[state]+'</p></div><span class="chevron" aria-hidden="true">↗</span></div>';
  const orb = originalInstance(card.querySelector('canvas'),state,156);
  watch(orb);
  card.addEventListener('click',()=>{
    selectedOriginal=state;hero.state=state;
    $('hero-status').textContent=messages[state];
    hero.canvas.setAttribute('aria-label','Live animated '+state+' orb');
    document.querySelectorAll('#original-grid .orb-card').forEach(el=>{
      const active=el.dataset.state===state;
      el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));
    });
    if(mode==='original')syncIntegration();
  });
  if(state===selectedOriginal)card.classList.add('active');
  return card;
}
ORB_STATES.forEach((state,i)=>$('original-grid').appendChild(makeOriginalCard(state,i)));
watch(hero);watch(integration);

function makeContourCard(state,index) {
  const card=document.createElement('button');
  card.type='button';card.className='orb-card';
  card.dataset.state=state;
  card.setAttribute('aria-pressed',String(state===selectedContour));
  card.innerHTML='<div class="orb-art"><span class="card-index">'+String(index+1).padStart(2,'0')+' / 09</span>'+
    '<span class="card-mark">INTERACTIVE</span><canvas aria-hidden="true"></canvas></div>'+
    '<div class="orb-meta"><div><h3>'+state+'</h3><p>'+descriptions[state]+'</p></div><span class="chevron" aria-hidden="true">↗</span></div>';
  const canvas=card.querySelector('canvas');
  const controller=new ThinkingOrb(canvas,{state,size:128,theme:'dark',variant,interactive:true,paused,speed});
  contourInstances.push({state,controller});
  card.addEventListener('click',()=>{
    selectedContour=state;
    document.querySelectorAll('#contour-grid .orb-card').forEach(el=>{
      const active=el.dataset.state===state;
      el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));
    });
    if(mode==='contour')syncIntegration();
  });
  if(state===selectedContour)card.classList.add('active');
  return card;
}
CONTOUR_STATES.forEach((state,i)=>$('contour-grid').appendChild(makeContourCard(state,i)));

/** A third *visual family*, not another rendering engine. Uses the exact classic
 * profiles from Schoolees/thinking-orbs, retained under MIT in src/heritage.
 * Each canvas is rendered at its native size with its own density preset.
 */
function makeMonoCard(state,index) {
  const card=document.createElement('button');
  card.type='button';card.className='mono-card';
  card.dataset.state=state;
  card.setAttribute('aria-pressed',String(state===selectedMono));
  const badge=document.createElement('span');
  badge.className='mono-index';
  badge.textContent=String(index+1).padStart(2,'0')+' / 09';
  const gallery=document.createElement('div');
  gallery.className='mono-sizes';
  for(const size of MONO_SIZES) {
    const cell=document.createElement('div');
    cell.className='mono-size-cell';
    const canvas=document.createElement('canvas');
    canvas.setAttribute('aria-label',state+' — native '+size+' pixel monochrome lattice orb');
    canvas.style.filter='none';
    canvas.style.transform='none';
    cell.appendChild(canvas);
    const label=document.createElement('small');
    label.textContent=size+'px';
    cell.appendChild(label);
    gallery.appendChild(cell);
    const controller=new ThinkingOrb(canvas,{
      state,size,theme:light?'light':'dark',variant:'classic',
      speed,paused,interactive:true
    });
    monoInstances.push({state,size,controller});
  }
  const details=document.createElement('div');
  details.className='mono-details';
  const heading=document.createElement('h3');
  heading.textContent=state[0].toUpperCase()+state.slice(1);
  const config=document.createElement('code');
  config.textContent='state="'+state+'" · variant="classic"';
  details.append(heading,config);
  card.append(badge,gallery,details);
  card.addEventListener('click',()=>{
    selectedMono=state;
    document.querySelectorAll('#mono-grid .mono-card').forEach(el=>{
      const active=el.dataset.state===state;
      el.classList.toggle('active',active);
      el.setAttribute('aria-pressed',String(active));
    });
    if(mode==='mono')syncIntegration();
  });
  if(state===selectedMono)card.classList.add('active');
  return card;
}
function ensureMonoGallery() {
  if(monoInitialized)return;
  monoInitialized=true;
  CONTOUR_STATES.forEach((state,i)=>$('mono-grid').appendChild(makeMonoCard(state,i)));
}


featureInstance=new ThinkingOrb($('feature-orb'),{
  state:featureState,size:128,theme:'dark',variant,interactive:pointerEnabled,paused,speed
});

const palettes={dark:{ink:'#94d4ff',accent:'#be9bff'},light:{ink:'#1b4775',accent:'#6c42ba'}};
function drawOriginal(instance,time){
  if(!instance.visible||!instance.ctx)return;
  if(instance===integration && mode!=='original')return;
  const palette=palettes[instance.fixedDark?'dark':light?'light':'dark'];
  const {ctx,dpr,size,state}=instance;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.shadowBlur=0;
  paint(ctx,buildScene(state,time,size<40),{diameter:size,ink:palette.ink,accent:palette.accent});
}
function frame(now) {
  const delta=previous?Math.min(.06,(now-previous)/1000):0;
  previous=now;
  if(!paused&&!reduced&&!document.hidden)clock+=delta*speed;
  if(!document.hidden)originalInstances.forEach(instance=>drawOriginal(instance,reduced?.7:clock));
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function switchMode(next){
  if(!['original','contour','mono'].includes(next))throw new TypeError('Unknown orb family');
  if(next==='mono')ensureMonoGallery();
  mode=next;
  $('original-grid').hidden=next!=='original';
  $('contour-grid').hidden=next!=='contour';
  $('mono-grid').hidden=next!=='mono';
  $('mono-intro').hidden=next!=='mono';
  for(const family of ['original','contour','mono']) {
    const tab=$('tab-'+family);
    tab.classList.toggle('active',next===family);
    tab.setAttribute('aria-pressed',String(next===family));
  }
  const names={original:'ORIGINAL CANVAS ENGINE',contour:'INTERACTIVE CONTOUR FAMILY',mono:'MONO LATTICE · ORIGINAL HALFTONE DOTS'};
  $('gallery-heading').textContent=names[next];
  $('gallery-count').textContent=next==='mono'?'09 STATES · 04 NATIVE SIZES':'09 STATES · '+(next==='original'?'ORIGINAL':'CONTOUR + CLASSIC');
  $('variant-control').hidden=next!=='contour';
  const notes={
    original:'Original FireXCore engine: nine independently authored mathematical scenes, implemented with Canvas 2D. No WebGL or prerecorded animation.',
    contour:'Optional interactive contour family, adapted under MIT from Schoolees/thinking-orbs and Jakub Antalik.',
    mono:'Mono Lattice uses the upstream classic monochrome dot renderer and native state/size-specific presets (128, 96, 64, 32px). No FireXCore color palette, glow, resizing, or contour substitution. MIT attribution preserved.'
  };
  $('gallery-note').textContent=notes[next];
  syncIntegration();
}
$('tab-original').addEventListener('click',()=>switchMode('original'));
$('tab-contour').addEventListener('click',()=>switchMode('contour'));
$('tab-mono').addEventListener('click',()=>switchMode('mono'));

function syncIntegration(){
  const canvas=$('integration-orb');
  if(integrationContour){integrationContour.destroy();integrationContour=null}
  const host=canvas.closest('.integration-preview');
  if(host)host.dataset.orbFamily=mode;
  if(mode==='original'){
    // Restore the original 152px high-DPI backing store after a heritage controller.
    canvas.width=Math.round(152*integration.dpr);
    canvas.height=Math.round(152*integration.dpr);
    canvas.style.width='152px';
    canvas.style.height='152px';
    integration.state=selectedOriginal;
    $('integration-label').textContent=messages[selectedOriginal];
  } else {
    const state=mode==='mono'?selectedMono:selectedContour;
    integrationContour=new ThinkingOrb(canvas,{
      state,size:128,theme:light?'light':'dark',
      variant:mode==='mono'?'classic':variant,
      paused,speed,interactive:false
    });
    $('integration-label').textContent=messages[state];
  }
  canvas.style.display='block';
  writeCode();
}
function writeCode(){
  let value;
  if(mode==='original') {
    value="import { AgentOrb } from '@firexcore/agent-orbs';\n\n<AgentOrb\n  state=\""+selectedOriginal+"\"\n  size={96}\n  theme=\"auto\"\n  speed={1}\n/>";
  } else if(mode==='mono') {
    value="import { MonoLatticeOrb } from '@firexcore/agent-orbs';\n\n<MonoLatticeOrb\n  state=\""+selectedMono+"\"\n  size={128} // also 96, 64, 32\n  theme=\"auto\"\n  interactive\n/>";
  } else {
    value="import { InteractiveOrb } from '@firexcore/agent-orbs';\n\n<InteractiveOrb\n  state=\""+selectedContour+"\"\n  variant=\""+variant+"\"\n  size={128}\n  interactive\n/>";
  }
  $('code-example').textContent=value;
}
$('copy-code').addEventListener('click',async()=>{
  const content=$('code-example').textContent;
  const button=$('copy-code');
  try{
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(content)}
    else {
      const field=document.createElement('textarea');field.value=content;field.style.position='fixed';field.style.opacity='0';
      document.body.appendChild(field);field.select();
      if(!document.execCommand('copy'))throw new Error('Copy unsupported');
      field.remove();
    }
    button.textContent='Copied';
  }catch{button.textContent='Select code to copy'}
  window.setTimeout(()=>button.textContent='Copy code',1700);
});
$('theme').addEventListener('change',e=>{
  light=e.target.value==='light';document.body.dataset.theme=light?'light':'dark';
  contourInstances.forEach(({controller})=>controller.setTheme(light?'light':'dark'));
  monoInstances.forEach(({controller})=>controller.setTheme(light?'light':'dark'));
  if(integrationContour)integrationContour.setTheme(light?'light':'dark');
});
$('speed').addEventListener('change',e=>{
  speed=Number(e.target.value);
  contourInstances.forEach(({controller})=>controller.setSpeed(speed));
  monoInstances.forEach(({controller})=>controller.setSpeed(speed));
  featureInstance.setSpeed(speed);
  integrationContour?.setSpeed(speed);
});
$('variant').addEventListener('change',e=>{
  variant=e.target.value;
  contourInstances.forEach(({controller})=>controller.setVariant(variant));
  featureInstance.setVariant(variant);
  integrationContour?.setVariant(variant);
  writeCode();
});
$('pause').addEventListener('click',()=>{
  paused=!paused;
  $('pause').setAttribute('aria-pressed',String(paused));
  $('pause').innerHTML='<span id="pause-icon">'+(paused?'▶':'Ⅱ')+'</span> '+(paused?'Resume':'Pause');
  contourInstances.forEach(({controller})=>paused?controller.pause():controller.resume());
  monoInstances.forEach(({controller})=>paused?controller.pause():controller.resume());
  paused?featureInstance.pause():featureInstance.resume();
  if(integrationContour)paused?integrationContour.pause():integrationContour.resume();
});
$('feature-state').addEventListener('change',e=>{
  featureState=e.target.value;featureInstance.setState(featureState);
  $('feature-state-text').textContent=messages[featureState];
  $('feature-orb').setAttribute('aria-label','Interactive '+featureState+' orb');
});
$('pointer').addEventListener('change',e=>{
  pointerEnabled=e.target.checked;featureInstance.setInteractive(pointerEnabled);
});
reducedQuery.addEventListener?.('change',e=>{
  reduced=e.matches;
  if(reduced)clock=.7;
});
window.addEventListener('pagehide',()=>{
  intersection?.disconnect();
  featureInstance?.destroy();
  integrationContour?.destroy();
  contourInstances.forEach(({controller})=>controller.destroy());
  monoInstances.forEach(({controller})=>controller.destroy());
},{once:true});
switchMode('original');
