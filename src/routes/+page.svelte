<script lang="ts">
  import { onMount } from 'svelte';

  import Form from '$lib/components/Form/Form.svelte';
  import Field from '$lib/components/Field/Field.svelte';
  import Fieldset from '$lib/components/Fieldset/Fieldset.svelte';
  import TextInput from '$lib/components/TextInput/TextInput.svelte';
  import EmailInput from '$lib/components/EmailInput/EmailInput.svelte';
  import UrlInput from '$lib/components/UrlInput/UrlInput.svelte';
  import DateInput from '$lib/components/DateInput/DateInput.svelte';
  import DateTimeLocalInput from '$lib/components/DateTimeLocalInput/DateTimeLocalInput.svelte';
  import NumberInput from '$lib/components/NumberInput/NumberInput.svelte';
  import TextAreaInput from '$lib/components/TextAreaInput/TextAreaInput.svelte';
  import Select from '$lib/components/Select/Select.svelte';
  import Option from '$lib/components/Option/Option.svelte';
  import RadioGroup from '$lib/components/RadioGroup/RadioGroup.svelte';
  import RadioInput from '$lib/components/RadioInput/RadioInput.svelte';
  import CheckboxGroup from '$lib/components/CheckboxGroup/CheckboxGroup.svelte';
  import CheckboxInput from '$lib/components/CheckboxInput/CheckboxInput.svelte';
  import Button from '$lib/components/Button/Button.svelte';
  import SubmitInput from '$lib/components/SubmitInput/SubmitInput.svelte';
  import ResetInput from '$lib/components/ResetInput/ResetInput.svelte';
  import Header from '$lib/components/Header/Header.svelte';
  import Footer from '$lib/components/Footer/Footer.svelte';

  import { sections, emptyState, type FieldSpec } from '$lib/fields';
  import { toTSV, exportFilename } from '$lib/tsv';
  import * as storage from '$lib/storage';

  let answers = $state(emptyState());
  let restored = $state(false);

  function toDatetimeLocalString(date: Date): string {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);
    return localDate.toISOString().slice(0, -1);
  }

  // Storage is a browser API, so read it after mount rather than during SSR.
  // This runs once: an $effect here would re-trigger itself, because it both
  // reads and writes the same state.
  onMount(() => {
    const loaded = storage.load();
    // Default to now, but never overwrite a restored answer.
    if (!loaded.values.when) loaded.values.when = toDatetimeLocalString(new Date());
    answers = loaded;
    restored = true;
  });

  // Save on every keystroke, but only once the saved copy has been read in:
  // writing before then would persist the blank form over real answers.
  $effect(() => {
    const snapshot = $state.snapshot(answers);
    if (restored) storage.save(snapshot);
  });

  function toggle(name: string, value: string, on: boolean) {
    const current = answers.checked[name] ?? [];
    answers.checked[name] = on ? [...current, value] : current.filter((item) => item !== value);
  }

  function handleExport() {
    const snapshot = $state.snapshot(answers);
    const blob = new Blob([toTSV(snapshot)], {
      type: 'text/tab-separated-values;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFilename(snapshot);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function handleReset(event: Event) {
    // Bound inputs are driven by state, so let the state be the only thing
    // that clears them: a native reset would restore stale DOM values behind
    // Svelte's back.
    event.preventDefault();
    answers = emptyState();
    answers.values.when = toDatetimeLocalString(new Date());
    storage.clear();
  }

  function handleSubmit() {
    // No server yet: the export is how a submission leaves the browser.
    handleExport();
  }
</script>

<svelte:head>
  <title>Software engineering metrics form</title>
</svelte:head>

{#snippet questions(groupFields: FieldSpec[])}
  {#each groupFields as field (field.name)}
    {#if field.kind === 'radio'}
      <Fieldset legend={field.label}>
        <RadioGroup label={field.label}>
          <div class="choices">
            {#each field.choices ?? [] as choice (choice.value)}
              <label>
                <RadioInput
                  label={choice.label}
                  name={field.name}
                  value={choice.value}
                  checked={answers.values[field.name] === choice.value}
                  onchange={() => (answers.values[field.name] = choice.value)}
                />
                {choice.label}
              </label>
            {/each}
          </div>
        </RadioGroup>
      </Fieldset>
    {:else if field.kind === 'checkbox'}
      <Fieldset legend={field.label}>
        <CheckboxGroup label={field.label}>
          <div class="choices">
            {#each field.choices ?? [] as choice (choice.value)}
              <label>
                <CheckboxInput
                  label={choice.label}
                  name={field.name}
                  value={choice.value}
                  checked={answers.checked[field.name]?.includes(choice.value) ?? false}
                  onchange={(event: Event) =>
                    toggle(field.name, choice.value, (event.currentTarget as HTMLInputElement).checked)}
                />
                {choice.label}
              </label>
            {/each}
          </div>
        </CheckboxGroup>
      </Fieldset>
    {:else}
      <Field
        label={field.label}
        required={field.required}
        description={field.hint}
        inputId={field.name}
      >
        {#if field.kind === 'email'}
          <EmailInput
            label={field.label}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            bind:value={answers.values[field.name]}
          />
        {:else if field.kind === 'url'}
          <UrlInput
            label={field.label}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            bind:value={answers.values[field.name]}
          />
        {:else if field.kind === 'date'}
          <DateInput
            label={field.label}
            id={field.name}
            name={field.name}
            required={field.required}
            bind:value={answers.values[field.name]}
          />
        {:else if field.kind === 'datetime-local'}
          <DateTimeLocalInput
            label={field.label}
            id={field.name}
            name={field.name}
            required={field.required}
            bind:value={answers.values[field.name]}
          />
        {:else if field.kind === 'number'}
          <NumberInput
            label={field.label}
            id={field.name}
            name={field.name}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            bind:value={answers.numbers[field.name]}
          />
        {:else if field.kind === 'select'}
          <Select
            label={field.label}
            id={field.name}
            name={field.name}
            required={field.required}
            bind:value={answers.values[field.name]}
          >
            {#each field.choices ?? [] as choice (choice.value)}
              <Option value={choice.value}>{choice.label}</Option>
            {/each}
          </Select>
        {:else if field.kind === 'textarea'}
          <TextAreaInput
            label={field.label}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            bind:value={answers.values[field.name]}
          />
        {:else}
          <TextInput
            label={field.label}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            bind:value={answers.values[field.name]}
          />
        {/if}
      </Field>
    {/if}
  {/each}
{/snippet}

<Header label="Site header">
  <div class="page-wrapper">
    <h1>Software engineering metrics form</h1>
  </div>
</Header>

<main class="page-wrapper">
  <p>
    Complete as much as you reasonably can, using whatever reasonable estimates
    or metrics you have.
  </p>

  <Form label="Software engineering metrics" onsubmit={handleSubmit} onreset={handleReset}>
    {#each sections as section (section.title)}
      <section>
        <h2>{section.title}</h2>
        {#if section.note}
          <p class="section-note">{section.note}</p>
        {/if}

        {#each section.groups as group, groupIndex (group.legend ?? groupIndex)}
          {#if group.legend}
            <Fieldset legend={group.legend}>
              {#if group.note}
                <p class="section-note">{group.note}</p>
              {/if}
              {@render questions(group.fields)}
            </Fieldset>
          {:else}
            {@render questions(group.fields)}
          {/if}
        {/each}
      </section>
    {/each}

    <div class="form-actions">
      <SubmitInput value="Submit metrics" />
      <Button type="button" onclick={handleExport}>Export TSV</Button>
      <ResetInput value="Clear the form" />
    </div>
  </Form>

  <p class="hint">
    Answers are kept in this browser only, and restored if you close the page
    and come back. Clearing the form also clears the saved answers.
  </p>
</main>

<Footer label="Site footer">
  <div class="page-wrapper">
    <p>Lily™ and Lily Design System™ are trademarks.</p>
  </div>
</Footer>

<style>
  .page-wrapper {
    max-width: 46rem;
    margin: 0 auto;
    padding: 0 1rem;
  }

  section {
    margin-top: var(--nhs-space-6, 2.5rem);
  }

  .section-note {
    border-left: 4px solid var(--nhs-color-blue, #005eb8);
    padding-left: var(--nhs-space-3, 1rem);
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: var(--nhs-space-2, 0.5rem);
  }

  .choices label {
    display: flex;
    align-items: center;
    gap: var(--nhs-space-2, 0.5rem);
  }

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--nhs-space-3, 1rem);
    margin-top: var(--nhs-space-5, 2rem);
  }
</style>
