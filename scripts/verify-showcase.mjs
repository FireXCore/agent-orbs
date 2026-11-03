import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ORB_STATES } from '../preview/core/core-types.js';
const html=readFileSync(new URL('../preview/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../preview/preview.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../preview/styles.css',import.meta.url),'utf8');
const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
for(const id of ['hero-orb','original-grid','contour-grid','feature-orb','integration-orb','theme','speed','pause','variant','copy-code','feature-state','pointer']){
  assert(html.includes('id="'+id+'"'), 'Missing live control: '+id);
}
assert.equal(ORB_STATES.length,9);
assert(js.includes("from './core/scenes.js'"),'Demo must use canonical original engine');
assert(js.includes("from './heritage/index.js'"),'Demo must use licensed contour engine');
assert(css.includes('@media(prefers-reduced-motion:reduce)'), 'Reduced-motion styles missing');
assert(css.includes('@media(max-width:580px)'), 'Mobile responsive styles missing');
assert(readme.includes('assets/showcase.svg'), 'README hero missing');
assert(readme.includes('assets/motion-preview.gif'), 'README motion GIF reference missing');
assert(existsSync(new URL('../assets/showcase.svg',import.meta.url)), 'Illustrative SVG missing');
execFileSync(process.execPath,['--check',new URL('../preview/preview.js',import.meta.url).pathname],{stdio:'inherit'});
console.log('PASS: showcase DOM, controls, sources, responsive styling and JS syntax');
