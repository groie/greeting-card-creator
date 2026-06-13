import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test('clipboard success path shows Copied! confirmation', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'desktop', 'desktop variant');
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: async () => undefined },
    });
    // @ts-expect-error stubbing into window for test
    window.ClipboardItem = class {
      constructor(_: Record<string, Blob>) {}
    };
  });

  await gotoDesignStep(page);
  await page.getByRole('button', { name: 'Share' }).click();
  const copy = page.getByRole('button', { name: /Copy to clipboard/i });
  await expect(copy).toBeEnabled({ timeout: 10_000 });
  await copy.click();
  await expect(page.getByText(/^Copied!$/)).toBeVisible();
});

test('clipboard error path shows Copy failed', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'desktop', 'desktop variant');
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        write: async () => {
          throw new Error('denied');
        },
      },
    });
    // @ts-expect-error stubbing into window for test
    window.ClipboardItem = class {
      constructor(_: Record<string, Blob>) {}
    };
  });

  await gotoDesignStep(page);
  await page.getByRole('button', { name: 'Share' }).click();
  const copy = page.getByRole('button', { name: /Copy to clipboard/i });
  await expect(copy).toBeEnabled({ timeout: 10_000 });
  await copy.click();
  await expect(page.getByText(/Copy failed/)).toBeVisible();
});

test('WhatsApp button attempts copy then opens whatsapp link', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'desktop', 'desktop variant');
  await page.addInitScript(() => {
    let copyCalled = false;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        write: async () => {
          copyCalled = true;
        },
      },
    });
    // @ts-expect-error stubbing into window for test
    window.ClipboardItem = class {
      constructor(_: Record<string, Blob>) {}
    };
    const opened: string[] = [];
    const origOpen = window.open;
    window.open = ((url?: string | URL, ...rest: unknown[]) => {
      if (typeof url === 'string') opened.push(url);
      return origOpen.call(window, 'about:blank', ...(rest as []));
    }) as typeof window.open;
    // @ts-expect-error test hooks
    window.__opened = opened;
    // @ts-expect-error test hooks
    window.__copyCalled = () => copyCalled;
  });

  await gotoDesignStep(page);
  await page.getByRole('button', { name: 'Share' }).click();
  const whatsapp = page.getByRole('button', { name: /Share to WhatsApp/i });
  await expect(whatsapp).toBeEnabled({ timeout: 10_000 });
  await whatsapp.click();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        // @ts-expect-error test hooks
        return (window.__opened as string[]).some((u) => u.startsWith('whatsapp://'));
      }),
    )
    .toBe(true);
  const copyCalled = await page.evaluate(() => {
    // @ts-expect-error test hooks
    return (window.__copyCalled as () => boolean)();
  });
  expect(copyCalled).toBe(true);
});
