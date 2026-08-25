// A static file server, just enough to open index.html in a browser test.
// Kept dependency-free on purpose: the short form has no build step, and its
// tests should not need one either.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const port = Number(process.env.PORT ?? 8123);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  // Never serve above the directory being served.
  const relative = normalize(path).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, relative === '/' ? 'index.html' : relative);
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end('not found');
  }
}).listen(port, () => console.log(`serving on http://localhost:${port}`));
