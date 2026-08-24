// Pre-filling the form from a link, so a dashboard or a script can hand
// someone a form that is already filled in.
//
// One rule, and no alias table: a parameter's name is the question's name, and
// a value a question does not offer is ignored rather than guessed at. This
// matches index.html, deliberately, so the same link works against either
// form for the questions they share.

import { fields, type FieldSpec, type FormState } from './fields.ts';

export interface QueryResult {
  /** Questions a parameter answered. */
  applied: string[];
  /** Parameters that named a question but carried a value it refuses. */
  ignored: string[];
}

function offers(field: FieldSpec, value: string): boolean {
  return (field.choices ?? []).some((choice) => choice.value !== '' && choice.value === value);
}

/**
 * Read `params` into `state`, in place. Only questions the link actually names
 * are touched, so a link that sets one answer leaves every other one alone.
 */
export function applyQuery(state: FormState, params: URLSearchParams): QueryResult {
  const applied: string[] = [];
  const ignored: string[] = [];

  for (const field of fields) {
    if (!params.has(field.name)) continue;

    // A checklist answers with several values, which a URL says by repeating
    // the parameter: ?ai_usage=agentic&ai_usage=test_generation
    if (field.kind === 'checkbox') {
      const wanted = params.getAll(field.name).filter((value) => value !== '');
      const offered = wanted.filter((value) => offers(field, value));
      for (const value of wanted) {
        if (!offered.includes(value)) ignored.push(`${field.name}=${value}`);
      }
      if (offered.length > 0) {
        state.checked[field.name] = offered;
        applied.push(field.name);
      }
      continue;
    }

    const raw = (params.get(field.name) ?? '').trim();
    if (raw === '') continue;

    if (field.kind === 'number') {
      const value = Number(raw);
      if (raw === '' || Number.isNaN(value)) {
        ignored.push(`${field.name}=${raw}`);
        continue;
      }
      state.numbers[field.name] = value;
      applied.push(field.name);
      continue;
    }

    if ((field.kind === 'select' || field.kind === 'radio') && !offers(field, raw)) {
      ignored.push(`${field.name}=${raw}`);
      continue;
    }

    state.values[field.name] = raw;
    applied.push(field.name);
  }

  return { applied, ignored };
}
