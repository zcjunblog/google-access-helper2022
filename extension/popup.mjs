import {
  DEFAULT_PROFILE, DIAGNOSTIC_TARGETS, DIAGNOSTIC_ORIGINS,
  normalizeProfile, parseProfileFile, serializeProfile,
} from './core.mjs';

const $ = id => document.getElementById(id);
const ui = {
  app: $('app'), form: $('profile-form'), fields: $('profile-fields'),
  scheme: $('scheme'), host: $('host'), port: $('port'),
  google: $('scope-google'), all: $('scope-all'),
  status: $('status-card'), title: $('status-title'), detail: $('status-detail'),
  badge: $('status-badge'), note: $('status-note'), feedback: $('feedback'),
  save: $('save'), apply: $('apply'), disable: $('disable'), diagnose: $('diagnose'),
  import: $('import'), export: $('export'), file: $('import-file'),
  results: $('diagnostic-results'), diagnosticTime: $('diagnostic-time'),
};
let currentState = null;
let busy = true;
let dirty = false;
let refreshInFlight = null;

function showFeedback(message, kind = 'success') {
  ui.feedback.textContent = message;
  ui.feedback.dataset.kind = kind;
  ui.feedback.hidden = false;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error || '操作未完成，请重试。');
}

function runtimeAvailable() {
  return typeof globalThis.chrome?.runtime?.sendMessage === 'function';
}

async function send(type, profile) {
  if (!runtimeAvailable()) throw new Error('无法连接扩展。请在 Chrome 中加载此扩展后打开弹窗。');
  const response = await chrome.runtime.sendMessage(profile ? { type, profile } : { type });
  if (!response?.ok) throw new Error(response?.error || '扩展未返回有效响应，请重新打开弹窗。');
  return response.data;
}

function setForm(profile) {
  ui.scheme.value = profile.scheme;
  ui.host.value = profile.host;
  ui.port.value = String(profile.port);
  ui.google.checked = profile.scope === 'google';
  ui.all.checked = profile.scope === 'all';
  dirty = false;
}

function readForm() {
  return normalizeProfile({
    scheme: ui.scheme.value,
    host: ui.host.value.trim(),
    port: Number(ui.port.value),
    scope: ui.all.checked ? 'all' : 'google',
  });
}

function controlBlocked() {
  return currentState && !['controllable_by_this_extension', 'controlled_by_this_extension'].includes(currentState.levelOfControl);
}

function updateControls() {
  const ready = Boolean(currentState) && runtimeAvailable();
  ui.app.setAttribute('aria-busy', String(busy));
  ui.fields.disabled = busy || !ready;
  ui.save.disabled = busy || !ready;
  ui.apply.disabled = busy || !ready || controlBlocked();
  ui.disable.disabled = busy || !ready;
  ui.diagnose.disabled = busy || !ready || typeof globalThis.chrome?.permissions?.request !== 'function';
  ui.import.disabled = busy || !ready;
  ui.export.disabled = busy || !ready;
  ui.file.disabled = busy || !ready;
}

function setBusy(value) {
  busy = value;
  updateControls();
}

function renderState(state, updateForm = false) {
  currentState = state;
  if (updateForm || !dirty) setForm(state.profile);
  const blocked = controlBlocked();
  ui.status.dataset.state = blocked ? 'error' : state.enabled ? 'enabled' : 'idle';
  ui.title.textContent = state.enabled ? '已启用代理' : '未启用代理';
  ui.badge.textContent = blocked ? '控制受限' : state.enabled ? '代理已接管' : '按需启用';
  if (blocked) {
    ui.detail.textContent = state.levelOfControl === 'controlled_by_other_extensions'
      ? '代理正由其他扩展控制。请先在对应扩展中释放控制权。'
      : '浏览器策略不允许此扩展修改代理，请检查浏览器管理设置。';
  } else if (state.enabled) {
    const scope = state.effectiveMode === 'fixed_servers' ? '全部网站' : state.effectiveMode === 'pac_script' ? 'Google 服务' : '代理连接';
    const host = state.profile.host.includes(':') ? `[${state.profile.host}]` : state.profile.host;
    const description = state.matchesSaved
      ? `${state.profile.scheme.toUpperCase()} ${host}:${state.profile.port}`
      : state.activeDescription || '浏览器已应用代理设置';
    ui.detail.textContent = description.includes(scope) ? description : `${scope} · ${description}`;
  } else {
    ui.detail.textContent = '点击「保存并启用」，通过你的代理服务访问网站。';
  }
  ui.note.textContent = state.enabled
    ? state.matchesSaved ? '当前代理与已保存配置一致' : '当前生效设置与已保存配置不同'
    : '保存配置不会改变当前网络连接';
  updateControls();
}

async function refreshState(updateForm = false) {
  if (refreshInFlight) await refreshInFlight;
  const request = send('state');
  refreshInFlight = request;
  try {
    const state = await request;
    renderState(state, updateForm);
    return state;
  } finally {
    if (refreshInFlight === request) refreshInFlight = null;
  }
}

