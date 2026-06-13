import MCR from 'monocart-coverage-reports';

export const COVERAGE_DIR = 'coverage/e2e';
export const CACHE_DIR = `${COVERAGE_DIR}/.cache`;

export function createCoverageReporter() {
  return MCR({
    name: 'Playwright Coverage',
    outputDir: COVERAGE_DIR,
    cacheDir: CACHE_DIR,
    reports: [['v8'], ['lcovonly'], ['json', { file: 'coverage-final.json' }]],
    cleanCache: false,
    entryFilter: (entry: { url: string }) => entry.url.includes('/src/'),
    sourceFilter: (sourcePath: string) =>
      /\.(tsx?|jsx?)$/.test(sourcePath) &&
      !/\.(test|spec)\.[cm]?[jt]sx?$/.test(sourcePath) &&
      !/(^|\/)node_modules\//.test(sourcePath),
  });
}

