import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, 'cache');
await mkdir(cacheDir, { recursive: true });

const FONTS = [
  { name: 'Inter', weights: [400, 700] },
  { name: 'Montserrat', weights: [400, 700] },
  { name: 'Oswald', weights: [400, 700] },
  { name: 'Bebas Neue', weights: [400] },
  { name: 'Playfair Display', weights: [400, 700] },
  { name: 'Lora', weights: [400, 700] },
  { name: 'Merriweather', weights: [400, 700] },
  { name: 'DM Serif Display', weights: [400] },
  { name: 'Great Vibes', weights: [400] },
  { name: 'Pacifico', weights: [400] },
  { name: 'Dancing Script', weights: [400, 700] },
  { name: 'Caveat', weights: [400, 700] },
];

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const manifest = {};

function hashUrl(url) {
  return createHash('sha1').update(url).digest('hex').slice(0, 16);
}

async function cache(url, ext) {
  const filename = `${hashUrl(url)}.${ext}`;
  const out = join(cacheDir, filename);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(out, buf);
  manifest[url] = filename;
  return { filename, buf };
}

for (const font of FONTS) {
  const family = font.name.replace(/ /g, '+');
  const weights = font.weights.join(';');
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
  console.log(`css: ${cssUrl}`);
  const { buf } = await cache(cssUrl, 'css');
  const css = buf.toString('utf8');
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(
    (m) => m[1],
  );
  for (const u of urls) {
    if (manifest[u]) continue;
    const ext = u.split('.').pop().split('?')[0];
    console.log(`  font: ${u}`);
    await cache(u, ext);
  }
}

await writeFile(join(cacheDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\ncached ${Object.keys(manifest).length} URLs to ${cacheDir}`);
