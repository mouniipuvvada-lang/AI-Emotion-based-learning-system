#!/usr/bin/env bun
/**
 * Bundles the whole MindGrow app into ONE self-contained HTML file.
 *
 *   bun run build:single
 *
 * Output: public/standalone.html — served by the dev server at /standalone.html
 * and openable directly in any browser tab (double-click / file:// works too,
 * because every script and style is inlined).
 *
 * The source under src/ stays the single source of truth; re-run this script
 * after changing it (or run `bun run build:single` before sharing the file).
 */
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist-single');
const target = path.join(root, 'public', 'standalone.html');

// Same plugins/alias as vite.config.ts, but with a build that emits one chunk
// we can inline. Keep the two in sync if the dev config gains a plugin.
await build({
  root,
  configFile: false,
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': root } },
  build: {
    outDir,
    emptyOutDir: true,
    // One JS chunk + one CSS file, both small enough to inline.
    cssCodeSplit: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    modulePreload: false,
    minify: false,
    rollupOptions: { output: { codeSplitting: false } },
  },
  logLevel: 'warn',
});

const read = (file) => fs.readFile(path.join(outDir, file), 'utf8');
const replaceAsync = async (input, re, fn) => {
  const parts = [];
  let last = 0;
  for (const match of input.matchAll(re)) {
    parts.push(input.slice(last, match.index), await fn(match));
    last = match.index + match[0].length;
  }
  parts.push(input.slice(last));
  return parts.join('');
};

let html = await read('index.html');

// <link rel="stylesheet" href="./assets/index-xxx.css"> -> <style>…</style>
html = await replaceAsync(
  html,
  /<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g,
  async ([, href]) => `<style>\n${(await read(href)).replace(/<\/style/gi, '<\\/style')}\n</style>`,
);

// <script type="module" src="./assets/index-xxx.js"> -> <script type="module">…</script>
html = await replaceAsync(
  html,
  /<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g,
  async ([, src]) => `<script type="module">\n${(await read(src)).replace(/<\/script/gi, '<\\/script')}\n</script>`,
);

// Anything left pointing at ./assets/ would break the standalone file.
if (/\.\/assets\//.test(html)) {
  throw new Error('Bundle still references local asset files — nothing was written.');
}

await fs.writeFile(target, html);
await fs.writeFile(path.join(outDir, 'index.html'), html);
console.log(`single file: public/standalone.html (${(html.length / 1024).toFixed(0)} kB)`);
