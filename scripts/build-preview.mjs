import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(root, 'preview/core'), { recursive: true });
const tsc = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
execFileSync(tsc, [
  '--target','ES2020','--module','ES2020','--moduleResolution','bundler',
  '--outDir','preview/core','--rootDir','src','--skipLibCheck','--strict',
  'src/geometry.ts','src/core-types.ts','src/scenes.ts','src/render.ts'
], { cwd: root, stdio: 'inherit' });
for (const file of readdirSync(resolve(root, 'preview/core')).filter(x => x.endsWith('.js'))) {
  const path = resolve(root, 'preview/core', file);
  const source = readFileSync(path, 'utf8');
  writeFileSync(path, source.replace(/from '([./][^']+)'/g, (_m, p) => `from '${p}.js'`));
}
console.log('Standalone ESM preview core regenerated');
