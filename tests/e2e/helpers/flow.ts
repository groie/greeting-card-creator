import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { waitForFontsReady } from '../fonts';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(here, '..', '..', 'fixtures');

export type AspectId = '1:1' | '4:5' | '9:16' | '5:7';

export const fixtureImage = {
  landscape: join(FIXTURES_DIR, 'landscape.jpg'),
  portrait: join(FIXTURES_DIR, 'portrait.jpg'),
  square: join(FIXTURES_DIR, 'square.jpg'),
};

export async function uploadImage(page: Page, filePath: string): Promise<void> {
  await page.setInputFiles('input[type="file"]', filePath);
}

export async function pickAspect(page: Page, aspect: AspectId): Promise<void> {
  await page.getByRole('button', { name: new RegExp(`^${aspect.replace(':', '\\:')}`) }).click();
}

export async function applyCrop(page: Page): Promise<void> {
  const apply = page.getByRole('button', { name: /Apply Crop/i });
  await expect(apply).toBeEnabled({ timeout: 10_000 });
  await apply.click();
  await expect(page.getByTestId('design-step')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('canvas-wrapper').locator('canvas').first()).toBeVisible();
}

export async function gotoCropStep(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByTestId('upload-dropzone')).toBeVisible();
}

export async function gotoDesignStep(
  page: Page,
  opts: { image?: keyof typeof fixtureImage; aspect?: AspectId } = {},
): Promise<void> {
  const image = opts.image ?? 'square';
  await gotoCropStep(page);
  await uploadImage(page, fixtureImage[image]);
  if (opts.aspect) await pickAspect(page, opts.aspect);
  await applyCrop(page);
  await waitForFontsReady(page);
}
