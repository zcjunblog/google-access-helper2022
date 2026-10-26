import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export async function verifyDormantRelease(extensionPath) {
  const profile = await mkdtemp(path.join(tmpdir(), 'gah-conflict-profile-'));
  const other = await mkdtemp(path.join(tmpdir(), 'gah-competing-extension-'));
  let context;
  try {
    await writeFile(path.join(other, 'manifest.json'), JSON.stringify({
      manifest_version: 3, name: 'Test competing proxy', version: '1.0',
      permissions: ['proxy'], background: { service_worker: 'competitor.js' },
    }));
    await writeFile(path.join(other, 'competitor.js'), 'chrome.runtime.onInstalled.addListener(() => {});');
    const directories = [extensionPath, other].join(',');
    context = await chromium.launchPersistentContext(profile, {
      channel: 'chromium', headless: true,
      args: [`--disable-extensions-except=${directories}`, `--load-extension=${directories}`],
    });
    const findWorker = async suffix => context.serviceWorkers().find(worker => worker.url().endsWith(suffix)) ||
      await context.waitForEvent('serviceworker', { predicate: worker => worker.url().endsWith(suffix), timeout: 15000 });
    const own = await findWorker('/background.mjs');
    const competing = await findWorker('/competitor.js');
    const page = await context.newPage();
    await page.goto(`chrome-extension://${new URL(own.url()).host}/popup.html`);
    const result = await page.evaluate(() => chrome.runtime.sendMessage({
      type: 'apply', profile: { scheme: 'http', host: '127.0.0.1', port: 7890, scope: 'all' },
    }));
    assert.equal(result.ok, true);
    await competing.evaluate(() => chrome.proxy.settings.set({ scope: 'regular', value: { mode: 'direct' } }));
    assert.equal((await own.evaluate(() => chrome.proxy.settings.get({ incognito: false }))).levelOfControl, 'controlled_by_other_extensions');
    await page.reload();
    await page.waitForFunction(() => !document.querySelector('#disable')?.disabled);
    await page.getByRole('button', { name: '停用代理', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#feedback')?.textContent.includes('已释放'));
    const otherState = await competing.evaluate(() => chrome.proxy.settings.get({ incognito: false }));
    assert.equal(otherState.levelOfControl, 'controlled_by_this_extension');
    assert.equal(otherState.value.mode, 'direct');
    await competing.evaluate(() => chrome.proxy.settings.clear({ scope: 'regular' }));
    const finalState = await own.evaluate(() => chrome.proxy.settings.get({ incognito: false }));
    assert.equal(finalState.levelOfControl, 'controllable_by_this_extension');
    assert.equal(finalState.value.mode, 'system');
    console.log('PASS: two real extensions; release clears own dormant settings, preserves competitor, and prevents old proxy from resuming.');
  } finally {
    if (context) await context.close();
    await rm(profile, { recursive: true, force: true });
    await rm(other, { recursive: true, force: true });
  }
}
