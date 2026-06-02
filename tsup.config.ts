import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/accessibility.ts' },
  format: ['cjs', 'esm', 'iife'],
  globalName: 'Accessibility',
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2018',
  platform: 'browser',
});