async function perform(action, successText) {
  if (busy) return;
  setBusy(true);
  try {
    await action();
    await refreshState(true);
    showFeedback(successText);
  } catch (error) {
    showFeedback(errorMessage(error), 'error');
    try { await refreshState(); } catch { /* Preserve the operation error. */ }
  } finally {
    setBusy(false);
  }
}

function validForm() {
  return ui.form.reportValidity();
}

ui.form.addEventListener('input', () => { dirty = true; });
ui.form.addEventListener('change', () => { dirty = true; });
ui.form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validForm()) return;
  void perform(() => send('save', readForm()), '配置已保存。点击「保存并启用」可应用此配置。');
});
ui.apply.addEventListener('click', () => {
  if (!validForm()) return;
  void perform(() => send('apply', readForm()), '配置已保存并启用，当前状态已从浏览器刷新。');
});
ui.disable.addEventListener('click', () => {
  void perform(() => send('disable'), '已释放本扩展的代理设置，其他扩展或系统设置不受影响。');
});

function renderDiagnostics(data) {
  ui.results.replaceChildren();
  const labels = new Map(DIAGNOSTIC_TARGETS.map(target => [target.id, target.label]));
  const descriptions = { ok: '连接成功', 'http-error': 'HTTP 错误', timeout: '请求超时', 'network-error': '网络连接失败' };
  for (const result of data.results) {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = labels.get(result.id) || result.label || result.id;
    const value = document.createElement('span');
    value.className = 'diagnostic-result-value';
    value.dataset.status = result.status;
    const http = result.httpStatus == null ? '' : ` · HTTP ${result.httpStatus}`;
    const duration = Number.isFinite(result.durationMs) ? ` · ${Math.round(result.durationMs)} ms` : '';
    value.textContent = `${descriptions[result.status] || '未知结果'}${http}${duration}`;
    row.append(label, value);
    ui.results.append(row);
  }
  ui.results.hidden = false;
  const checkedAt = new Date(data.checkedAt);
  ui.diagnosticTime.textContent = Number.isNaN(checkedAt.valueOf()) ? '' : `检查时间：${checkedAt.toLocaleString('zh-CN', { hour12: false })}`;
  ui.diagnosticTime.hidden = !ui.diagnosticTime.textContent;
}

ui.diagnose.addEventListener('click', async () => {
  if (busy) return;
  if (typeof globalThis.chrome?.permissions?.request !== 'function') {
    showFeedback('当前环境不支持扩展权限请求，请在 Chrome 扩展弹窗中运行。', 'error');
    return;
  }
  setBusy(true);
  try {
    // Request immediately in the click gesture, before any asynchronous work.
    const granted = await chrome.permissions.request({ origins: DIAGNOSTIC_ORIGINS });
    if (!granted) {
      showFeedback('未获得网站访问权限，未开始诊断。你可以稍后再次点击授权。', 'error');
      return;
    }
    showFeedback('正在检查三个服务的真实连接，请稍候…');
    const data = await send('diagnose');
    renderDiagnostics(data);
    const passed = data.results.filter(result => result.status === 'ok').length;
    showFeedback(`诊断完成：${passed}/${data.results.length} 项连接成功。${passed === data.results.length ? '' : '请查看下方结果，并检查代理服务是否可用。'}`, passed === data.results.length ? 'success' : 'error');
  } catch (error) {
    showFeedback(errorMessage(error), 'error');
  } finally {
    try { await refreshState(); } catch (error) { showFeedback(errorMessage(error), 'error'); }
    setBusy(false);
  }
});

ui.import.addEventListener('click', () => {
  if (!busy) ui.file.click();
});
ui.file.addEventListener('change', () => {
  const file = ui.file.files?.[0];
  ui.file.value = '';
  if (!file) return;
  void perform(async () => {
    if (file.size > 65536) throw new Error('配置文件过大，请选择小于 64 KB 的 JSON 配置文件。');
    const profile = parseProfileFile(await file.text());
    await send('save', profile);
  }, '配置已导入并保存。点击「保存并启用」后才会应用。');
});
ui.export.addEventListener('click', () => {
  if (busy || !currentState) return;
  let url;
  try {
    const contents = serializeProfile(currentState.profile);
    url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'google-access-helper-profile.json';
    document.body.append(link);
    link.click();
    link.remove();
    showFeedback('已导出已保存的配置。文件不包含密码或其他凭据。');
  } catch (error) {
    showFeedback(errorMessage(error), 'error');
  } finally {
    if (url) setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
});

window.addEventListener('focus', () => {
  if (busy) return;
  void refreshState().catch(error => showFeedback(errorMessage(error), 'error'));
});

setForm(DEFAULT_PROFILE);
try {
  await refreshState(true);
} catch (error) {
  ui.status.dataset.state = 'error';
  ui.title.textContent = '无法读取代理状态';
  ui.badge.textContent = '连接异常';
  ui.detail.textContent = '请确认扩展已正确加载，再重新打开弹窗。';
  showFeedback(errorMessage(error), 'error');
} finally {
  setBusy(false);
}
