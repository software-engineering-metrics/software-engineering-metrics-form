# Software Engineering Metrics Form: Specification

This is the source of truth for the capture form. The form is a **form**. It
collects one submission, about one plan or task, at one moment in time, and
hands it back as data the submitter can keep.

If you are a contributor or an agent about to change anything, read this file
first. It tells you what the form is, which rules hold it together, and which
ones you may not break.

## What the form is

[`index.html`](../index.html) is the capture form: a single, self-contained
HTML page with a small amount of vanilla JavaScript and no build step, no
dependencies, and no server behind it. Open the file and it works.

That self-containment is the point, not an accident of how it started. A
metrics form is only useful if it is easy to hand to someone, and a page that
runs from a file share, a static host, or a local disk is easier to hand over
than one that needs a toolchain. Keep it that way: no framework, no bundler,
no package for this file.

The form has no back end. `submit` and the export button both produce a file
the submitter downloads. Nothing leaves the browser on its own.

## The fields

Twelve questions, in this order. This table is the canonical list.

| Field | Control | Required |
| --- | --- | --- |
| `email` | email | yes |
| `organization` | text | yes |
| `division` | text | yes |
| `plan` | text | yes |
| `task` | text | yes |
| `step` | text | yes |
| `status` | text | yes |
| `date` | date, UTC | yes |
| `time` | time, UTC | yes |
| `collection` | select | no |
| `confidence` | select | no |
| `notes` | textarea | no |

The `collection` select offers `estimate`, `manual`, `assisted`, and
`automatic`. The `confidence` select offers `low`, `medium`, and `high`. Both
also offer an empty value, meaning unanswered.

Each label names the question as a list of synonyms, for example "Which plan /
project / product / practice / etc.?", because organizations disagree about
vocabulary and the form should not force a house dialect on a submitter.

## One name per question

A field's `id`, its `name`, its query parameter, and its column in the export
are **the same string**. There is no mapping layer anywhere, and there must
never be one.

This rule is not cosmetic. An earlier version of this form had six text inputs
sharing three `name` attributes between them, which silently collapsed distinct
questions into single columns and lost answers on export. A single name per
question makes that class of defect impossible to write.

The consequences worth knowing:

- Renaming a field renames its query parameter and its export column too.
  That is intended. Callers of an old parameter name stop being served, which
  is visible, rather than being quietly redirected, which is not.
- Adding a field to the HTML makes it addressable by URL and present in the
  export with no second edit. The code iterates the form's own controls.

## Pre-filling from a query string

A link can carry a submission's context, so a dashboard, a script, or a
runbook can hand someone a form that is already filled in:

```
/?organization=ACME+Inc&plan=Phoenix+Plan&status=Start&date=2026-12-31&time=12:59
```

There is one rule and no alias table:

1. A parameter's name is the field's `id`.
2. A select's value is one of the values that select offers, exactly.
3. Anything else is ignored, with a warning on the console.

**No aliases, no fuzzy matching, no case folding.** `?collection=automatic`
works. `?collection=automated` and `?collection=AUTOMATIC` do not, and are
ignored rather than guessed at. An alias table looks helpful, then quietly
rewrites a valid value into a stale one the first time an option is
renamed, which is what happened when this form briefly had one.

A link is a deliberate instruction, so its parameters win over whatever the
browser had saved from a previous visit, but only for the fields the link
actually names. Everything else is restored as usual.

A `date` or `time` input silently blanks a value it cannot parse, so the value
is checked after it is assigned. `?date=31-12-2026` leaves the field alone
rather than wiping it.

## Time is always UTC

`date` and `time` are separate inputs, and both record
[Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).
Each is labelled with `(UTC)` so a submitter is never guessing.

HTML has no UTC-anchored datetime control. A `datetime-local` input holds local
wall-clock time, which means two offices filing the same instant record two
different numbers, and a metrics programme that cannot order its own
submissions in time. Separate `date` and `time` inputs, documented as UTC, are
the plainest way to get a comparable answer.

So:

- The form defaults to the current UTC date and time, whatever the browser's
  timezone is.
- A value supplied by query string is stored exactly as given. There is no
  conversion, in either direction, anywhere in the page.
- Precision is minutes. Seconds are not collected.

## The export

