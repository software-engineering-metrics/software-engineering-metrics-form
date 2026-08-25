// The same answers as the TSV, shaped by what each question is rather than
// flattened to text: a tick list is an array, a number is a number, and an
// unanswered number is null rather than an empty string.
//
// Nothing is escaped here. JSON brings its own escaping, and applying the
// TSV's on top of it would double every backslash.

import { fields, type FormState } from './fields.ts';

export type Answer = string | string[] | number | null;

export function toJson(state: FormState): Record<string, Answer> {
  const shaped: Record<string, Answer> = {};
  for (const field of fields) {
    if (field.kind === 'checkbox') {
      shaped[field.name] = state.checked[field.name] ?? [];
    } else if (field.kind === 'number') {
      shaped[field.name] = state.numbers[field.name] ?? null;
    } else {
      shaped[field.name] = state.values[field.name] ?? '';
    }
  }
  return shaped;
}

export function toJsonText(state: FormState): string {
  return `${JSON.stringify(toJson(state), null, 2)}\n`;
}
