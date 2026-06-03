import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  entry: { index: 'src/accessibility.ts' },
  format: ['cjs', 'esm', 'iife'],
  globalName: 'Accessibility',
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2018',
  platform: 'browser',
  async onSuccess() {
    mkdirSync('dist', { recursive: true });
    copyFileSync('src/assets/logo-ufc.png', 'dist/logo-ufc.png');
  },
});
