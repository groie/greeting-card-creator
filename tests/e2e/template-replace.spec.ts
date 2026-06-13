import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test.beforeEach((_, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'desktop', 'desktop modal variant');
});

test('replacing an applied template prompts a confirm and applies on Replace', async ({ page }) => {
  await gotoDesignStep(page);

  await page.getByRole('button', { name: 'Templates' }).first().click();
  await page.getByRole('button', { name: 'Birthday' }).click();
  await expect(page.getByRole('button', { name: 'Birthday' })).not.toBeVisible({
    timeout: 10_000,
  });

  await page.getByRole('button', { name: 'Templates' }).first().click();
  await page.getByRole('button', { name: 'Thank You' }).click();
  await expect(page.getByText(/Replace your \d+ text layers? with/i)).toBeVisible();

  await page.getByRole('button', { name: /^Replace$/ }).click();
  await expect(page.getByRole('button', { name: 'Thank You' })).not.toBeVisible({
    timeout: 10_000,
  });
});

test('Cancel in the confirm bar dismisses the prompt and keeps the modal open', async ({
  page,
}) => {
  await gotoDesignStep(page);

  await page.getByRole('button', { name: 'Templates' }).first().click();
  await page.getByRole('button', { name: 'Birthday' }).click();
  await expect(page.getByRole('button', { name: 'Birthday' })).not.toBeVisible({
    timeout: 10_000,
  });

  await page.getByRole('button', { name: 'Templates' }).first().click();
  await page.getByRole('button', { name: 'Congratulations' }).click();
  await expect(page.getByText(/Replace your \d+ text layers? with/i)).toBeVisible();

  await page.getByRole('button', { name: /^Cancel$/ }).click();
  await expect(page.getByText(/Replace your \d+ text layers? with/i)).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Congratulations' })).toBeVisible();
});
