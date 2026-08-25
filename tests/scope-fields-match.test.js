// The twelve questions in index.html, the opening section of the SvelteKit
// schema, and the Excel form in index.bas are the same questions, and a column
// in one export means the same thing as that column in the others. Nothing
// enforced that agreement until this file: they were kept in step by eye, and
// drifted apart once already.
//
// Run with: pnpm test

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { sections, fields } from '../src/lib/fields.ts';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bas = readFileSync(new URL('../index.bas', import.meta.url), 'utf8');
const schemaSource = readFileSync(new URL('../src/lib/fields.ts', import.meta.url), 'utf8');
const routeSources = ['+page.svelte', '+layout.svelte', '+layout.ts']
  .map((name) => readFileSync(new URL(`../src/routes/${name}`, import.meta.url), 'utf8'))
  .join('\n');

/**
 * @typedef {object} ParsedField
 * @property {string} name
 * @property {string} label
 * @property {string} kind
 * @property {boolean} required
 * @property {string[]} [choices]
 */

/**
 * @param {string} attributes
 * @param {string} name
 * @returns {string | undefined}
 */
function attribute(attributes, name) {
  const found = attributes.match(new RegExp(`\\b${name}="([^"]*)"`));
  return found ? found[1] : undefined;
}

/**
 * @param {string} source
 * @param {string} id
 * @returns {string | undefined}
 */
function labelFor(source, id) {
  const found = source.match(new RegExp(`<label for="${id}">([^<]*)</label>`));
  return found ? found[1].trim() : undefined;
}

/**
 * @param {string} tag
 * @param {string | undefined} type
 * @returns {string}
 */
function kindOf(tag, type) {
  if (tag === 'select' || tag === 'textarea') return tag;
  // An input with no type attribute is a text input, per HTML.
  return type ?? 'text';
}

/**
 * Every named control in index.html, in document order.
 * @param {string} source
 * @returns {ParsedField[]}
 */
function parseFormFields(source) {
  /** @type {ParsedField[]} */
  const parsed = [];
  const tags = /<(input|select|textarea)\b([\s\S]*?)(\/>|>)/g;
  let match;
  while ((match = tags.exec(source)) !== null) {
    const [, tag, attributes] = match;
    const name = attribute(attributes, 'name');
    if (!name) continue;
    /** @type {ParsedField} */
    const field = {
      name,
      label: labelFor(source, attribute(attributes, 'id') ?? name) ?? '',
      kind: kindOf(tag, attribute(attributes, 'type')),
      required: /\brequired\b/.test(attributes)
    };
    if (tag === 'select') {
      const close = source.indexOf('</select>', tags.lastIndex);
      const options = source.slice(tags.lastIndex, close);
      field.choices = [...options.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);
    }
    parsed.push(field);
  }
  return parsed;
}

/**
 * Every question declared in the Excel form's Fields() function, in order.
 * VBA continues a long line with a trailing underscore, so join those first.
 * @param {string} source
 * @returns {ParsedField[]}
 */
