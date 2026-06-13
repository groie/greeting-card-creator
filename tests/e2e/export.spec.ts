import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test.beforeEach((_fixtures, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'desktop', 'Export dropdown is desktop-targeted');
});

test('Export dropdown downloads Standard and High quality PNGs', async ({ page }) => {
  await gotoDesignStep(page);

  await page.getByRole('button', { name: 'Export' }).click();
  const standard = page.getByRole('button', { name: /Standard/ });
  const high = page.getByRole('button', { name: /High quality/ });
  await expect(standard).toBeVisible();
  await expect(high).toBeVisible();

  const dl1Promise = page.waitForEvent('download');
  await standard.click();
  const dl1 = await dl1Promise;
  expect(dl1.suggestedFilename()).toMatch(/^greeting-card-\d+x\d+\.png$/);

  await expect(standard).not.toBeVisible();

  await page.getByRole('button', { name: 'Export' }).click();
  const dl2Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: /High quality/ }).click();
  const dl2 = await dl2Promise;
  expect(dl2.suggestedFilename()).toMatch(/^greeting-card-\d+x\d+\.png$/);
});

test('Export dropdown closes on outside click and Escape', async ({ page }) => {
  await gotoDesignStep(page);

  await page.getByRole('button', { name: 'Export' }).click();
  await expect(page.getByRole('button', { name: /Standard/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /Standard/ })).not.toBeVisible();

  await page.getByRole('button', { name: 'Export' }).click();
  await expect(page.getByRole('button', { name: /Standard/ })).toBeVisible();
  await page.mouse.click(10, 10);
  await expect(page.getByRole('button', { name: /Standard/ })).not.toBeVisible();
});
