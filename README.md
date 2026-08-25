# Software Engineering Metrics: capture form

Forms for recording software engineering metrics, one submission at a time.
The questions come from [Software Engineering
Metrics](https://github.com/software-engineering-metrics/software-engineering-metrics),
a book about measuring software engineering well.

A submission describes one plan or task at one moment: who is reporting, what
it is about, when it happened, and how good the numbers are. Filling one in
produces one row of data.

## Three forms, one row

| Form | What it is | Questions |
| --- | --- | --- |
| [`index.html`](index.html) | One self-contained HTML page. No build step, no dependencies, no server. Open the file and it works. | 12 |
| [`index.bas`](index.bas) | The same questions for Microsoft Excel. Paste it into a module and run `ShowMetricsForm`. | 12 |
| `src/` | The long form: a [SvelteKit](https://svelte.dev/docs/kit) application built on the [Lily Design System](https://lilydesignsystem.com/). | 240 |

All three write the same columns, in the same order, with the same names, so
their output can be combined. The web forms export
[tab-separated values](https://en.wikipedia.org/wiki/Tab-separated_values):
one heading row, then one row per submission. `index.html` also exports the
same answers as JSON, shaped by what each control is. The Excel form appends
its row to a worksheet with the same headings.

The long form opens with the same twelve questions as the short one, then asks
228 more, grouped into eleven further sections: governance, flow, code review,
DORA, developer experience, code quality, product and business, reliability and
security, AI-assisted development, maturity, and sign-off.

## A link can fill the form in

A dashboard, a script, or a runbook can hand someone a form that is already
filled in:

```
index.html?organization=ACME+Inc&plan=Phoenix+Plan&status=Start&date=2026-12-31&time=12:59
```

One rule, and no alias table: a parameter's name is the question's name, and a
select takes only a value it offers, exactly. Anything else is ignored with a
warning on the console rather than guessed at. The long form works the same
way for all 240 of its questions, and reads a checklist's several answers from
a repeated parameter, `?ai_usage=agentic&ai_usage=test_generation`.

## Time is always UTC

`date` and `time` are separate fields, and both record
[Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).

HTML has no UTC-anchored datetime control, and a `datetime-local` input holds
local wall-clock time, so two offices filing the same instant would record two
different numbers and no one could order the submissions afterwards. Separate
fields, labelled UTC, are the plainest way to get an answer that compares.

## Development

```sh
pnpm install
pnpm dev       # the long form, at http://localhost:5173
pnpm build     # prerenders it into build/
pnpm preview   # serve the production build
pnpm check     # svelte-check
pnpm test      # node --test
pnpm verify    # check, test, and build, in one command
pnpm test:browser  # runs index.html in a real browser
```

Node 24 or newer. The tests import `src/lib/*.ts` directly, which needs a Node
that strips types without a flag, and they import `node:fs` and `node:test`,
so `@types/node` is a declared dependency rather than something the machine
happens to have lying around.
[`.github/workflows/test.yml`](.github/workflows/test.yml) runs the check, the
tests, and the build on every push.

`index.html` needs none of this. Open it in a browser, or serve the directory
with any static file server.

The tests run on Node's own test runner and add no dependency. They compare
the three forms against each other and fail when they disagree on a question's
name, wording, control, offered values, or whether it is required. They also
cover both exports, pre-filling from a link, and the saved copy's handling of
a stored answer that is missing, renamed, or the wrong type.

`index.html` carries its whole implementation inline, so none of it can be
imported and unit tested. `pnpm test:browser` runs the real page in Chromium
instead, which is also the only honest way to check a download, a confirm
dialog, and a browser that refuses to store anything.

`index.bas` cannot be run here, since there is no Excel to run it in, so it is
checked structurally instead: that every block closes by its own kind, that
the macros an operator runs are public, and that the time is formatted with
minutes rather than months.

## Structure

- `index.html` : the short form, self-contained.
- `index.bas` : the same form for Excel, as pasteable VBA.
- `spec/index.md` : **the specification.** What the form is, the questions,
  and the rules that may not break. Read this before changing anything.
- `src/lib/fields.ts` : every question, as data. One list drives the rendered
  form and the export column order together, so the two cannot drift apart.
- `src/lib/tsv.ts` : the tab-separated export, and its escaping.
- `src/lib/json.ts` : the JSON export, which keeps each answer's shape.
- `src/lib/storage.ts` : keeping answers in the browser between visits.
- `src/lib/query.ts` : pre-filling from a link.
- `src/lib/components/` : Lily components, copied in. Lily is consumed by
  copying rather than from a registry.
- `src/routes/+page.svelte` : the long form.
- `tests/` : run with `pnpm test`.

## Contributing

The specification comes first. If a change touches the field list, the naming
rule, the query-string rule, the time rule, or the export format, edit
[`spec/index.md`](spec/index.md) in the same change, and make all three forms
agree. `pnpm test` will tell you when they do not.
