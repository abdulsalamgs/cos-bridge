import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export async function makeTempDir(prefix) {
  return fs.realpath(await fs.mkdtemp(path.join(tmpdir(), prefix)));
}

export async function removeTempDir(directory) {
  await fs.rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}
