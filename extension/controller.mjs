import { DEFAULT_PROFILE, normalizeProfile, buildProxyConfig, configMatches } from './core.mjs';

export function createController(adapter) {
  let tail = Promise.resolve();
  const exclusive = operation => {
    const pending = tail.then(operation);
    tail = pending.catch(() => {});
    return pending;
  };
  const readState = async () => {
    const stored = await adapter.readProfile();
    const profile = normalizeProfile(stored || DEFAULT_PROFILE);
    const detail = await adapter.getProxy();
    const enabled = detail.levelOfControl === 'controlled_by_this_extension';
    const current = detail.value;
    const server = current?.rules?.singleProxy;
    const activeDescription = current?.mode === 'pac_script' ? 'Google 域名规则' :
      server ? `${server.scheme.toUpperCase()} ${server.host}:${server.port} · 全部网站` : '沿用浏览器原有网络设置';
    return {
      profile, levelOfControl: detail.levelOfControl, enabled,
      matchesSaved: enabled && configMatches(current, profile),
      effectiveMode: current?.mode || 'unknown', activeDescription,
      diagnosticAllowed: await adapter.hasDiagnosticPermission(),
    };
  };
  const requireControl = detail => {
    if (detail.levelOfControl === 'not_controllable') throw new Error('代理设置由浏览器策略管理，无法修改。');
    if (!['controlled_by_this_extension', 'controllable_by_this_extension'].includes(detail.levelOfControl)) {
      throw new Error('代理设置正由其他扩展控制，请先停用冲突扩展。');
    }
  };
  return {
    getState: () => exclusive(readState),
    save: input => exclusive(async () => {
      await adapter.writeProfile(normalizeProfile(input));
      return readState();
    }),
    apply: input => exclusive(async () => {
      const profile = normalizeProfile(input);
      requireControl(await adapter.getProxy());
      await adapter.writeProfile(profile);
      await adapter.setProxy(buildProxyConfig(profile));
      const state = await readState();
      if (!state.enabled || !state.matchesSaved) throw new Error('浏览器未应用该配置，请检查其他扩展或管理策略。');
      return state;
    }),
    disable: () => exclusive(async () => {
      // Chrome clear() only removes this extension's setting, including a
      // dormant setting hidden beneath another extension or policy.
      await adapter.clearProxy();
      return readState();
    }),
  };
}
