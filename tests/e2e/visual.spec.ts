import { test, expect } from './fixtures';
import { gotoCropStep, gotoDesignStep } from './helpers/flow';
import { waitForFontsReady } from './fonts';

test.describe('visual regression', () => {
  test('CropStep initial state', async ({ page }) => {
    await gotoCropStep(page);
    await waitForFontsReady(page);
    await expect(page).toHaveScreenshot('crop-step-initial.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('DesignStep blank (no template)', async ({ page }) => {
    await gotoDesignStep(page, { image: 'square' });
    await page.waitForTimeout(300);
    await expect(page.getByTestId('canvas-wrapper')).toHaveScreenshot(
      'design-step-blank-canvas.png',
      { maxDiffPixelRatio: 0.05 },
    );
  });

  test('DesignStep with Birthday template', async ({ page }) => {
    await gotoDesignStep(page, { image: 'square' });
    await page.getByRole('button', { name: 'Templates' }).first().click();
    await page.getByRole('button', { name: 'Birthday' }).click();
    await expect(page.getByRole('button', { name: 'Birthday' })).not.toBeVisible();
    await waitForFontsReady(page);
    await page.waitForTimeout(500);
    await expect(page.getByTestId('canvas-wrapper')).toHaveScreenshot(
      'design-step-birthday-template.png',
      { maxDiffPixelRatio: 0.05 },
    );
  });

  test('ShareModal open', async ({ page }) => {
    await gotoDesignStep(page, { image: 'square' });
    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.getByRole('heading', { name: /Share your card/i })).toBeVisible();
    await waitForFontsReady(page);
    await expect(page.getByTestId('share-modal-dialog')).toHaveScreenshot(
      'share-modal-dialog.png',
      { maxDiffPixelRatio: 0.02 },
    );
  });

  test('DesignStep full layout with image', async ({ page }) => {
    await gotoDesignStep(page, { image: 'square' });
    await page.waitForTimeout(300);
    await expect(page.getByTestId('design-step')).toHaveScreenshot(
      'design-step-full-layout.png',
      {
        maxDiffPixelRatio: 0.03,
        mask: [page.getByTestId('canvas-wrapper').locator('canvas')],
      },
    );
  });
});
