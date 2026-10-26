import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { normalizeProfile, buildProxyConfig, parseProfileFile, serializeProfile } from '../extension/core.mjs';

const profile = { scheme: 'http', host: '127.0.0.1', port: 7890, scope: 'google' };

test('normalizes valid input and rejects addresses that can inject PAC or embed credentials', () => {
  assert.deepEqual(normalizeProfile({ ...profile, host: ' EXAMPLE.COM ', port: '8080' }),
    { scheme: 'http', host: 'example.com', port: 8080, scope: 'google' });
  assert.equal(normalizeProfile({ ...profile, host: '[::1]' }).host, '::1');
  for (const change of [
    { port: 0 }, { port: 65536 }, { port: '1e3' }, { port: 1.5 }, { port: true },
    { scheme: 'socks4' }, { scope: 'unknown' }, { host: '' }, { host: 'user:pass@host' },
    { host: 'https://example.com' }, { host: 'host/path' }, { host: 'a b' },
    { host: 'a";return "DIRECT' }, { host: 'a\n.example' }, { host: '999.1.1.1' },
    { host: '127.000.000.001' }, { host: '0177.0.0.1' },
    { host: '0x7f.0.0.1' }, { host: '0x7f000001' },
  ]) assert.throws(() => normalizeProfile({ ...profile, ...change }), undefined, JSON.stringify(change));
});

test('Google PAC has hostname boundaries and no direct fallback for matched traffic', () => {
  const config = buildProxyConfig(profile);
  assert.equal(config.mode, 'pac_script');
  const sandbox = {};
  vm.runInNewContext(config.pacScript.data, sandbox);
  for (const host of ['google.com', 'mail.google.com', 'chromewebstore.google.com', 'fonts.gstatic.com', 'scholar.google.com']) {
    assert.equal(sandbox.FindProxyForURL('https://' + host, host), 'PROXY 127.0.0.1:7890');
  }
  for (const host of ['evilgoogle.com', 'google.com.evil.test', 'example.com', 'localhost', '127.0.0.1']) {
    assert.equal(sandbox.FindProxyForURL('http://' + host, host), 'DIRECT');
  }
  assert.equal(sandbox.FindProxyForURL('https://MAIL.GOOGLE.COM.', 'MAIL.GOOGLE.COM.'), 'PROXY 127.0.0.1:7890');
});

test('all-site config and Google PAC use the selected transport and bypass loopback', () => {
  assert.deepEqual(buildProxyConfig({ ...profile, scope: 'all', scheme: 'socks5' }), {
    mode: 'fixed_servers', rules: {
      singleProxy: { scheme: 'socks5', host: '127.0.0.1', port: 7890 },
      bypassList: ['<local>', 'localhost', '127.0.0.1', '[::1]'],
    },
  });
  const sandbox = {};
  vm.runInNewContext(buildProxyConfig({ ...profile, host: '::1', scheme: 'https' }).pacScript.data, sandbox);
  assert.equal(sandbox.FindProxyForURL('https://google.com', 'google.com'), 'HTTPS [::1]:7890');
});

test('configuration export/import is versioned, normalized, and excludes unrelated properties', () => {
  const text = serializeProfile({ ...profile, password: 'never-export' });
  assert.equal(text.includes('never-export'), false);
  assert.deepEqual(parseProfileFile(text), profile);
  for (const text of ['{bad', '{}', '{"version":2,"profile":{}}', 'null']) {
    assert.throws(() => parseProfileFile(text));
  }
});
