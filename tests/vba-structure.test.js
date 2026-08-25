// index.bas cannot be run here: there is no Excel, and no VBA interpreter to
// borrow. What can be checked is that the file is still structurally sound,
// which is what an unbalanced edit breaks first and what a reader notices
// last. The questions it asks are compared with the other two forms in
// scope-fields-match.test.js.
//
// Run with: pnpm test

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bas = readFileSync(new URL('../index.bas', import.meta.url), 'utf8');

/** Source lines with comments and string literals removed. */
const code = bas.split('\n').map((line) => {
  const withoutStrings = line.replace(/"(?:[^"]|"")*"/g, '""');
  const comment = withoutStrings.indexOf("'");
  return (comment === -1 ? withoutStrings : withoutStrings.slice(0, comment)).trim();
});

/** @type {[RegExp, string][]} */
const OPENERS = [
  [/^(?:Public |Private |Friend )?Sub\b/, 'Sub'],
  [/^(?:Public |Private |Friend )?Function\b/, 'Function'],
  [/^(?:Public |Private )?Type\b/, 'Type'],
  [/^With\b/, 'With'],
  [/^Select Case\b/, 'Select Case']
];

test('every block that opens is closed, by its own kind', () => {
  /** @type {{ kind: string, number: number }[]} */
  const stack = [];
  /** @type {string[]} */
  const problems = [];

  code.forEach((line, index) => {
    const number = index + 1;
    const closing = line.match(/^End (Sub|Function|With|Select|Type)\b/);
    if (closing) {
      const expected = closing[1] === 'Select' ? 'Select Case' : closing[1];
      const opened = stack.pop();
      if (!opened) {
        problems.push(`line ${number}: ${line} closes nothing`);
        return;
      }
      if (opened.kind !== expected) {
        problems.push(`line ${number}: ${line} closes a ${opened.kind} opened at line ${opened.number}`);
      }
      return;
    }
    for (const [pattern, kind] of OPENERS) {
      if (pattern.test(line)) {
        stack.push({ kind, number });
        return;
      }
    }
  });

  assert.deepEqual(problems, []);
  assert.deepEqual(stack.map((open) => `${open.kind} at line ${open.number}`), [], 'left open');
});

test('every multi-line If is closed', () => {
  let depth = 0;
  let deepest = 0;
  for (const line of code) {
    // A single-line "If x Then y" needs no End If; only a block If does.
    if (/^If\b/.test(line) && /\bThen$/.test(line)) depth += 1;
    else if (/^End If\b/.test(line)) depth -= 1;
    deepest = Math.max(deepest, depth);
    assert.ok(depth >= 0, 'an End If closes nothing');
  }
  assert.equal(depth, 0, 'an If was left open');
  assert.ok(deepest > 0, 'the check found block Ifs to count');
});

test('the macros an operator runs are all public', () => {
  for (const macro of ['ShowMetricsForm', 'SubmitMetricsForm', 'ClearMetricsForm']) {
    assert.ok(
      new RegExp(`^Public Sub ${macro}\\(\\)`, 'm').test(bas),
      `${macro} is public, so it appears in the macro list`
    );
  }
});

// VBA's Format uses "n" for minutes; "m" there means the month, so "hh:mm"
// would write the hour and the month and no one would notice for a while.
test('the time is formatted with minutes, not months', () => {
  assert.ok(bas.includes('"hh:nn"'), 'minutes are formatted with nn');
  assert.ok(!/Format\$?\([^)]*"hh:mm"/.test(bas), 'no hh:mm, which would give the month');
});

test('Option Explicit is on, so a typo is a compile error', () => {
  assert.ok(/^Option Explicit$/m.test(bas));
});
