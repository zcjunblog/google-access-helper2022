import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { verifyDormantRelease } from './conflict-browser.mjs';

const sandboxRoot = await mkdtemp(path.join(tmpdir(), 'gah-browser-'));
const userDataDir = path.join(sandboxRoot, 'profile');
const outputDir = path.join(sandboxRoot, 'release');
execFileSync('python3', ['scripts/package.py', '--out-dir', outputDir]);
const version = JSON.parse(readFileSync('extension/manifest.json', 'utf8')).version;
execFileSync('python3', ['-m', 'zipfile', '-e', path.join(outputDir, `google-access-helper-${version}.zip`), path.join(sandboxRoot, 'unpacked')]);
const extensionPath = path.join(sandboxRoot, 'unpacked', 'google-access-helper');
const proxyRequests = [];
const proxy = http.createServer((request, response) => {
  proxyRequests.push(request.url);
  response.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' });
  response.end('<!doctype html><title>Local proxy proof</title><p>gah-proxy-ok</p>');
});
proxy.on('connect', (request, socket) => socket.end('HTTP/1.1 502 Not available\r\n\r\n'));
await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
let context;
try {
  context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true, viewport: { width: 420, height: 820 },
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker', { timeout: 15000 });
  const id = new URL(worker.url()).host;
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`chrome-extension://${id}/popup.html`);
  await page.getByRole('button', { name: '保存配置', exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('#status-title')?.textContent.includes('未启用'));
  assert.equal(await page.getByLabel('代理地址').inputValue(), '127.0.0.1');
  assert.equal(await page.getByLabel('端口', { exact: true }).inputValue(), '7890');
  assert.equal((await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).levelOfControl, 'controllable_by_this_extension');
  const denied = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'diagnose' }));
  assert.equal(denied.ok, false);
  await page.getByLabel('端口', { exact: true }).fill(String(proxy.address().port));
  await page.getByRole('button', { name: '保存配置', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#feedback')?.textContent.includes('保存'));
  assert.equal((await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).levelOfControl, 'controllable_by_this_extension');
  await page.getByRole('button', { name: '保存并启用', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#status-title')?.textContent.includes('已启用'));
  assert.equal((await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).value.mode, 'pac_script');
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#status-title')?.textContent.includes('已启用'));
  const screenshotDir = process.env.GAH_UPDATE_SCREENSHOT === '1' ? 'docs/images' : 'test-results';
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: `${screenshotDir}/extension.png`, fullPage: true });
  await page.getByLabel('全部网站', { exact: true }).check();
  await page.getByRole('button', { name: '保存并启用', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#status-detail')?.textContent.includes('全部'));
  const proof = await context.newPage();
  await proof.goto('http://example.test/gah-proxy-proof', { waitUntil: 'domcontentloaded' });
  assert.ok((await proof.textContent('body')).includes('gah-proxy-ok'));
  assert.ok(proxyRequests.some(url => url === 'http://example.test/gah-proxy-proof'));
  await proof.close();
  await page.getByRole('button', { name: '停用代理', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#status-title')?.textContent.includes('未启用'));
  assert.notEqual((await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).levelOfControl, 'controlled_by_this_extension');
  await page.reload();
  assert.equal(await page.getByLabel('端口', { exact: true }).inputValue(), String(proxy.address().port));
  for (const scheme of ['http', 'https', 'socks5']) {
    const applied = await page.evaluate(profile => chrome.runtime.sendMessage({ type: 'apply', profile }),
      { scheme, host: '::1', port: 1080, scope: 'all' });
    assert.equal(applied.ok, true, JSON.stringify(applied));
    assert.equal(applied.data.matchesSaved, true);
  }
  const beforeInvalid = await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }));
  const invalid = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'apply', profile: { scheme: 'http', host: '127.000.000.001', port: 7890, scope: 'all' } }));
  assert.equal(invalid.ok, false);
  assert.deepEqual(await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false })), beforeInvalid);
  await page.evaluate(() => chrome.runtime.sendMessage({ type: 'disable' }));
  await page.reload();
  await page.getByRole('button', { name: '导入配置', exact: true }).waitFor();
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  await page.waitForFunction(() => document.querySelector('#feedback')?.textContent.includes('JSON'));
  assert.equal((await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).levelOfControl, 'controllable_by_this_extension');
  const imported = { scheme: 'socks5', host: 'proxy.example', port: 1080, scope: 'google' };
  await page.locator('#import-file').setInputFiles({ name: 'profile.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ version: 1, profile: imported })) });
  await page.waitForFunction(() => document.querySelector('#host')?.value === 'proxy.example');
  assert.equal((await worker.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).levelOfControl, 'controllable_by_this_extension');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出配置', exact: true }).click();
  const download = await downloadPromise;
  const chunks = [];
  for await (const chunk of await download.createReadStream()) chunks.push(chunk);
  assert.deepEqual(JSON.parse(Buffer.concat(chunks).toString()), { version: 1, profile: imported });
  assert.deepEqual(errors, []);
  console.log('PASS: real MV3 load, idle/save/apply/PAC/HTTP proxy routing/release/persistence/diagnostic permission guard, all transports and IPv6 accepted by Chrome, JSON import/export; no page errors.');
  await context.close();
  context = null;
  await verifyDormantRelease(extensionPath);
} finally {
  if (context) await context.close();
  proxy.closeAllConnections();
  await new Promise(resolve => proxy.close(resolve));
  await rm(sandboxRoot, { recursive: true, force: true });
}
