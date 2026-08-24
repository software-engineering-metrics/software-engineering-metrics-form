// Converting the answers to tab-separated values.

import { fields, type FormState } from './fields.ts';

// A tab-separated field cannot hold a literal tab or newline, and the notes
// textareas can hold both, so escape them reversibly rather than lose text.
export function escapeCell(value: string): string {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\t/g, '\\t')
    .replace(/\r\n?|\n/g, '\\n');
}

/** A checklist answers with several values at once; keep them in one column. */
export const MULTI_VALUE_SEPARATOR = '|';

export function cellFor(state: FormState, name: string): string {
  const multi = state.checked[name];
  if (multi) return multi.join(MULTI_VALUE_SEPARATOR);
  // A number question that was answered zero is still an answer, so test for
  // the key rather than the value's truthiness.
  if (name in state.numbers) return state.numbers[name]?.toString() ?? '';
  return state.values[name] ?? '';
}

// One header row of field names, one row of values: the shape that appends
// cleanly into a spreadsheet as submissions accumulate over time.
export function toTSV(state: FormState): string {
  const header = fields.map((field) => escapeCell(field.name)).join('\t');
  const row = fields.map((field) => escapeCell(cellFor(state, field.name))).join('\t');
  return `${header}\n${row}\n`;
}

/** A filename that identifies the submission, falling back when unanswered. */
export function exportFilename(state: FormState): string {
  const slug = [state.values.plan, state.values.task]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug ? `metrics-${slug}.tsv` : 'metrics.tsv';
}
