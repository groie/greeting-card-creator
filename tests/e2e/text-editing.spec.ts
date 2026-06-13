import { test, expect } from './fixtures';
import { gotoDesignStep } from './helpers/flow';

test.beforeEach((_, testInfo) => {
  testInfo.skip(testInfo.project.name !== 'desktop', 'desktop-only TextPanel');
});

test('drives every TextPanel control and deletes the layer', async ({ page }) => {
  await gotoDesignStep(page);

  await page.getByRole('button', { name: /^Text$/ }).click();
  await expect(page.getByText(/^Font$/)).toBeVisible({ timeout: 10_000 });

  await page.getByRole('button', { name: /^Bold$/ }).click();
  await page.getByRole('button', { name: /^Italic$/ }).click();
  await page.getByRole('button', { name: /Align left/i }).click();
  await page.getByRole('button', { name: /Align center/i }).click();
  await page.getByRole('button', { name: /Align right/i }).click();

  const setReactInputValue = (el: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    setter?.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const color = page.locator('input[type="color"]');
  await color.evaluate(setReactInputValue, '#ff0000');
  await expect(color).toHaveValue('#ff0000');

  const sizeSlider = page.locator('input[type="range"]').nth(0);
  await sizeSlider.evaluate(setReactInputValue, '80');
  await expect(sizeSlider).toHaveValue('80');

  const opacitySlider = page.locator('input[type="range"]').nth(1);
  await opacitySlider.evaluate(setReactInputValue, '50');
  await expect(opacitySlider).toHaveValue('50');

  const shadow = page.getByRole('button', { name: /^Shadow$/ });
  await shadow.click();
  await shadow.click();

  const blend = page.locator('select');
  await blend.selectOption('multiply');
  await blend.selectOption('screen');
  await blend.selectOption('overlay');
  await blend.selectOption('source-over');

  await page.getByRole('button', { name: /Delete layer/i }).click();
  await expect(page.getByText(/Select a text layer to edit/i)).toBeVisible();
});
