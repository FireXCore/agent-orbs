/**
 * Renders a real animated contact sheet from FireXCore's original scene engine.
 * Output: PPM frames for ffmpeg; zero JS runtime dependencies.
 * Usage: node scripts/render-motion-frames.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildScene } from '../preview/core/scenes.js';
const W=840, H=255, FRAMES=30, OUT='artifacts/motion-frames';
const STATES=['working','searching','connecting','composing'];
const CENTERS=[105,315,525,735];
const font={
A:['01110','10001','10001','11111','10001','10001','10001'],
B:['11110','10001','10001','11110','10001','10001','11110'],
C:['01111','10000','10000','10000','10000','10000','01111'],
D:['11110','10001','10001','10001','10001','10001','11110'],
E:['11111','10000','10000','11110','10000','10000','11111'],
F:['11111','10000','10000','11110','10000','10000','10000'],
G:['01111','10000','10000','10111','10001','10001','01111'],
H:['10001','10001','10001','11111','10001','10001','10001'],
I:['11111','00100','00100','00100','00100','00100','11111'],
K:['10001','10010','10100','11000','10100','10010','10001'],
L:['10000','10000','10000','10000','10000','10000','11111'],
M:['10001','11011','10101','10101','10001','10001','10001'],
N:['10001','11001','10101','10011','10001','10001','10001'],
O:['01110','10001','10001','10001','10001','10001','01110'],
P:['11110','10001','10001','11110','10000','10000','10000'],
R:['11110','10001','10001','11110','10100','10010','10001'],
S:['01111','10000','10000','01110','00001','00001','11110'],
T:['11111','00100','00100','00100','00100','00100','00100'],
V:['10001','10001','10001','10001','10001','01010','00100'],
W:['10001','10001','10001','10101','10101','10101','01010'],
' ':['00000','00000','00000','00000','00000','00000','00000']
};
mkdirSync(OUT,{recursive:true});
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const img=new Uint8Array(W*H*3);
function put(x,y,rgb,a=1) {
  x=Math.round(x);y=Math.round(y);
  if(x<0||y<0||x>=W||y>=H||a<=0)return;
  const p=(y*W+x)*3, inv=1-clamp(a);
  img[p]=img[p]*inv+rgb[0]*a;
  img[p+1]=img[p+1]*inv+rgb[1]*a;
  img[p+2]=img[p+2]*inv+rgb[2]*a;
}
function rect(x,y,w,h,rgb,a=1){
  for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++)put(xx,yy,rgb,a);
}
function circle(cx,cy,rad,rgb,alpha){
  const limit=rad+3, minX=Math.floor(cx-limit),maxX=Math.ceil(cx+limit);
  for(let y=Math.floor(cy-limit);y<=Math.ceil(cy+limit);y++)
  for(let x=minX;x<=maxX;x++){
    let dist=Math.hypot(x-cx,y-cy), edge=Math.max(0,Math.min(1,rad+.75-dist));
    let halo=Math.exp(-Math.pow(dist/Math.max(1.2,rad+2.5),2)*3)*.13;
    if(edge||halo)put(x,y,rgb,alpha*(edge+halo));
  }
}
function line(x1,y1,x2,y2,rgb,a=.22){
  let n=Math.ceil(Math.hypot(x2-x1,y2-y1));
  for(let j=0;j<=n;j++){let t=j/Math.max(1,n);put(x1+(x2-x1)*t,y1+(y2-y1)*t,rgb,a);}
}
function text(str,x,y,scale=2,rgb=[198,225,255]){
  let s=String(str).toUpperCase();
  for(const char of s){
    const glyph=font[char]||font[' '];
    glyph.forEach((row,iy)=>{for(let ix=0;ix<5;ix++)if(row[ix]==='1')
      rect(x+ix*scale,y+iy*scale,scale,scale,rgb,.95);
    });
    x+=scale*6;
  }
}
function project(d,cx,radius){
  const p=2.9/(2.9-d.z*.45);
  return [cx+d.x*radius*p,109+d.y*radius*p];
}
for(let frame=0;frame<FRAMES;frame++){
  const t=.20+frame/12;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=(y*W+x)*3, fade=.15*Math.max(0,1-Math.abs(x-W/2)/(W/2));
    img[i]=7+Math.round(fade*12);img[i+1]=13+Math.round(fade*13);img[i+2]=26+Math.round(fade*32);
  }
  rect(0,0,W,2,[49,105,172],.8);
  STATES.forEach((state,i)=>{
    const cx=CENTERS[i], left=cx-100;
    rect(left,18,1,212,[70,117,177],.28);
    rect(left+199,18,1,212,[70,117,177],.28);
    rect(left,18,200,1,[70,117,177],.28);
    rect(left,230,200,1,[70,117,177],.28);
    const scene=buildScene(state,t,false),radius=69;
    // Faint color glow at the base of each living canvas orb.
    for(let y=179;y<198;y++)for(let x=cx-49;x<cx+49;x++){
      const k=Math.exp(-Math.pow((x-cx)/34,2)-Math.pow((y-190)/5.6,2));
      if(k>.015)put(x,y,[42,122,240],k*.12);
    }
    for(const seg of scene.lines){
      const [x1,y1]=project(seg.a,cx,radius),[x2,y2]=project(seg.b,cx,radius);
      line(x1,y1,x2,y2,[91,151,225],clamp(seg.opacity*.68));
    }
    const ordered=[...scene.dots].sort((a,b)=>a.z-b.z);
    for(const d of ordered){
      const [x,y]=project(d,cx,radius);
      const depth=clamp((d.z+1)/2),alpha=clamp(d.a*(.3+depth*.7));
      const rgb=d.hot>.32?[171,157,255]:[121,202,255];
      const rad=Math.max(.52,1.15*d.r*(.68+depth*.55));
      circle(x,y,rad,rgb,alpha*.92);
    }
    text(state,cx-state.length*6,206,2,[227,240,255]);
  });
  const head=Buffer.from('P6\n'+W+' '+H+'\n255\n','ascii');
  writeFileSync(OUT+'/'+String(frame+1).padStart(3,'0')+'.ppm',Buffer.concat([head,Buffer.from(img)]));
}
console.log('Rendered '+FRAMES+' frames from the original FireXCore Canvas scene geometry: '+OUT);
