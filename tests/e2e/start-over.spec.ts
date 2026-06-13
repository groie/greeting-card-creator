import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test('"Start Over" returns to CropStep', async ({ page }) => {
  await gotoDesignStep(page);
  await page.getByRole('button', { name: 'Start Over' }).click();
  await expect(page.getByTestId('upload-dropzone')).toBeVisible();
});
