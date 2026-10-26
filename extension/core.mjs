export const DEFAULT_PROFILE = Object.freeze({ scheme: 'http', host: '127.0.0.1', port: 7890, scope: 'google' });
export const DIAGNOSTIC_TARGETS = Object.freeze([
  Object.freeze({ id: 'search', label: 'Google 搜索', url: 'https://www.google.com/generate_204' }),
  Object.freeze({ id: 'store', label: 'Chrome 商店', url: 'https://chromewebstore.google.com/' }),
  Object.freeze({ id: 'scholar', label: 'Google 学术', url: 'https://scholar.google.com/' }),
]);
export const DIAGNOSTIC_ORIGINS = Object.freeze(DIAGNOSTIC_TARGETS.map(target => new URL(target.url).origin + '/*'));

const GOOGLE_DOMAINS = [
  'google.com', 'google.com.hk', 'google.com.tw', 'google.co.jp', 'google.co.uk',
  'google.de', 'google.fr', 'google.ca', 'google.com.au', 'googleapis.com',
  'gstatic.com', 'googleusercontent.com', 'ggpht.com',
];

export function normalizeProfile(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('配置必须是有效对象。');
  const { scheme, scope } = input;
  if (!['http', 'https', 'socks5'].includes(scheme)) throw new Error('请选择 HTTP、HTTPS 或 SOCKS5 协议。');
  if (!['google', 'all'].includes(scope)) throw new Error('请选择 Google 域名或全部网站范围。');
  if (typeof input.host !== 'string') throw new Error('请填写代理地址。');
  let host = input.host.trim().toLowerCase();
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1);
  if (!host || host.length > 253 || /[\s/@?#\\"']/.test(host)) throw new Error('代理地址只能填写域名或 IP，不包含协议、路径或账号。');
  if (host.includes(':')) {
    try {
      host = new URL(`http://[${host}]/`).hostname.slice(1, -1);
    } catch {
      throw new Error('IPv6 地址格式无效；端口请填写在单独的端口栏。');
    }
  } else {
    host = host.replace(/\.$/, '');
    if (!host.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
      throw new Error('请填写有效的域名或 IP 地址。');
    }
    if (/^[\d.]+$/.test(host) && !(host.split('.').length === 4 &&
        host.split('.').every(part => (part === '0' || !part.startsWith('0')) && Number(part) <= 255))) {
      throw new Error('IPv4 地址需使用四段十进制数字，不要添加前导零。');
    }
    // URL parsing also recognizes hexadecimal IPv4 aliases; do not let Chrome
    // silently rewrite an address after we have stored and displayed it.
    let canonical;
    try { canonical = new URL(`http://${host}/`).hostname; }
    catch { throw new Error('代理地址格式无效，请填写规范的域名或 IP。'); }
    if (canonical !== host) throw new Error('请使用规范的域名或四段十进制 IPv4 地址。');
  }
  const rawPort = typeof input.port === 'string' ? input.port.trim() : input.port;
  if ((typeof rawPort !== 'number' && !(typeof rawPort === 'string' && /^\d+$/.test(rawPort))) ||
      !Number.isInteger(Number(rawPort)) || Number(rawPort) < 1 || Number(rawPort) > 65535) {
    throw new Error('端口必须是 1 到 65535 之间的整数。');
  }
  return { scheme, host, port: Number(rawPort), scope };
}

export function buildProxyConfig(input) {
  const profile = normalizeProfile(input);
  const bypassList = ['<local>', 'localhost', '127.0.0.1', '[::1]'];
  if (profile.scope === 'all') return {
    mode: 'fixed_servers',
    rules: { singleProxy: { scheme: profile.scheme, host: profile.host, port: profile.port }, bypassList },
  };
  const directive = { http: 'PROXY', https: 'HTTPS', socks5: 'SOCKS5' }[profile.scheme];
  const host = profile.host.includes(':') ? `[${profile.host}]` : profile.host;
  const proxy = `${directive} ${host}:${profile.port}`;
  const data = `// Google Access Helper: generated domain rules\nfunction FindProxyForURL(url, host) {\n` +
    `  host = host.toLowerCase().replace(/\\.$/, "");\n` +
    `  var domains = ${JSON.stringify(GOOGLE_DOMAINS)};\n` +
    `  for (var i = 0; i < domains.length; i++) {\n` +
    `    var domain = domains[i];\n` +
    `    if (host === domain || host.slice(-(domain.length + 1)) === "." + domain) return ${JSON.stringify(proxy)};\n` +
    `  }\n  return "DIRECT";\n}\n`;
  return { mode: 'pac_script', pacScript: { data, mandatory: true } };
}

export function configMatches(value, input) {
  const expected = buildProxyConfig(input);
  if (value?.mode !== expected.mode) return false;
  if (expected.mode === 'pac_script') return value.pacScript?.data === expected.pacScript.data;
  const actual = value.rules?.singleProxy;
  const target = expected.rules.singleProxy;
  return actual?.scheme === target.scheme && actual.host === target.host && actual.port === target.port &&
    JSON.stringify([...(value.rules.bypassList || [])].sort()) === JSON.stringify([...expected.rules.bypassList].sort());
}

export function parseProfileFile(text) {
  if (typeof text !== 'string' || text.length > 65536) throw new Error('配置文件必须是小于 64 KB 的 JSON 文本。');
  let data;
  try { data = JSON.parse(text.replace(/^\uFEFF/, '')); }
  catch { throw new Error('配置文件不是有效的 JSON。'); }
  if (data?.version !== 1) throw new Error('配置文件版本不受支持，需要 version: 1。');
  return normalizeProfile(data.profile);
}

export function serializeProfile(profile) {
  return JSON.stringify({ version: 1, profile: normalizeProfile(profile) }, null, 2) + '\n';
}
