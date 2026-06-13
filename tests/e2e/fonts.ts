import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { BrowserContext } from '@playwright/test';

const here = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(here, '..', 'fixtures', 'fonts', 'cache');
const MANIFEST_PATH = join(CACHE_DIR, 'manifest.json');

type Manifest = Record<string, string>;

let manifestPromise: Promise<Manifest> | null = null;

function getManifest(): Promise<Manifest> {
  if (!manifestPromise) {
    manifestPromise = readFile(MANIFEST_PATH, 'utf8').then((s) => JSON.parse(s) as Manifest);
  }
  return manifestPromise;
}

export async function interceptGoogleFonts(context: BrowserContext): Promise<void> {
  const manifest = await getManifest();
  await context.route(
    /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
    async (route) => {
      const url = route.request().url();
      const file = manifest[url];
      if (!file) {
        await route.fulfill({ status: 404, body: '' });
        return;
      }
      const buf = await readFile(join(CACHE_DIR, file));
      const contentType = file.endsWith('.css') ? 'text/css' : 'font/woff2';
      await route.fulfill({
        status: 200,
        headers: {
          'content-type': contentType,
          'access-control-allow-origin': '*',
          'cache-control': 'public, max-age=31536000',
        },
        body: buf,
      });
    },
  );
}

export async function waitForFontsReady(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}
