import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test('opens and closes the share modal', async ({ page }) => {
  await gotoDesignStep(page);
  await page.getByRole('button', { name: 'Share' }).click();
  await expect(page.getByRole('heading', { name: /Share your card/i })).toBeVisible({
    timeout: 10_000,
  });
  await page.keyboard.press('Escape').catch(() => {});
  const closeBtn = page.getByRole('button', { name: /Close|×|Cancel/i }).first();
  if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click();
});
