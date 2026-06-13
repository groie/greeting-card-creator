import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test.beforeEach((_, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'mobile', 'mobile-only');
});

test('adding text does not auto-open the edit-style sheet', async ({ page }) => {
  await gotoDesignStep(page);
  await page.getByRole('button', { name: /Add text/ }).click();
  await expect(page.getByRole('button', { name: /Edit style/i })).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByTestId('mobile-text-sheet')).toHaveCount(0);
});

test('"Edit style" toggles the push-layout sheet open and closed', async ({ page }) => {
  await gotoDesignStep(page);
  await page.getByRole('button', { name: /Add text/ }).click();
  const editStyle = page.getByRole('button', { name: /Edit style/i });
  await editStyle.click();
  await expect(page.getByTestId('mobile-text-sheet')).toBeVisible();
  await editStyle.click();
  await expect(page.getByTestId('mobile-text-sheet')).toHaveCount(0);
});
