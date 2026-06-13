import { FONTS, type FontDef } from './fontList';

const loaded = new Map<string, Promise<void>>();

function buildHref(font: FontDef): string {
  const family = font.name.replace(/ /g, '+');
  const weights = font.weights.join(';');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
}

export function loadGoogleFont(name: string): Promise<void> {
  const font = FONTS.find((f) => f.name === name);
  if (!font) return Promise.resolve();
  const existing = loaded.get(name);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = buildHref(font);
    link.addEventListener('load', () => {
      Promise.all(font.weights.map((w) => document.fonts.load(`${w} 16px "${name}"`)))
        .then(() => resolve())
        .catch(reject);
    });
    link.addEventListener('error', () => reject(new Error(`Failed to load font: ${name}`)));
    document.head.appendChild(link);
  });

  loaded.set(name, promise);
  return promise;
}

export function loadAllGoogleFonts(): Promise<void> {
  return Promise.all(FONTS.map((f) => loadGoogleFont(f.name).catch(() => {}))).then(
    () => undefined,
  );
}
