import { DIAGNOSTIC_ORIGINS } from './core.mjs';
import { createController } from './controller.mjs';
import { runDiagnostics } from './diagnostics.mjs';

const hasDiagnosticPermission = () => chrome.permissions.contains({ origins: [...DIAGNOSTIC_ORIGINS] });
const controller = createController({
  readProfile: async () => (await chrome.storage.local.get('profile')).profile,
  writeProfile: profile => chrome.storage.local.set({ profile }),
  getProxy: () => chrome.proxy.settings.get({ incognito: false }),
  setProxy: value => chrome.proxy.settings.set({ value, scope: 'regular' }),
  clearProxy: () => chrome.proxy.settings.clear({ scope: 'regular' }),
  hasDiagnosticPermission,
});

async function updateBadge() {
  const state = await controller.getState();
  await chrome.action.setBadgeText({ text: state.enabled ? 'ON' : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#166b54' });
  await chrome.action.setTitle({ title: `Google Access Helper · ${state.enabled ? '代理已启用' : '未启用代理'}` });
}

async function handle(message) {
  let data;
  switch (message?.type) {
    case 'state': return controller.getState();
    case 'save': data = await controller.save(message.profile); break;
    case 'apply': data = await controller.apply(message.profile); break;
    case 'disable': data = await controller.disable(); break;
    case 'diagnose': return runDiagnostics({ hasPermission: hasDiagnosticPermission });
    default: throw new Error('不支持的操作。');
  }
  await updateBadge();
  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return false;
  handle(message).then(data => sendResponse({ ok: true, data }), error => sendResponse({ ok: false, error: error.message || '操作失败，请重试。' }));
  return true;
});

const refresh = () => { updateBadge().catch(error => console.warn('状态更新失败：', error.message)); };
chrome.runtime.onInstalled.addListener(refresh);
chrome.runtime.onStartup.addListener(refresh);
chrome.proxy.settings.onChange.addListener(refresh);
