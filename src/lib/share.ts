export function isClipboardImageSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'clipboard' in navigator &&
    typeof window !== 'undefined' &&
    typeof window.ClipboardItem !== 'undefined'
  );
}

export async function copyPngToClipboard(blob: Blob): Promise<void> {
  if (!isClipboardImageSupported()) {
    throw new Error('Clipboard image API not supported in this browser');
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

export function openWhatsApp(text = 'Check out the card I made!'): void {
  const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
