import { DIAGNOSTIC_TARGETS } from './core.mjs';

export async function probeTarget(target, { fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const started = performance.now();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const result = { id: target.id, label: target.label, status: 'network-error', httpStatus: null, durationMs: 0 };
  try {
    const response = await fetchImpl(target.url, {
      method: 'GET', credentials: 'omit', redirect: 'error', cache: 'no-store', signal: controller.signal,
    });
    result.httpStatus = response.status;
    result.status = response.ok ? 'ok' : 'http-error';
    await response.body?.cancel();
  } catch {
    result.status = controller.signal.aborted ? 'timeout' : 'network-error';
  } finally {
    clearTimeout(timer);
    result.durationMs = Math.max(0, Math.round(performance.now() - started));
  }
  return result;
}

export async function runDiagnostics({ hasPermission, fetchImpl = fetch }) {
  if (!await hasPermission()) throw new Error('请先允许连接诊断所需的网站访问权限。');
  const results = await Promise.all(DIAGNOSTIC_TARGETS.map(target => probeTarget(target, { fetchImpl })));
  return { results, checkedAt: new Date().toISOString() };
}
