import { cpSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticRoot = resolve(__dirname, 'static');
const distRoot = resolve(__dirname, 'dist');

function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      for (const dir of ['img', 'favicons', 'fonts']) {
        const from = resolve(staticRoot, dir);
        if (!existsSync(from)) continue;
        cpSync(from, resolve(distRoot, dir), { recursive: true });
      }
    },
  };
}

export default defineConfig({
  root: 'static',
  base: './',
  publicDir: false,
  plugins: [copyStaticAssets()],
  server: {
    port: 4173,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    cssMinify: true,
    sourcemap: true,
  },
});
