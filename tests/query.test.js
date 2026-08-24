// Pre-filling from a link. The rule is that a parameter's name is the
// question's name, and a value a question does not offer is ignored rather
// than guessed at, so these tests are mostly about what does NOT happen.
//
// Run with: pnpm test

import test from 'node:test';
import assert from 'node:assert/strict';

import { emptyState } from '../src/lib/fields.ts';
import { applyQuery } from '../src/lib/query.ts';

/**
 * @param {string} search
 * @returns {{ state: import('../src/lib/fields.ts').FormState, result: import('../src/lib/query.ts').QueryResult }}
 */
function fill(search) {
  const state = emptyState();
  const result = applyQuery(state, new URLSearchParams(search));
  return { state, result };
}

test('a link fills the questions it names', () => {
  const { state, result } = fill(
    '?organization=ACME+Inc&plan=Phoenix+Plan&date=2026-12-31&time=12:59'
  );
  assert.equal(state.values.organization, 'ACME Inc');
  assert.equal(state.values.plan, 'Phoenix Plan');
  assert.equal(state.values.date, '2026-12-31');
  assert.equal(state.values.time, '12:59');
  assert.deepEqual(result.ignored, []);
});

test('a link leaves every question it does not name alone', () => {
  const { state } = fill('?plan=Phoenix+Plan');
  assert.equal(state.values.task, '');
  assert.equal(state.values.email, '');
  assert.equal(state.numbers.flow_velocity, undefined);
});

test('a select takes a value it offers', () => {
  const { state, result } = fill('?collection=automatic&confidence=high');
  assert.equal(state.values.collection, 'automatic');
  assert.equal(state.values.confidence, 'high');
  assert.deepEqual(result.ignored, []);
});

test('a select refuses a value it does not offer, and says so', () => {
  const { state, result } = fill('?collection=automated&confidence=HIGH');
  assert.equal(state.values.collection, '', 'no near-enough matching');
  assert.equal(state.values.confidence, '', 'no case folding');
  assert.deepEqual(result.ignored, ['collection=automated', 'confidence=HIGH']);
});

test('a radio takes a value it offers and refuses one it does not', () => {
  assert.equal(fill('?charter_exists=in_progress').state.values.charter_exists, 'in_progress');
  const { state, result } = fill('?charter_exists=maybe');
  assert.equal(state.values.charter_exists, '');
  assert.deepEqual(result.ignored, ['charter_exists=maybe']);
});

test('a number arrives as a number, and zero counts as an answer', () => {
  const { state } = fill('?flow_velocity=0&dist_features=62.5&enps=-25');
  assert.equal(state.numbers.flow_velocity, 0);
  assert.equal(state.numbers.dist_features, 62.5);
  assert.equal(state.numbers.enps, -25);
});

test('a number question refuses text', () => {
  const { state, result } = fill('?flow_velocity=lots');
  assert.equal(state.numbers.flow_velocity, undefined);
  assert.deepEqual(result.ignored, ['flow_velocity=lots']);
});

test('a checklist takes a repeated parameter', () => {
  const { state, result } = fill('?ai_usage=agentic&ai_usage=test_generation');
  assert.deepEqual(state.checked.ai_usage, ['agentic', 'test_generation']);
  assert.deepEqual(result.ignored, []);
});

test('a checklist keeps the values it offers and reports the rest', () => {
  const { state, result } = fill('?ai_usage=agentic&ai_usage=telepathy');
  assert.deepEqual(state.checked.ai_usage, ['agentic']);
  assert.deepEqual(result.ignored, ['ai_usage=telepathy']);
});

test('an empty parameter is not an answer', () => {
  const { state, result } = fill('?plan=&collection=');
  assert.equal(state.values.plan, '');
  assert.equal(state.values.collection, '');
  assert.deepEqual(result.applied, []);
});

test('a parameter naming no question is ignored entirely', () => {
  const { result } = fill('?utm_source=newsletter&plan=Phoenix+Plan');
  assert.deepEqual(result.applied, ['plan']);
  assert.deepEqual(result.ignored, []);
});

// The long form asks 240 questions, and every one of them is addressable by
// the same rule, with no list to keep in step.
test('a question outside the opening section is reachable too', () => {
  const { state } = fill('?mttr_median=42&sli_name=successful+requests');
  assert.equal(state.numbers.mttr_median, 42);
  assert.equal(state.values.sli_name, 'successful requests');
});
