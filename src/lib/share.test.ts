import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyPngToClipboard, isClipboardImageSupported, openWhatsApp } from './share';

describe('isClipboardImageSupported', () => {
  const originalClipboardItem = (globalThis as { ClipboardItem?: unknown }).ClipboardItem;

  afterEach(() => {
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = originalClipboardItem;
  });

  it('returns true when navigator.clipboard and ClipboardItem exist', () => {
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = class {};
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: vi.fn() },
    });
    expect(isClipboardImageSupported()).toBe(true);
  });

  it('returns false when ClipboardItem is missing', () => {
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = undefined;
    expect(isClipboardImageSupported()).toBe(false);
  });
});

describe('copyPngToClipboard', () => {
  let writeMock: ReturnType<typeof vi.fn>;
  const originalClipboardItem = (globalThis as { ClipboardItem?: unknown }).ClipboardItem;

  beforeEach(() => {
    writeMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: writeMock },
    });
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = class {
      constructor(public items: Record<string, Blob>) {}
    };
  });

  afterEach(() => {
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = originalClipboardItem;
  });

  it('calls navigator.clipboard.write with a ClipboardItem', async () => {
    const blob = new Blob(['x'], { type: 'image/png' });
    await copyPngToClipboard(blob);
    expect(writeMock).toHaveBeenCalledOnce();
    const [items] = writeMock.mock.calls[0];
    expect(Array.isArray(items)).toBe(true);
    expect(items[0]).toBeInstanceOf(
      (globalThis as { ClipboardItem?: unknown }).ClipboardItem as never,
    );
  });

  it('throws when clipboard image API is unsupported', async () => {
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = undefined;
    const blob = new Blob(['x'], { type: 'image/png' });
    await expect(copyPngToClipboard(blob)).rejects.toThrow(/not supported/);
  });
});

describe('openWhatsApp', () => {
  it('opens a whatsapp:// URL with the encoded text', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    openWhatsApp('hello world');
    expect(openSpy).toHaveBeenCalledWith(
      'whatsapp://send?text=hello%20world',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('uses a default message when none provided', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    openWhatsApp();
    expect(openSpy).toHaveBeenCalled();
    const url = openSpy.mock.calls[0][0] as string;
    expect(url.startsWith('whatsapp://send?text=')).toBe(true);
    expect(url.length).toBeGreaterThan('whatsapp://send?text='.length);
  });
});
