import { readFile, readdir, mkdir, rm } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

const ROOT = resolve('.');
const SRC_ROOT = resolve('src');
const OUT_DIR = resolve('coverage/merged');
const SOURCES = [
  resolve('coverage/unit/coverage-final.json'),
  resolve('coverage/e2e/coverage-final.json'),
];

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(tsx?|jsx?)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name))
      out.push(full);
  }
  return out;
}

const srcFiles = await walk(SRC_ROOT);
const byBasename = new Map();
for (const f of srcFiles) {
  const base = f.split(sep).pop();
  if (!byBasename.has(base)) byBasename.set(base, []);
  byBasename.get(base).push(f);
}

const map = libCoverage.createCoverageMap({});

function normalizeKey(rawPath) {
  let p = rawPath.replace(/^.*?localhost[-:][0-9]+\//, '');
  if (p.startsWith('/') && p.startsWith(ROOT + '/')) return p;
  if (p.startsWith('/')) p = p.slice(1);
  if (p.startsWith('src/')) return resolve(ROOT, p);
  if (/^[^/]+\.(tsx?|jsx?)$/.test(p)) {
    const candidates = byBasename.get(p);
    if (candidates && candidates.length === 1) return candidates[0];
    if (candidates && candidates.length > 1) return candidates[0];
    return resolve(SRC_ROOT, p);
  }
  return resolve(ROOT, p);
}

for (const src of SOURCES) {
  if (!existsSync(src)) {
    console.warn(`skip (missing): ${src}`);
    continue;
  }
  const data = JSON.parse(await readFile(src, 'utf8'));
  const normalized = {};
  for (const [key, value] of Object.entries(data)) {
    const newKey = normalizeKey(key);
    normalized[newKey] = { ...value, path: newKey };
  }
  map.merge(normalized);
  console.log(`merged: ${src} (${Object.keys(normalized).length} files)`);
}

const context = libReport.createContext({
  dir: OUT_DIR,
  coverageMap: map,
  defaultSummarizer: 'nested',
  sourceFinder: (filepath) => {
    const abs = resolve(ROOT, filepath);
    try {
      return readFileSync(abs, 'utf8');
    } catch {
      return '';
    }
  },
});

for (const r of ['text', 'lcov', 'html', 'json-summary']) {
  reports.create(r).execute(context);
}

const summary = map.getCoverageSummary();
console.log('\n=== merged coverage ===');
for (const key of ['lines', 'statements', 'branches', 'functions']) {
  const m = summary[key];
  console.log(`${key.padEnd(12)} ${m.pct}% (${m.covered}/${m.total})`);
}
console.log(`\nreport: ${OUT_DIR}/index.html`);
