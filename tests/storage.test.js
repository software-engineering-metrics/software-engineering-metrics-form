// Keeping answers in the browser. Most of what matters here is what happens
// when the saved copy is not what the code hoped for: an old shape, a renamed
// question, a browser that refuses to store anything at all. None of that may
// lose an answer or throw.
//
// Run with: pnpm test

import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * An in-memory Web Storage, complete enough to stand in for the real one.
 * @returns {Storage}
 */
function stubStorage() {
  /** @type {Map<string, string>} */
  const entries = new Map();
  return {
    getItem: (key) => (entries.has(key) ? (entries.get(key) ?? null) : null),
    setItem: (key, value) => void entries.set(key, String(value)),
    removeItem: (key) => void entries.delete(key),
    clear: () => entries.clear(),
    key: (index) => [...entries.keys()][index] ?? null,
    get length() {
      return entries.size;
    }
  };
}

/**
 * A browser with storage turned off throws on every access.
 * @returns {Storage}
 */
function refusingStorage() {
  /** @returns {never} */
  const refuse = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError');
  };
  return {
    getItem: refuse,
    setItem: refuse,
    removeItem: refuse,
    clear: refuse,
    key: refuse,
    get length() {
      return refuse();
    }
  };
}

globalThis.localStorage = stubStorage();

const { emptyState } = await import('../src/lib/fields.ts');
const storage = await import('../src/lib/storage.ts');

test('what is saved comes back', () => {
  globalThis.localStorage = stubStorage();
  const state = emptyState();
  state.values.plan = 'Phoenix Plan';
  state.numbers.flow_velocity = 0;
  state.checked.ai_usage = ['agentic'];

  storage.save(state);
  const loaded = storage.load();

  assert.equal(loaded.values.plan, 'Phoenix Plan');
  assert.equal(loaded.numbers.flow_velocity, 0, 'zero survives, rather than reading as absent');
  assert.deepEqual(loaded.checked.ai_usage, ['agentic']);
});

test('nothing saved yet loads as a blank form, not as nothing', () => {
  globalThis.localStorage = stubStorage();
  const loaded = storage.load();
  assert.deepEqual(loaded, emptyState());
});

test('a question the saved copy has never heard of is left blank', () => {
  globalThis.localStorage = stubStorage();
  globalThis.localStorage.setItem(
    storage.STORAGE_KEY,
    JSON.stringify({ values: { plan: 'Phoenix Plan' }, numbers: {}, checked: {} })
  );
  const loaded = storage.load();
  assert.equal(loaded.values.plan, 'Phoenix Plan');
  assert.equal(loaded.values.task, '', 'a question absent from the saved copy still exists');
});

test('a saved answer under a name no question uses is dropped', () => {
  globalThis.localStorage = stubStorage();
  globalThis.localStorage.setItem(
    storage.STORAGE_KEY,
    JSON.stringify({ values: { which_plan: 'from before a rename' }, numbers: {}, checked: {} })
  );
  const loaded = storage.load();
  assert.ok(!('which_plan' in loaded.values), 'a renamed question leaves no ghost behind');
});

test('a saved answer of the wrong type is ignored, not trusted', () => {
  globalThis.localStorage = stubStorage();
  globalThis.localStorage.setItem(
    storage.STORAGE_KEY,
    JSON.stringify({
      values: { plan: 42 },
      numbers: { flow_velocity: 'lots' },
      checked: { ai_usage: 'agentic' }
    })
  );
  const loaded = storage.load();
  assert.equal(loaded.values.plan, '');
  assert.equal(loaded.numbers.flow_velocity, undefined);
  assert.deepEqual(loaded.checked.ai_usage, []);
});

test('a checklist keeps only the strings it was given', () => {
  globalThis.localStorage = stubStorage();
  globalThis.localStorage.setItem(
    storage.STORAGE_KEY,
    JSON.stringify({ values: {}, numbers: {}, checked: { ai_usage: ['agentic', 7, null] } })
  );
  assert.deepEqual(storage.load().checked.ai_usage, ['agentic']);
});

test('a corrupt saved copy loads as a blank form rather than throwing', () => {
  globalThis.localStorage = stubStorage();
  globalThis.localStorage.setItem(storage.STORAGE_KEY, 'not json at all');
  assert.deepEqual(storage.load(), emptyState());

  globalThis.localStorage.setItem(storage.STORAGE_KEY, 'null');
  assert.deepEqual(storage.load(), emptyState());
});

test('clearing removes the saved copy', () => {
  globalThis.localStorage = stubStorage();
  storage.save(emptyState());
  assert.equal(globalThis.localStorage.length, 1);
  storage.clear();
  assert.equal(globalThis.localStorage.length, 0);
});

// Safari in private mode, and a browser with storage disabled, throw on
// access. The form has to stay usable.
test('a browser that refuses to store anything does not break the form', () => {
  globalThis.localStorage = refusingStorage();
  assert.doesNotThrow(() => storage.save(emptyState()));
  assert.doesNotThrow(() => storage.clear());
  assert.deepEqual(storage.load(), emptyState(), 'a blank form, not an exception');
});

test('a refusal is reported, so the page can say so rather than fail silently', () => {
  globalThis.localStorage = refusingStorage();
  assert.equal(storage.save(emptyState()), false);
  assert.equal(storage.clear(), false);

  globalThis.localStorage = stubStorage();
  assert.equal(storage.save(emptyState()), true);
  assert.equal(storage.clear(), true);
});