function parseBasFields(source) {
  const joined = source.replace(/_\s*\n\s*/g, ' ');
  const calls = [...joined.matchAll(
    /MakeField\("([a-z]+)",\s*"([^"]*)",\s*"([a-z]+)",\s*(True|False),\s*"([^"]*)"/g
  )];
  return calls.map(([, name, label, kind, required, choices]) => ({
    name,
    label,
    kind,
    required: required === 'True',
    choices: choices ? choices.split(',') : []
  }));
}

// The Excel form names its controls for what they are, not for their HTML tag.
/** @type {Record<string, string>} */
const HTML_KIND_AS_BAS = {
  email: 'email',
  text: 'text',
  date: 'date',
  time: 'time',
  select: 'choice',
  textarea: 'notes'
};

const shortForm = parseFormFields(html);
const excelForm = parseBasFields(bas);
const scope = sections[0];
const scopeFields = scope.groups.flatMap((group) => group.fields);

test('the schema opens with the scope section', () => {
  assert.equal(scope.title, 'Scope');
});

test('both forms ask the same questions, in the same order', () => {
  assert.deepEqual(
    scopeFields.map((field) => field.name),
    shortForm.map((field) => field.name)
  );
});

test('a question is worded the same in both forms', () => {
  for (const [index, field] of scopeFields.entries()) {
    assert.equal(field.label, shortForm[index].label, `label for ${field.name}`);
  }
});

test('a question uses the same control in both forms', () => {
  for (const [index, field] of scopeFields.entries()) {
    assert.equal(field.kind, shortForm[index].kind, `control for ${field.name}`);
  }
});

test('a select offers the same values in both forms', () => {
  for (const [index, field] of scopeFields.entries()) {
    if (field.kind !== 'select') continue;
    assert.deepEqual(
      (field.choices ?? []).map((choice) => choice.value),
      shortForm[index].choices ?? [],
      `options for ${field.name}`
    );
  }
});

test('a question is required in both forms or neither', () => {
  for (const [index, field] of scopeFields.entries()) {
    assert.equal(
      Boolean(field.required),
      shortForm[index].required,
      `required for ${field.name}`
    );
  }
});

// Six inputs once shared three names between them, which silently collapsed
// distinct questions into single export columns.
test('no name is used by two questions', () => {
  const seen = new Set();
  const repeated = [];
  for (const field of fields) {
    if (seen.has(field.name)) repeated.push(field.name);
    seen.add(field.name);
  }
  assert.deepEqual(repeated, [], 'names used more than once');
  assert.deepEqual(
    shortForm.map((field) => field.name).filter((name, i, all) => all.indexOf(name) !== i),
    []
  );
});

// A datetime-local input holds local wall-clock time, so two offices filing
// the same instant record two different numbers.
test('neither form records a local wall-clock time', () => {
  assert.ok(!html.includes('datetime-local'), 'index.html uses no datetime-local input');
  assert.ok(!html.includes('getTimezoneOffset'), 'index.html converts no timezones');
  assert.ok(
    !schemaSource.includes('datetime-local'),
    'the schema declares no datetime-local question'
  );
});

test('the Excel form asks the same questions, in the same order', () => {
  assert.deepEqual(
    excelForm.map((field) => field.name),
    shortForm.map((field) => field.name)
  );
});

test('the Excel form words each question the same way', () => {
  for (const [index, field] of excelForm.entries()) {
    assert.equal(field.label, shortForm[index].label, `label for ${field.name}`);
  }
});

test('the Excel form uses a matching control for each question', () => {
  for (const [index, field] of excelForm.entries()) {
    assert.equal(
      field.kind,
      HTML_KIND_AS_BAS[shortForm[index].kind],
      `control for ${field.name}`
    );
  }
});

test('the Excel form offers the same values, and requires the same answers', () => {
  for (const [index, field] of excelForm.entries()) {
    const offered = shortForm[index].choices?.filter(Boolean) ?? [];
    assert.deepEqual(field.choices, offered, `options for ${field.name}`);
    assert.equal(field.required, shortForm[index].required, `required for ${field.name}`);
  }
});

// Pasting this line into the VBA code window is a syntax error; it belongs
// only in a file being imported.
test('the Excel form can be pasted without editing', () => {
  assert.ok(
    !/^Attribute VB_Name/m.test(bas),
    'index.bas carries no Attribute directive outside a comment'
  );
});

// Every question binds to state, the saved copy is written by an effect, and
// a link is read on mount. Turning hydration off would leave 240 controls
// that display but record nothing.
test('the application keeps the hydration its bindings depend on', () => {
  assert.ok(
    !/\bcsr\s*=\s*false/.test(routeSources),
    'no route disables client-side rendering'
  );
});

// index.html is the opposite case on purpose, and must stay framework-free.
test('the short form wires its buttons by id, with no framework', () => {
  for (const id of ['export-tsv', 'export-json', 'clear']) {
    assert.ok(
      html.includes(`getElementById("${id}").addEventListener`),
      `#${id} is wired by id`
    );
  }
  assert.ok(!/<script[^>]+\bsrc=/.test(html), 'no script is loaded from anywhere else');
});
