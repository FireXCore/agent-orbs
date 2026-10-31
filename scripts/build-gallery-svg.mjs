import { writeFileSync } from 'node:fs';
import { buildScene } from '../preview/core/scenes.js';
import { ORB_STATES } from '../preview/core/core-types.js';
const W = 1000, H = 660;
const tileW = 308, tileH = 188, left = 18, top = 80, space = 16;
let markup = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,`<rect width="100%" height="100%" fill="#0c1017"/>`,`<text x="22" y="35" fill="#f0f4fa" font-size="21" font-family="Arial,sans-serif" font-weight="700">FireXCore / Agent Orbs</text>`,`<text x="22" y="57" fill="#8595a8" font-family="Arial,sans-serif" font-size="11">NINE PROCEDURAL STATES  /  ORIGINAL CANVAS ENGINE</text>`];
for (let i = 0; i < ORB_STATES.length; i++) {
  const state = ORB_STATES[i], col = i % 3, row = Math.floor(i / 3);
  const x = left+col*(tileW+space), y=top+row*(tileH+space);
  markup.push(`<rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="9" fill="#141b25" stroke="#2b3747"/>`);
  const frame = buildScene(state, 1.9, false);
  const centerX=x+tileW/2, centerY=y+80, radius=57;
  const project=d=>({x:centerX+d.x*radius*(2.9/(2.9-d.z*.45)), y:centerY+d.y*radius*(2.9/(2.9-d.z*.45))});
  for(const seg of frame.lines){ const a=project(seg.a), b=project(seg.b); markup.push(`<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="#cdd8e8" stroke-opacity="${Math.min(1,seg.opacity*.85).toFixed(2)}" stroke-width=".7"/>`); }
  for(const d of frame.dots.sort((a,b)=>a.z-b.z)) {
    const p=project(d), depth=Math.max(0,Math.min(1,(d.z+1)/2)), opacity=Math.max(.04,Math.min(1,d.a*(.3+depth*.7)));
    const r=Math.max(.55, (1.05*d.r*(.68+depth*.55)*2.9/(2.9-d.z*.45)));
    markup.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(2)}" fill="${d.hot>.32?'#94cfff':'#e9f0fc'}" fill-opacity="${opacity.toFixed(2)}"/>`);
  }
  markup.push(`<text x="${x+16}" y="${y+166}" fill="#dbe7f6" font-family="Arial,sans-serif" font-weight="600" font-size="15">${state[0].toUpperCase()+state.slice(1)}</text>`,`<text x="${x+tileW-16}" y="${y+166}" text-anchor="end" fill="#65798f" font-family="Arial,sans-serif" font-size="10">${String(i+1).padStart(2,'0')} / 09</text>`);
}
markup.push(`</svg>`);
writeFileSync(new URL('../assets/gallery.svg',import.meta.url),markup.join('\n'));
console.log('Wrote assets/gallery.svg');
