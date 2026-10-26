import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('release ZIP is reproducible, contains all runtime files, and matches its checksum', () => {
  const out = mkdtempSync(path.join(tmpdir(), 'gah-package-'));
  try {
    const run = () => spawnSync('python3', ['scripts/package.py', '--out-dir', out], { encoding: 'utf8' });
    let result = run();
    assert.equal(result.status, 0, result.stderr);
    const version = JSON.parse(readFileSync('extension/manifest.json', 'utf8')).version;
    const zip = path.join(out, `google-access-helper-${version}.zip`);
    const before = readFileSync(zip);
    result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readFileSync(zip), before);
    const checked = spawnSync('python3', ['-c', `
import sys,zipfile,json,hashlib
from pathlib import Path
p=Path(sys.argv[1])
with zipfile.ZipFile(p) as z:
    assert z.testzip() is None
    names=z.namelist()
    m=json.loads(z.read('google-access-helper/manifest.json'))
    assert m['manifest_version']==3
    assert m['version']==sys.argv[2]
    for f in ['background.mjs','core.mjs','controller.mjs','diagnostics.mjs','popup.html','popup.mjs','popup.css','icons/128.png']:
        assert 'google-access-helper/'+f in names, f
assert (p.parent/'SHA256SUMS').read_text().strip()==hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name
print('valid')
`, zip, version], { encoding: 'utf8' });
    assert.equal(checked.status, 0, checked.stderr);
    assert.equal(checked.stdout.trim(), 'valid');
  } finally { rmSync(out, { recursive: true, force: true }); }
});

test('packager rejects missing runtime resources instead of shipping a broken extension', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'gah-bad-package-'));
  try {
    const source = path.join(root, 'extension');
    mkdirSync(source);
    writeFileSync(path.join(source, 'manifest.json'), JSON.stringify({ manifest_version: 3, version: '1.0.0', background: { service_worker: 'missing.mjs' }, action: { default_popup: 'missing.html' } }));
    const result = spawnSync('python3', ['scripts/package.py', '--source', source, '--out-dir', path.join(root, 'dist')], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /缺少|missing/i);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
