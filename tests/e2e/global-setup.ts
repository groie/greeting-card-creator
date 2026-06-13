import { rm } from 'node:fs/promises';
import { COVERAGE_DIR } from './coverage';

export default async function globalSetup(): Promise<void> {
  await rm(COVERAGE_DIR, { recursive: true, force: true });
}
