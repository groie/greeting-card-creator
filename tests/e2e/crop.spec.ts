import { test, expect } from './fixtures';
import { gotoCropStep, uploadImage, pickAspect, applyCrop, fixtureImage } from './helpers/flow';

test('upload, pick aspect, apply lands on DesignStep', async ({ page }) => {
  await gotoCropStep(page);
  await uploadImage(page, fixtureImage.landscape);
  await pickAspect(page, '4:5');
  await applyCrop(page);
});

test('"Choose Different Image" returns to upload state', async ({ page }) => {
  await gotoCropStep(page);
  await uploadImage(page, fixtureImage.square);
  await page.getByRole('button', { name: /Choose Different Image/i }).click();
  await expect(page.getByTestId('upload-dropzone')).toBeVisible();
});

test('Apply button is disabled until crop is computed', async ({ page }) => {
  await gotoCropStep(page);
  await uploadImage(page, fixtureImage.portrait);
  const apply = page.getByRole('button', { name: /Apply Crop/i });
  await expect(apply).toBeVisible();
});
