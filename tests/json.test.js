// The JSON export keeps the shape of an answer, where the TSV flattens
// everything to text. That is the whole reason it exists, so these tests are
// about types as much as values.
//
// Run with: pnpm test

import test from 'node:test';
import assert from 'node:assert/strict';

import { fields, emptyState } from '../src/lib/fields.ts';
import { toJson, toJsonText } from '../src/lib/json.ts';

test('every question appears, once, under its own name', () => {
  const shaped = toJson(emptyState());
  assert.deepEqual(Object.keys(shaped), fields.map((field) => field.name));
});

test('text is a string, answered or not', () => {
  const state = emptyState();
  state.values.plan = 'Phoenix Plan';
  const shaped = toJson(state);
  assert.equal(shaped.plan, 'Phoenix Plan');
  assert.equal(shaped.task, '', 'an unanswered question is an empty string, not null');
});

test('a tick list is an array, empty when nothing is ticked', () => {
  const state = emptyState();
  state.checked.ai_usage = ['agentic', 'test_generation'];
  const shaped = toJson(state);
  assert.deepEqual(shaped.ai_usage, ['agentic', 'test_generation']);
  assert.deepEqual(shaped.governance_checklist, []);
});

test('a number is a number, and null when unanswered', () => {
  const state = emptyState();
  state.numbers.flow_velocity = 12;
  state.numbers.dist_features = 62.5;
  state.numbers.enps = -25;
  const shaped = toJson(state);
  assert.equal(shaped.flow_velocity, 12);
  assert.equal(typeof shaped.flow_velocity, 'number', 'a number, not a string of one');
  assert.equal(shaped.dist_features, 62.5);
  assert.equal(shaped.enps, -25);
  assert.equal(shaped.flow_load, null, 'unanswered is null, not zero and not ""');
});

test('a number answered zero is zero, not null', () => {
  const state = emptyState();
  state.numbers.flow_velocity = 0;
  assert.equal(toJson(state).flow_velocity, 0);
});

test('nothing is escaped, because JSON escapes for itself', () => {
  const state = emptyState();
  state.values.notes = 'one\ttwo\nthree\\four';
  // The answer survives as written, and JSON.parse gives it back unchanged.
  assert.equal(toJson(state).notes, 'one\ttwo\nthree\\four');
  const roundTripped = JSON.parse(toJsonText(state));
  assert.equal(roundTripped.notes, 'one\ttwo\nthree\\four', 'no doubled backslashes');
});

test('the text is valid JSON, and ends with a newline', () => {
  const state = emptyState();
  state.values.plan = 'Phoenix Plan';
  const text = toJsonText(state);
  assert.doesNotThrow(() => JSON.parse(text));
  assert.ok(text.endsWith('\n'));
});
