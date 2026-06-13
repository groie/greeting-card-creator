import { test as base, expect } from '@playwright/test';
import { interceptGoogleFonts } from './fonts';
import { createCoverageReporter } from './coverage';

type Fixtures = {
  fontsReady: void;
  collectCoverage: void;
};

export const test = base.extend<Fixtures>({
  fontsReady: [
    async ({ context }, use) => {
      await interceptGoogleFonts(context);
      await use();
    },
    { auto: true },
  ],

  collectCoverage: [
    async ({ page, browserName }, use) => {
      const canCollect = browserName === 'chromium';
      if (canCollect) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });
      }
      await use();
      if (canCollect) {
        const entries = await page.coverage.stopJSCoverage();
        if (Array.isArray(entries) && entries.length > 0) {
          await createCoverageReporter().add(entries);
        }
      }
    },
    { auto: true },
  ],
});

export { expect };