The export button and `submit` both produce
[tab-separated values](https://en.wikipedia.org/wiki/Tab-separated_values):
one header row of field names, then one row of values, in the order the fields
appear above. That shape appends cleanly into a spreadsheet as submissions
accumulate over time, which a key-and-value shape does not.

The button is labelled "Export TSV" and the file is named for the plan and the
task, for example `metrics-phoenix-plan-add-feature-x.tsv`, falling back to
`metrics.tsv` when neither is answered.

A tab-separated field cannot hold a literal tab or newline, and `notes` can
hold both. They are escaped reversibly, as `\t` and `\n`, with a literal
backslash escaped as `\\`. Text is never dropped to make it fit.

## Browser storage

Answers are kept in
[Web Storage](https://en.wikipedia.org/wiki/Web_storage) under the key
`software-engineering-metrics-form`, saved as they are typed and restored on
the next visit. Clearing the form also clears the saved copy.

Every call is guarded. A browser with storage disabled, or Safari in private
mode, throws on access rather than degrading quietly, and the form must stay
usable when that happens.

## Rules that may not break

1. **`index.html` is self-contained.** No framework, no bundler, no
   dependency, no build step, no back end.
2. **One name per question**, shared by the `id`, the `name`, the query
   parameter, and the export column.
3. **No aliases.** Not for parameter names, not for select values. This holds
   in `index.html`, in `index.bas`, and in `src/lib/query.ts`.
4. **Time is UTC**, and is never converted to or from local time.
5. **Never lose a submitter's text.** Escape it, do not truncate it.
6. **A value the form cannot accept is ignored and reported**, never guessed
   at and never allowed to blank a field.
7. **`pnpm test` passes** before a change is considered done.

## The Excel form

[`index.bas`](../index.bas) is the same twelve questions for a spreadsheet
user. The text is pasted into a module in the Visual Basic editor, and the
macro it provides builds the form on a worksheet, checks the answers, and
appends one row to a second sheet whose header is the column list above.

It is a worksheet and not a UserForm on purpose. A UserForm lives in a `.frm`
file that has to be imported, or has to be built at run time through the VBA
project object model, which is turned off by default and which many people
cannot turn on. A worksheet form pastes and runs anywhere.

Two rules carry across from the web form, for the same reasons:

- A select refuses a value it does not offer, exactly, with no near-enough
  matching.
- The date and time are UTC. Excel has no UTC clock, so the macro asks Windows
  to convert. Where that is unavailable, such as Excel for Mac, it says so in
  the form and asks the operator for the UTC values rather than recording a
  local time under a heading that says UTC.

The row is written as text, not as Excel dates and numbers, so `2026-12-31`
and `12:59` reach the sheet exactly as the TSV would carry them.

`pnpm test` checks this file against `index.html` too.

## The SvelteKit application

The repository also holds a [SvelteKit](https://svelte.dev/docs/kit) application
in `src/`, built on the Lily Design System, which asks the full set of 240
questions drawn from the book. `index.html` is the short form; the application
is the long one.

The application's opening section **is** the short form. Its twelve questions
carry the same names, the same labels, and the same select values as the table
above, and it records UTC the same way, in the same separate `date` and `time`
fields. A `date` column from one export means the same thing as a `date` column
from the other, so the two can be read together.

Keep it that way. If a question in the table above changes its name, its label,
or its offered values, change it in `src/lib/fields.ts` in the same commit.
`pnpm test` compares the field lists of all three forms and fails if they
disagree on a name, a label, a control, a select's values, or whether an
answer is required, so the drift is caught rather than discovered later in a
spreadsheet.

Pre-filling works the same way in both, by the same rule, so a link that names
a question either form asks fills it in either form. The application extends it
to all 240 questions, and says a checklist's several answers by repeating the
parameter: `?ai_usage=agentic&ai_usage=test_generation`.

Where the two still differ, on purpose:

- The application asks a further 228 questions, which `index.html` does not.

## The usual workflow

1. Decide the change as a change to the form: which question, which control,
   which name.
2. Edit this specification first if the change touches the field list, the
   naming rule, the query-string rule, the time rule, or the export format.
3. Edit `index.html` to match.
4. Run `pnpm test`. It checks `index.html`, `index.bas`, and the schema
   against each other, and fails on any disagreement between them.
5. Check it in a browser: fill the form, reload to confirm the answers come
   back, export, and open the file.
6. If the change touches pre-filling, check a link that exercises it, and
   check a link with a value the form should reject.
