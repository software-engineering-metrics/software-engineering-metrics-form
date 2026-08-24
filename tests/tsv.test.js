// The export is the product of the whole form, and an escaping bug here does
// not announce itself: it shifts a column silently, and the spreadsheet it
// lands in still opens.
//
// Run with: pnpm test

import test from 'node:test';
import assert from 'node:assert/strict';

import { fields, emptyState } from '../src/lib/fields.ts';
import { escapeCell, cellFor, toTSV, exportFilename } from '../src/lib/tsv.ts';

/**
 * The inverse of escapeCell, so reversibility can be asserted, not assumed.
 * @param {string} value
 * @returns {string}
 */
function unescapeCell(value) {
  let out = '';
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] !== '\\') {
      out += value[i];
      continue;
    }
    i += 1;
    if (value[i] === 't') out += '\t';
    else if (value[i] === 'n') out += '\n';
    else if (value[i] === '\\') out += '\\';
    else out += value[i];
  }
  return out;
}

test('a header row names every question, in order', () => {
  const [header] = toTSV(emptyState()).split('\n');
  assert.deepEqual(header.split('\t'), fields.map((field) => field.name));
});

test('the value row has a cell for every column, answered or not', () => {
  const [header, row] = toTSV(emptyState()).split('\n');
  assert.equal(row.split('\t').length, header.split('\t').length);
});

test('a tab or a newline in an answer cannot break the row apart', () => {
  const state = emptyState();
  state.values.notes = 'one\ttwo\nthree';
  const [header, row] = toTSV(state).split('\n');
  assert.equal(row.split('\t').length, header.split('\t').length, 'still one cell per column');
  assert.equal(toTSV(state).trimEnd().split('\n').length, 2, 'still two lines');
});

test('escaping is reversible, so nothing is lost to make text fit', () => {
  for (const original of [
    'plain',
    'one\ttwo',
    'line\nbreak',
    'windows\r\nbreak',
    'a\\backslash',
    'every\\one\ttogether\nat once',
    ''
  ]) {
    const roundTripped = unescapeCell(escapeCell(original));
    const expected = original.replace(/\r\n?/g, '\n'); // carriage returns normalize
    assert.equal(roundTripped, expected, `round trip of ${JSON.stringify(original)}`);
  }
});

test('a backslash is escaped before the tab and newline it could disguise', () => {
  // Were the order reversed, "\" + "t" would read back as a tab.
  assert.equal(escapeCell('\\t'), '\\\\t');
  assert.equal(unescapeCell(escapeCell('\\t')), '\\t');
});

test('a number answered zero is an answer, not an absence', () => {
  const state = emptyState();
  state.numbers.flow_velocity = 0;
  assert.equal(cellFor(state, 'flow_velocity'), '0');
  assert.equal(cellFor(state, 'flow_load'), '', 'unanswered stays empty');
});

test('a checklist keeps its several answers in one column', () => {
  const state = emptyState();
  state.checked.ai_usage = ['agentic', 'test_generation'];
  assert.equal(cellFor(state, 'ai_usage'), 'agentic|test_generation');
  assert.equal(cellFor(state, 'governance_checklist'), '', 'an unanswered checklist is empty');
});

test('the filename names the submission, and falls back when it cannot', () => {
  const state = emptyState();
  assert.equal(exportFilename(state), 'metrics.tsv');

  state.values.plan = 'Phoenix Plan';
  state.values.task = 'Add feature X';
  assert.equal(exportFilename(state), 'metrics-phoenix-plan-add-feature-x.tsv');

  state.values.plan = '  Ünïcode & Symbols!!  ';
  state.values.task = '';
  assert.equal(
    exportFilename(state),
    'metrics-unicode-symbols.tsv',
    'accents folded, punctuation collapsed, no stray dashes at either end'
  );
});

test('every column is unique, so no two questions share one', () => {
  const [header] = toTSV(emptyState()).split('\n');
  const columns = header.split('\t');
  assert.equal(new Set(columns).size, columns.length);
});
