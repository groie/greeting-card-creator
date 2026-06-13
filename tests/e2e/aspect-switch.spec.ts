import { test, expect } from './fixtures';
import { gotoCropStep, uploadImage, fixtureImage, pickAspect, applyCrop } from './helpers/flow';

test('switching through every aspect ratio + zoom + apply lands on DesignStep', async ({ page }) => {
  await gotoCropStep(page);
  await uploadImage(page, fixtureImage.landscape);

  await pickAspect(page, '1:1');
  await pickAspect(page, '4:5');
  await pickAspect(page, '9:16');
  await pickAspect(page, '5:7');

  const zoom = page.locator('input[type="range"]');
  await zoom.evaluate((el: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    setter?.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, '2.5');
  await expect(zoom).toHaveValue('2.5');

  await applyCrop(page);
});
