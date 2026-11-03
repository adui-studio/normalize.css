import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

// W-04 synthetic packaging smoke test: the CSS below only exists in a temporary
// directory, is never added to the product, and is not a Normalize rule.
const CSS_SAMPLE = '/* TEST FIXTURE - NOT A NORMALIZE RULE */\n.__adui_pack_smoke { color: rgb(10, 20, 30); }\n';

function npm(args, cwd, cache) {
  const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    timeout: 30_000,
    env: {
      ...process.env,
      npm_config_cache: cache,
      npm_config_audit: 'false',
      npm_config_fund: 'false',
      npm_config_update_notifier: 'false',
    },
  });
  assert.equal(result.error, undefined, `Unable to launch npm: ${result.error?.message}`);
  assert.equal(result.status, 0, `npm ${args[0]} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

test('W-04: offline tarball exports exactly one CSS root, without JS wrappers or test assets', { timeout: 90_000 }, (t) => {
  const root = mkdtempSync(join(tmpdir(), 'adui-css-pack-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const packDir = join(root, 'package');
  const consumer = join(root, 'consumer');
  const cache = join(root, 'npm-cache');
  mkdirSync(join(packDir, 'dist'), { recursive: true });
  mkdirSync(consumer);
  mkdirSync(join(packDir, 'tests'));

  const manifest = {
    name: '@adui/normalize.css',
    version: '0.0.0-smoke.0',
    private: true,
    type: 'module',
    files: ['dist'],
    sideEffects: ['**/*.css'],
    exports: { '.': './dist/normalize.css' },
  };
  writeFileSync(join(packDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(packDir, 'dist', 'normalize.css'), CSS_SAMPLE);
  writeFileSync(join(packDir, 'README.md'), 'Synthetic package smoke test. Never publish.\n');
  writeFileSync(join(packDir, 'LICENSE'), 'Synthetic file for packaging verification only.\n');
  writeFileSync(join(packDir, 'tests', 'should-not-ship.txt'), 'PRIVATE TEST DATA\n');

  const packed = JSON.parse(npm(['pack', '--json', '--ignore-scripts', '--offline'], packDir, cache));
  assert.equal(packed.length, 1);
  const files = packed[0].files.map(({ path }) => path).sort();
  assert.deepEqual(files, ['LICENSE', 'README.md', 'dist/normalize.css', 'package.json']);

  const tarball = join(packDir, packed[0].filename);
  assert.ok(existsSync(tarball), 'npm pack did not create a tarball');
  writeFileSync(join(consumer, 'package.json'), '{"name":"adui-css-smoke-consumer","private":true}\n');
  npm(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--no-save', '--package-lock=false', tarball], consumer, cache);

  const requireFromConsumer = createRequire(pathToFileURL(join(consumer, 'entry.cjs')));
  const cssPath = requireFromConsumer.resolve('@adui/normalize.css');
  assert.equal(readFileSync(cssPath, 'utf8'), CSS_SAMPLE);
  assert.match(cssPath.replaceAll('\\', '/'), /node_modules\/@adui\/normalize\.css\/dist\/normalize\.css$/);
  assert.throws(
    () => requireFromConsumer.resolve('@adui/normalize.css/reset.css'),
    (error) => error?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED',
  );
  assert.throws(
    () => requireFromConsumer.resolve('@adui/normalize.css/package.json'),
    (error) => error?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED',
  );
  assert.equal(existsSync(join(consumer, 'node_modules', '@adui', 'normalize.css', 'tests')), false);
  assert.equal(existsSync(join(consumer, 'node_modules', '@adui', 'normalize.css', 'index.js')), false);
});
