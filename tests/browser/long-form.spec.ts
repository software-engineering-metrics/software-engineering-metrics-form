// The long form's logic is unit tested in tests/*.test.js, so these are about
// the wiring: that the page is hydrated at all, that a binding reaches the
// store, and that the buttons do what the modules behind them can already be
// shown to do. It runs the built site, prerendered and then hydrated, which
// is how it ships.
//
// Run with: pnpm test:browser

import { test, expect, type Page } from '@playwright/test';

const STORAGE_KEY = 'software-engineering-metrics-form';

function saved(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
}

async function read(page: Page, download: { createReadStream: () => Promise<NodeJS.ReadableStream> }) {
  const chunks: Buffer[] = [];
  for await (const chunk of await download.createReadStream()) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

// Every question binds to state and the saved copy is written by an effect,
// so a page that did not hydrate would show 240 controls that record nothing.
// This is the same rule the grep in scope-fields-match.test.js guards, checked
// by using it rather than by reading the source.
test('the page hydrates: typing reaches the store', async ({ page }) => {
  await page.goto('/');
  await page.fill('#plan', 'Phoenix Plan');

  await expect.poll(() => saved(page)).not.toBeNull();
  expect(JSON.parse((await saved(page)) as string).values.plan).toBe('Phoenix Plan');

  await page.reload();
  await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
});

test('the saved copy waits 400 ms', async ({ page }) => {
  await page.goto('/');
  await page.fill('#plan', 'Phoenix Plan');

  await page.waitForTimeout(200);
  expect(await saved(page), 'not written on the keystroke itself').toBeNull();
  await expect.poll(() => saved(page)).not.toBeNull();
});

test('a browser that refuses to store says so, and the form stays usable', async ({ page }) => {
  await page.addInitScript(() => {
    const refuse = () => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => ({
        getItem: refuse,
        setItem: refuse,
        removeItem: refuse,
        clear: refuse,
        key: refuse,
        length: 0
      })
    });
  });
  await page.goto('/');
  await page.fill('#plan', 'Phoenix Plan');

  await expect(page.getByText('This browser will not let the page save your answers.')).toBeVisible();
  await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
});

test.describe('Clear', () => {
  test('keeps everything when the confirm is dismissed', async ({ page }) => {
    await page.goto('/');
    await page.fill('#plan', 'Phoenix Plan');

    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
  });

  test('empties every kind of answer, and the store stays erased', async ({ page }) => {
    await page.goto('/');
    await page.fill('#plan', 'Phoenix Plan');
    await page.fill('#flow_velocity', '12');
    await page.check('input[name="ai_usage"][value="agentic"]');
    await expect.poll(() => saved(page)).not.toBeNull();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(page.locator('#plan')).toHaveValue('');
    await expect(page.locator('#flow_velocity')).toHaveValue('');
    expect(await page.locator('input[type=checkbox]:checked').count()).toBe(0);

    // Well past the save window: the blank form must not be written back.
    await page.waitForTimeout(700);
    expect(await saved(page)).toBeNull();
    await expect(page.locator('#date')).not.toHaveValue('');
  });
});

test.describe('a link fills the form in', () => {
  test('reaches questions of every kind, including past the opening section', async ({ page }) => {
    await page.goto(
      '/?plan=Phoenix+Plan&collection=automatic&charter_exists=in_progress' +
        '&flow_velocity=0&dist_features=62.5&mttr_median=42' +
        '&ai_usage=agentic&ai_usage=test_generation'
    );

    await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
    await expect(page.locator('#collection')).toHaveValue('automatic');
    await expect(page.locator('input[name="charter_exists"]:checked')).toHaveValue('in_progress');
    await expect(page.locator('#flow_velocity')).toHaveValue('0');
    await expect(page.locator('#dist_features')).toHaveValue('62.5');
    await expect(page.locator('#mttr_median')).toHaveValue('42');
    expect(await page.locator('input[name="ai_usage"]:checked').count()).toBe(2);
  });

  test('refuses a value a question does not offer', async ({ page }) => {
    await page.goto('/?collection=automated&confidence=HIGH&flow_velocity=lots');

    await expect(page.locator('#collection')).toHaveValue('');
    await expect(page.locator('#confidence')).toHaveValue('');
    await expect(page.locator('#flow_velocity')).toHaveValue('');
  });

  test('wins over the saved copy, for the questions it names only', async ({ page }) => {
    await page.goto('/?plan=Saved+Plan&task=Saved+Task');
    await expect.poll(() => saved(page)).not.toBeNull();

    await page.goto('/?plan=Newer+Plan');
    await expect(page.locator('#plan')).toHaveValue('Newer Plan');
    await expect(page.locator('#task')).toHaveValue('Saved Task');
  });
});

test('the date and time default to UTC, whatever the browser timezone', async ({ browser }) => {
  for (const timezoneId of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.locator('#date')).toHaveValue(new Date().toISOString().slice(0, 10));
    await expect(page.locator('#time')).toHaveValue(/^\d{2}:\d{2}$/);
    await context.close();
  }
});

test.describe('the exports', () => {
  test('TSV is one heading row and one data row, named for the submission', async ({ page }) => {
    await page.goto('/?plan=Phoenix+Plan&task=Add+feature+X');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export TSV' }).click()
    ]);
    expect(download.suggestedFilename()).toBe('metrics-phoenix-plan-add-feature-x.tsv');

    const lines = (await read(page, download)).split('\n');
    expect(lines[0].split('\t')).toHaveLength(240);
    expect(lines[1].split('\t')).toHaveLength(240);
    expect(new Set(lines[0].split('\t')).size).toBe(240);
  });

  test('JSON keeps each answer shaped as its question is', async ({ page }) => {
    await page.goto('/?plan=Phoenix+Plan&flow_velocity=0&ai_usage=agentic');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export JSON' }).click()
    ]);
    expect(download.suggestedFilename()).toBe('metrics-phoenix-plan.json');

    const parsed = JSON.parse(await read(page, download));
    expect(Object.keys(parsed)).toHaveLength(240);
    expect(parsed.plan).toBe('Phoenix Plan');
    expect(parsed.flow_velocity).toBe(0);
    expect(parsed.flow_load).toBeNull();
    expect(parsed.ai_usage).toEqual(['agentic']);
  });
});

test('there is no Submit button promising somewhere to send this', async ({ page }) => {
  await page.goto('/');
  const labels = await page.getByRole('button').allInnerTexts();
  expect(labels.map((label) => label.trim()).filter(Boolean)).toEqual([
    'Export TSV',
    'Export JSON',
    'Clear'
  ]);
});
