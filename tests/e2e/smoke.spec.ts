import { test, expect } from './fixtures';
import { gotoCropStep, gotoDesignStep } from './helpers/flow';

test('CropStep renders', async ({ page }) => {
  await gotoCropStep(page);
  await expect(page.getByRole('heading', { name: /Create Your Card/i })).toBeVisible();
  await expect(page.getByTestId('upload-dropzone')).toBeVisible();
});

test('DesignStep renders after applying a crop', async ({ page }) => {
  await gotoDesignStep(page);
  await expect(page.getByTestId('design-step')).toBeVisible();
  await expect(page.getByTestId('canvas-wrapper').locator('canvas').first()).toBeVisible();
});
