// index.html carries its whole implementation inline, so none of it can be
// imported and unit tested the way src/lib can. These run the real page in a
// real browser instead, which is also the only honest way to check a
// download, a confirm dialog, and a browser that refuses to store anything.
//
// Run with: pnpm test:browser

import { test, expect, type Page } from '@playwright/test';

const STORAGE_KEY = 'software-engineering-metrics-form';

const QUESTIONS = [
  'email',
  'organization',
  'division',
  'plan',
  'task',
  'step',
  'status',
  'date',
  'time',
  'collection',
  'confidence',
  'notes'
];

function saved(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
}

test.describe('the saved copy', () => {
  test('waits 400 ms, then restores on the next visit', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#plan', 'Phoenix Plan');

    await page.waitForTimeout(200);
    expect(await saved(page), 'not written on the keystroke itself').toBeNull();

    await expect.poll(() => saved(page)).not.toBeNull();
    expect(JSON.parse((await saved(page)) as string).plan).toBe('Phoenix Plan');

    await page.reload();
    await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
  });

  test('says so when the browser refuses to store, and stays usable', async ({ page }) => {
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
    await page.goto('/index.html');
    await page.fill('#plan', 'Phoenix Plan');

    await expect(page.locator('#storage-status')).toHaveText(
      'This browser will not let the page save your answers. Export before you leave.'
    );
    await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
  });
});

test.describe('Clear', () => {
  test('keeps everything when the confirm is dismissed', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#plan', 'Phoenix Plan');

    page.once('dialog', (dialog) => dialog.dismiss());
    await page.click('#clear');

    await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
  });

  test('empties the answers and erases the saved copy when accepted', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#plan', 'Phoenix Plan');
    await page.fill('#notes', 'something worth keeping');
    await expect.poll(() => saved(page)).not.toBeNull();

    page.once('dialog', (dialog) => dialog.accept());
    await page.click('#clear');

    await expect(page.locator('#plan')).toHaveValue('');
    await expect(page.locator('#notes')).toHaveValue('');
    // Well past the save window: nothing may write the blank form back.
    await page.waitForTimeout(600);
    expect(await saved(page)).toBeNull();
    // The date and time go back to now rather than being left empty.
    await expect(page.locator('#date')).not.toHaveValue('');
    await expect(page.locator('#time')).not.toHaveValue('');
  });
});

test.describe('a link fills the form in', () => {
  test('fills the questions it names, and only those', async ({ page }) => {
    await page.goto('/index.html?organization=ACME+Inc&plan=Phoenix+Plan&date=2026-12-31&time=12:59');

    await expect(page.locator('#organization')).toHaveValue('ACME Inc');
    await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
    await expect(page.locator('#date')).toHaveValue('2026-12-31');
    await expect(page.locator('#time')).toHaveValue('12:59');
    await expect(page.locator('#task')).toHaveValue('');
  });

  test('takes a value a select offers', async ({ page }) => {
    await page.goto('/index.html?collection=automatic&confidence=high');
    await expect(page.locator('#collection')).toHaveValue('automatic');
    await expect(page.locator('#confidence')).toHaveValue('high');
  });

  test('refuses one it does not, with no near-enough matching', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'warning') warnings.push(message.text());
    });
    await page.goto('/index.html?collection=automated&confidence=HIGH');

    await expect(page.locator('#collection')).toHaveValue('');
    await expect(page.locator('#confidence')).toHaveValue('');
    expect(warnings.join('\n')).toContain('collection=automated');
    expect(warnings.join('\n')).toContain('confidence=HIGH');
  });

  test('refuses a date the field cannot read, rather than blanking it', async ({ page }) => {
    await page.goto('/index.html?date=31-12-2026');
    // Left alone, so the default is still there.
    await expect(page.locator('#date')).not.toHaveValue('');
  });
});

test.describe('the date and time are UTC', () => {
  for (const timezoneId of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
    test(`default to the same instant in ${timezoneId}`, async ({ browser }) => {
      const context = await browser.newContext({ timezoneId });
      const page = await context.newPage();
      await page.goto('/index.html');

      const stamp = new Date();
      await expect(page.locator('#date')).toHaveValue(stamp.toISOString().slice(0, 10));
      // Minutes can tick over between the page loading and this assertion.
      await expect(page.locator('#time')).toHaveValue(/^\d{2}:\d{2}$/);
      await context.close();
    });
  }

  test('a supplied time is stored as given, with no shift', async ({ browser }) => {
    const context = await browser.newContext({ timezoneId: 'Asia/Tokyo' });
    const page = await context.newPage();
    await page.goto('/index.html?date=2026-12-31&time=12:59');

    await expect(page.locator('#date')).toHaveValue('2026-12-31');
    await expect(page.locator('#time')).toHaveValue('12:59');
    await context.close();
  });
});

test.describe('Export TSV', () => {
  test('downloads two rows, one column per question', async ({ page }) => {
    await page.goto('/index.html?plan=Phoenix+Plan');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export-tsv')
    ]);
    expect(download.suggestedFilename()).toBe('export.tsv');

    const text = await download.createReadStream().then(streamToString);
    const lines = text.split('\n');
    expect(lines[0].split('\t')).toEqual(QUESTIONS);
    expect(lines[1].split('\t')).toHaveLength(QUESTIONS.length);
    expect(text.trimEnd().split('\n')).toHaveLength(2);
  });

  test('escapes a tab and a newline, so one answer cannot become two rows', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#notes', 'one\ttwo\nthree\\four');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export-tsv')
    ]);
    const text = await download.createReadStream().then(streamToString);
    const lines = text.split('\n');
    const cell = lines[1].split('\t')[QUESTIONS.indexOf('notes')];

    expect(text.trimEnd().split('\n')).toHaveLength(2);
    expect(lines[1].split('\t')).toHaveLength(QUESTIONS.length);
    expect(cell).toBe('one\\ttwo\\nthree\\\\four');
  });

  test('escapes a carriage return separately from a newline', async ({ page }) => {
    await page.goto('/index.html');
    // A textarea normalises a carriage return away, so ask the page directly.
    // escapeCell is a global of the page's own inline script.
    const escaped = await page.evaluate(() =>
      (window as unknown as { escapeCell: (value: string) => string }).escapeCell(
        'a\rb\nc\td\\e'
      )
    );
    expect(escaped).toBe('a\\rb\\nc\\td\\\\e');
  });
});

test.describe('Export JSON', () => {
  test('downloads the same answers, unescaped and typed', async ({ page }) => {
    await page.goto('/index.html?plan=Phoenix+Plan&collection=automatic');
    await page.fill('#notes', 'one\ttwo\nthree');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export-json')
    ]);
    expect(download.suggestedFilename()).toBe('export.json');

    const parsed = JSON.parse(await download.createReadStream().then(streamToString));
    expect(Object.keys(parsed)).toEqual(QUESTIONS);
    expect(parsed.plan).toBe('Phoenix Plan');
    expect(parsed.collection).toBe('automatic');
    // Raw, because JSON brings its own escaping and doubling it would corrupt.
    expect(parsed.notes).toBe('one\ttwo\nthree');
  });
});

test('pressing Enter cannot navigate away and lose the answers', async ({ page }) => {
  await page.goto('/index.html');
  await page.fill('#plan', 'Phoenix Plan');

  await page.focus('#plan');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);

  expect(new URL(page.url()).pathname).toBe('/index.html');
  await expect(page.locator('#plan')).toHaveValue('Phoenix Plan');
});

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}
