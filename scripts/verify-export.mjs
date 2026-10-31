import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'out');
const htmlFiles = [];
async function walk(directory) {
  for (const item of await readdir(directory, {withFileTypes:true})) {
    const target = path.join(directory, item.name);
    if (item.isDirectory()) await walk(target);
    else if (item.name.endsWith('.html')) htmlFiles.push(target);
  }
}
await walk(output);
let checked = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(src|href|poster)="([^"\s]*)"/g)) {
    const [, attribute, url] = match;
    if (attribute !== 'href' && /^(?:https?:)?\/\//.test(url)) throw new Error(`External ${attribute} blocked by the vercel.json CSP: ${url} in ${file}`);
    if (!url || /^(?:https?:|data:|mailto:|tel:)/.test(url)) continue;
    const [pathname, fragment] = url.split('#');
    const clean = pathname.split('?')[0];
    let target = !clean ? file : path.resolve(clean.startsWith('/') ? output : path.dirname(file), '.' + (clean.startsWith('/') ? clean : '/' + clean));
    if (!target.startsWith(output + path.sep) && target !== output) throw new Error(`Outside export: ${url}`);
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target, 'index.html');
    await stat(target);
    if (fragment && target.endsWith('.html')) {
      const destination = await readFile(target, 'utf8');
      if (!destination.includes(`id="${fragment}"`)) throw new Error(`Missing anchor ${url} in ${file}`);
    }
    checked++;
  }
}
const provenance = JSON.parse(await readFile(path.join(output,'assets/provenance.json'),'utf8'));
for (const asset of provenance.assets) {
  const bytes = await readFile(path.join(output,'assets',asset.file));
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (digest !== asset.sha256 || bytes.length !== asset.bytes) throw new Error(`Media changed: ${asset.file}`);
}
for (const asset of provenance.design_assets ?? []) {
  const target = path.resolve(output, asset.path);
  if (!target.startsWith(output + path.sep)) throw new Error(`Unsafe design asset: ${asset.path}`);
  const bytes = await readFile(target);
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (digest !== asset.sha256 || bytes.length !== asset.bytes) throw new Error(`Design asset changed: ${asset.path}`);
}
const securityTxt = await readFile(path.join(output, '.well-known/security.txt'), 'utf8');
const expires = Date.parse(securityTxt.match(/^Expires: (.+)$/m)?.[1]);
if (!(expires > Date.now())) throw new Error('security.txt is missing a future Expires date');
console.log(`Verified ${htmlFiles.length} exported HTML files, ${checked} local references/anchors, ${provenance.assets.length} native media hashes and ${(provenance.design_assets ?? []).length} design asset hashes.`);
