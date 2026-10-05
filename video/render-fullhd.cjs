const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const outputDirectory = __dirname;
const browserPath = process.env.PRESENTATION_BROWSER;

if (!browserPath) {
  throw new Error('Set PRESENTATION_BROWSER to the Microsoft Edge executable.');
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function startServer() {
  const server = http.createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const candidate = path.resolve(root, `.${pathname}`);
    if (!candidate.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const info = await fsp.stat(candidate);
      if (!info.isFile()) throw new Error('Not a file');
      response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(candidate).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(candidate).pipe(response);
    } catch {
      response.writeHead(404).end();
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  const server = await startServer();
  const { port } = server.address();
  const browser = await chromium.launch({
    executablePath: browserPath,
    headless: true,
    args: [
      '--autoplay-policy=no-user-gesture-required',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: outputDirectory, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  let video;
  try {
    await page.goto(`http://127.0.0.1:${port}/proxmox-html-presentation/index.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.complete ? null : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      })));
    });
    const durationMs = await page.evaluate(() => [...document.querySelectorAll('.slide')]
      .reduce((total, slide) => total + Number(slide.dataset.duration || 7), 0) * 1000);
    await page.waitForTimeout(durationMs + 800);
    video = page.video();
  } finally {
    await page.close();
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  process.stdout.write(`${await video.path()}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
