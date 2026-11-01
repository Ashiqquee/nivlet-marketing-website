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
    // Decode so dynamic-route chunks (…/%5Bslug%5D/…) match their [slug] folders on disk.
    const clean = decodeURIComponent(pathname.split('?')[0]);
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
const release = JSON.parse(await readFile(path.join(root, 'lib/release.json'), 'utf8'));
const download = await readFile(path.join(output, release.href));
if (createHash('sha256').update(download).digest('hex') !== release.sha256 || download.length !== release.bytes) throw new Error(`Download ${release.href} does not match lib/release.json; rerun npm run sync-release`);
if ((await readdir(path.join(output, 'download'))).some(file => file.endsWith('.dmg') && file !== release.file)) throw new Error('Stale disk image in out/download');
const securityTxt = await readFile(path.join(output, '.well-known/security.txt'), 'utf8');
const expires = Date.parse(securityTxt.match(/^Expires: (.+)$/m)?.[1]);
if (!(expires > Date.now())) throw new Error('security.txt is missing a future Expires date');
const siteUrl = 'https://nivlet.ashique.work';
const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
if (!(await readFile(path.join(output, 'robots.txt'), 'utf8')).includes(`Sitemap: ${siteUrl}/sitemap.xml`)) throw new Error('robots.txt is missing the sitemap');
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (/(?:^|\/)(?:404|_not-found)(?:\/index)?\.html$/.test(path.relative(output, file))) continue;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical?.startsWith(siteUrl + '/')) throw new Error(`Missing canonical in ${file}`);
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) throw new Error(`Canonical not in sitemap: ${canonical}`);
  if (!/<meta name="description" content="[^"]{50,160}"/.test(html)) throw new Error(`Missing or overlong description in ${file}`);
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!image?.startsWith(siteUrl + '/')) throw new Error(`Missing og:image in ${file}`);
  await stat(path.join(output, image.slice(siteUrl.length)));
}
console.log(`Verified ${htmlFiles.length} exported HTML files, ${checked} local references/anchors, ${provenance.assets.length} native media hashes and ${(provenance.design_assets ?? []).length} design asset hashes.`);
