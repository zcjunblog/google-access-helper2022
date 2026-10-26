import test from 'node:test';
import assert from 'node:assert/strict';
import { createController } from '../extension/controller.mjs';
import { DEFAULT_PROFILE, buildProxyConfig } from '../extension/core.mjs';

function fixture(level = 'controllable_by_this_extension') {
  let saved;
  let current = { levelOfControl: level, value: { mode: 'system' } };
  const calls = [];
  const adapter = {
    readProfile: async () => saved,
    writeProfile: async value => { saved = structuredClone(value); calls.push('save'); },
    getProxy: async () => structuredClone(current),
    setProxy: async value => { calls.push('set'); current = { levelOfControl: 'controlled_by_this_extension', value }; },
    clearProxy: async () => {
      calls.push('clear');
      if (current.levelOfControl === 'controlled_by_this_extension') {
        current = { levelOfControl: 'controllable_by_this_extension', value: { mode: 'system' } };
      }
    },
    hasDiagnosticPermission: async () => false,
  };
  return { adapter, calls, controller: createController(adapter), current: () => current };
}

test('reading defaults and saving a profile never modifies proxy settings', async () => {
  const f = fixture();
  assert.deepEqual((await f.controller.getState()).profile, DEFAULT_PROFILE);
  const state = await f.controller.save({ ...DEFAULT_PROFILE, port: 8080 });
  assert.equal(state.enabled, false);
  assert.deepEqual(f.calls, ['save']);
});

test('apply reads live state and release restores lower-priority settings', async () => {
  const f = fixture();
  let state = await f.controller.apply(DEFAULT_PROFILE);
  assert.equal(state.enabled, true);
  assert.equal(state.matchesSaved, true);
  assert.deepEqual(f.current().value, buildProxyConfig(DEFAULT_PROFILE));
  state = await f.controller.save({ ...DEFAULT_PROFILE, port: 9999 });
  assert.equal(state.enabled, true);
  assert.equal(state.matchesSaved, false);
  assert.equal((await f.controller.disable()).enabled, false);
  assert.deepEqual(f.calls, ['save', 'set', 'save', 'clear']);
  assert.equal(f.current().value.mode, 'system');
});

test('does not apply over another extension or managed policy', async () => {
  for (const level of ['controlled_by_other_extensions', 'not_controllable']) {
    const f = fixture(level);
    await assert.rejects(f.controller.apply(DEFAULT_PROFILE));
    assert.deepEqual(f.calls, []);
  }
});

test('can release own dormant settings without changing another controller', async () => {
  for (const level of ['controlled_by_other_extensions', 'not_controllable']) {
    const f = fixture(level);
    const before = structuredClone(f.current());
    const state = await f.controller.disable();
    assert.deepEqual(f.calls, ['clear']);
    assert.deepEqual(f.current(), before);
    assert.equal(state.enabled, false);
    assert.equal(state.levelOfControl, level);
  }
});

test('failed browser setting is never reported as enabled', async () => {
  const f = fixture();
  f.adapter.setProxy = async () => { throw new Error('Chrome rejected settings'); };
  await assert.rejects(f.controller.apply(DEFAULT_PROFILE), /Chrome rejected/);
  assert.equal((await f.controller.getState()).enabled, false);
});

test('mutations preserve request order even while a browser operation is pending', async () => {
  const f = fixture();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const realSet = f.adapter.setProxy;
  f.adapter.setProxy = async config => { await gate; await realSet(config); };
  const applying = f.controller.apply(DEFAULT_PROFILE);
  const disabling = f.controller.disable();
  release();
  await Promise.all([applying, disabling]);
  assert.equal((await f.controller.getState()).enabled, false);
  assert.deepEqual(f.calls, ['save', 'set', 'clear']);
});

test('invalid configuration cannot persist or change the browser', async () => {
  const f = fixture();
  await assert.rejects(f.controller.apply({ ...DEFAULT_PROFILE, port: -1 }));
  assert.deepEqual(f.calls, []);
});
