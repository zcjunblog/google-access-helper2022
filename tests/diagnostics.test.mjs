import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { probeTarget, runDiagnostics } from '../extension/diagnostics.mjs';

test('real HTTP probes distinguish success, HTTP errors, redirects, timeout and connection failures', async () => {
  const server = http.createServer((request, response) => {
    assert.equal(request.headers.cookie, undefined);
    if (request.url === '/timeout') return;
    if (request.url === '/redirect') response.writeHead(302, { location: '/ok' });
    else response.writeHead(request.url === '/ok' ? 204 : 503);
    response.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [path, expected] of [['/ok', 'ok'], ['/fail', 'http-error'], ['/redirect', 'network-error'], ['/timeout', 'timeout']]) {
      const result = await probeTarget({ id: 'fixture', label: 'Fixture', url: base + path }, { timeoutMs: path === '/timeout' ? 60 : 1000 });
      assert.equal(result.status, expected, path);
      assert.ok(result.durationMs >= 0);
      if (path === '/fail') assert.equal(result.httpStatus, 503);
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  assert.equal((await probeTarget({ id: 'closed', label: 'Closed', url: base }, { timeoutMs: 60 })).status, 'network-error');
});

test('denied diagnostic permission prevents any network operation', async () => {
  let fetched = false;
  await assert.rejects(runDiagnostics({ hasPermission: async () => false, fetchImpl: async () => { fetched = true; } }));
  assert.equal(fetched, false);
});

test('diagnostics fetch only fixed targets with omitted credentials, redirect rejection, no cache', async () => {
  const seen = [];
  const output = await runDiagnostics({ hasPermission: async () => true, fetchImpl: async (url, options) => {
    seen.push([url, options.credentials, options.redirect, options.cache]);
    return new Response(null, { status: 204 });
  } });
  assert.deepEqual(seen, [
    ['https://www.google.com/generate_204', 'omit', 'error', 'no-store'],
    ['https://chromewebstore.google.com/', 'omit', 'error', 'no-store'],
    ['https://scholar.google.com/', 'omit', 'error', 'no-store'],
  ]);
  assert.equal(output.results.length, 3);
  assert.ok(output.results.every(result => result.status === 'ok'));
  assert.ok(!Number.isNaN(Date.parse(output.checkedAt)));
});
