import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test('add text inserts an editable layer and reveals the text panel', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'desktop-only: see mobile-sheet.spec.ts');
  await gotoDesignStep(page);
  await page.getByRole('button', { name: /^(Text|Add text)$/ }).click();
  await expect(
    page.getByText(/Font|Size|Color|Alignment/i).first(),
  ).toBeVisible({ timeout: 10_000 });
});
