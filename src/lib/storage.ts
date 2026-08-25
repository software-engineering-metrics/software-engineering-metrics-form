// Keeping answers in the browser, so a closed tab does not lose the work.
//
// Every call is guarded: Safari in private mode and browsers with storage
// disabled throw on access rather than degrading quietly.

import { emptyState, type FormState } from './fields.ts';

export const STORAGE_KEY = 'software-engineering-metrics-form';

export const STORAGE_REFUSED =
  'This browser will not let the page save your answers. Export before you leave.';

/** True when the answers were stored. False means the browser refused. */
export function save(state: FormState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn(STORAGE_REFUSED, error);
    return false;
  }
}

/** Saved answers merged over blanks, so a renamed field cannot leave a hole. */
export function load(): FormState {
  const state = emptyState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return state;
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return state;
    const { values, numbers, checked } = parsed as Partial<Record<keyof FormState, unknown>>;
    if (values && typeof values === 'object') {
      for (const [name, value] of Object.entries(values as Record<string, unknown>)) {
        if (name in state.values && typeof value === 'string') state.values[name] = value;
      }
    }
    if (numbers && typeof numbers === 'object') {
      for (const [name, value] of Object.entries(numbers as Record<string, unknown>)) {
        if (name in state.numbers && typeof value === 'number') state.numbers[name] = value;
      }
    }
    if (checked && typeof checked === 'object') {
      for (const [name, value] of Object.entries(checked as Record<string, unknown>)) {
        if (name in state.checked && Array.isArray(value)) {
          state.checked[name] = value.filter((item): item is string => typeof item === 'string');
        }
      }
    }
    return state;
  } catch (error) {
    console.warn(STORAGE_REFUSED, error);
    return emptyState();
  }
}

export function clear(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn(STORAGE_REFUSED, error);
    return false;
  }
}
