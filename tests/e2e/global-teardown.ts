import { createCoverageReporter } from './coverage';

export default async function globalTeardown(): Promise<void> {
  await createCoverageReporter().generate();
}
