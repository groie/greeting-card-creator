import { describe, expect, it, vi } from 'vitest';
import { loadGoogleFont } from './fonts';
import { FONTS } from './fontList';

describe('loadGoogleFont', () => {
  it('resolves immediately for an unknown font without touching the DOM', async () => {
    const appendSpy = vi.spyOn(document.head, 'appendChild');
    await loadGoogleFont('Definitely Not A Font');
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('appends a stylesheet link with the expected Google Fonts URL for a known font', async () => {
    const font = FONTS[0];
    const appendSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation(<T extends Node>(node: T) => {
        queueMicrotask(() => (node as unknown as HTMLLinkElement).dispatchEvent(new Event('load')));
        return node;
      });
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { load: vi.fn().mockResolvedValue(undefined) },
    });

    await loadGoogleFont(font.name);

    expect(appendSpy).toHaveBeenCalledOnce();
    const link = appendSpy.mock.calls[0][0] as HTMLLinkElement;
    expect(link.tagName).toBe('LINK');
    expect(link.rel).toBe('stylesheet');
    expect(link.href).toContain('https://fonts.googleapis.com/css2?family=');
    expect(link.href).toContain(font.name.replace(/ /g, '+'));
    for (const w of font.weights) expect(link.href).toContain(String(w));
  });

  it('caches by name so repeated calls share a single promise', async () => {
    const font = FONTS[1];
    const appendSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation(<T extends Node>(node: T) => {
        queueMicrotask(() => (node as unknown as HTMLLinkElement).dispatchEvent(new Event('load')));
        return node;
      });
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { load: vi.fn().mockResolvedValue(undefined) },
    });

    await Promise.all([loadGoogleFont(font.name), loadGoogleFont(font.name)]);
    expect(appendSpy).toHaveBeenCalledTimes(1);
  });
});
