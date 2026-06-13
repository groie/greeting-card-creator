import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test('opens templates modal and applies a template', async ({ page }) => {
  await gotoDesignStep(page);
  await page.getByRole('button', { name: 'Templates' }).first().click();
  await expect(page.getByRole('button', { name: 'Birthday' })).toBeVisible();
  await page.getByRole('button', { name: 'Birthday' }).click();
  await expect(page.getByRole('button', { name: 'Birthday' })).not.toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByTestId('canvas-wrapper').locator('canvas').first()).toBeVisible();
});
