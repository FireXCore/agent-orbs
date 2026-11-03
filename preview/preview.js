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
let selectedOriginal = 'working', selectedContour = 'responding', variant = 'contour';
let featureState = 'responding', pointerEnabled = true;
let clock = 0, previous = 0;
const originalInstances = [];
const contourInstances = [];
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

featureInstance=new ThinkingOrb($('feature-orb'),{
  state:featureState,size:128,theme:'dark',variant,interactive:pointerEnabled,paused,speed
});

const palettes={dark:{ink:'#94d4ff',accent:'#be9bff'},light:{ink:'#1b4775',accent:'#6c42ba'}};
function drawOriginal(instance,time){
  if(!instance.visible||!instance.ctx)return;
  if(instance===integration && mode==='contour')return;
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
  mode=next;
  $('original-grid').hidden=next!=='original';
  $('contour-grid').hidden=next!=='contour';
  $('tab-original').classList.toggle('active',next==='original');
  $('tab-contour').classList.toggle('active',next==='contour');
  $('tab-original').setAttribute('aria-pressed',String(next==='original'));
  $('tab-contour').setAttribute('aria-pressed',String(next==='contour'));
  $('gallery-heading').textContent=next==='original'?'ORIGINAL CANVAS ENGINE':'INTERACTIVE CONTOUR FAMILY';
  $('gallery-count').textContent='09 STATES · '+(next==='original'?'ORIGINAL':'CLASSIC + CONTOUR');
  $('variant-control').style.display=next==='original'?'none':'flex';
  $('gallery-note').textContent=next==='original'
    ?'Original FireXCore engine: nine independently authored mathematical scenes, implemented with Canvas 2D. No WebGL or prerecorded animation.'
    :'Optional interactive engine, adapted under MIT from Schoolees/thinking-orbs and Jakub Antalik. Nine states, two visual variants and pointer/touch interaction.';
  syncIntegration();
}
$('tab-original').addEventListener('click',()=>switchMode('original'));
$('tab-contour').addEventListener('click',()=>switchMode('contour'));

function syncIntegration(){
  const canvas=$('integration-orb');
  if(integrationContour){integrationContour.destroy();integrationContour=null}
  if(mode==='original'){
    integration.state=selectedOriginal;
    integration.canvas.style.display='block';
    $('integration-label').textContent=messages[selectedOriginal];
  } else {
    integration.canvas.style.display='block';
    integrationContour=new ThinkingOrb(canvas,{
      state:selectedContour,size:128,theme:light?'light':'dark',variant,paused,speed,interactive:false
    });
    $('integration-label').textContent=messages[selectedContour];
  }
  writeCode();
}
function writeCode(){
  const state=mode==='original'?selectedOriginal:selectedContour;
  const value=mode==='original'
    ? "import { AgentOrb } from '@firexcore/agent-orbs';\n\n<AgentOrb\n  state=\""+state+"\"\n  size={96}\n  theme=\"auto\"\n  speed={1}\n/>"
    : "import { InteractiveOrb } from '@firexcore/agent-orbs';\n\n<InteractiveOrb\n  state=\""+state+"\"\n  variant=\""+variant+"\"\n  size={128}\n  interactive\n/>";
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
  if(integrationContour)integrationContour.setTheme(light?'light':'dark');
});
$('speed').addEventListener('change',e=>{
  speed=Number(e.target.value);
  contourInstances.forEach(({controller})=>controller.setSpeed(speed));
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
},{once:true});
switchMode('original');
