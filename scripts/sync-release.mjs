// Copies a verified scripts/distribute.py candidate into the website download and records its metadata.
// Usage: npm run sync-release -- ../build/<candidate-folder>
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidate = process.argv[2] && path.resolve(process.argv[2]);
if (!candidate) throw new Error('Pass the scripts/distribute.py output folder, e.g. ../build/WebDownload-0.1-2');

const manifest = JSON.parse(await readFile(path.join(candidate, 'manifest.json'), 'utf8'));
const statuses = ['local-unnotarized', 'signed-unnotarized', 'notarized'];
if (!statuses.includes(manifest.status)) throw new Error(`Candidate status ${manifest.status} cannot be published.`);
const image = await readFile(path.join(candidate, manifest.dmg));
const sha256 = createHash('sha256').update(image).digest('hex');
if (sha256 !== manifest.dmg_sha256) throw new Error('Disk image does not match its manifest checksum; run distribute.py verify first.');

const downloads = path.join(root, 'public/download');
const file = `Nivlet-${manifest.app.version}.dmg`;
await mkdir(downloads, {recursive: true});
for (const old of await readdir(downloads)) if (old.endsWith('.dmg') && old !== file) await rm(path.join(downloads, old));
await copyFile(path.join(candidate, manifest.dmg), path.join(downloads, file));

const release = {
  version: manifest.app.version,
  build: manifest.app.build,
  href: `/download/${file}`,
  file,
  bytes: (await stat(path.join(downloads, file))).size,
  sha256,
  notarized: manifest.status === 'notarized',
  minimumMacOS: manifest.app.minimum_macos,
  architectures: manifest.app.architectures,
  sourceCommit: manifest.source_commit,
  date: new Date().toISOString().slice(0, 10),
};
await writeFile(path.join(root, 'lib/release.json'), JSON.stringify(release, null, 2) + '\n');
console.log(`Published ${file} (${release.bytes} bytes, ${release.notarized ? 'notarized' : 'not notarized'}) to public/download.`);
