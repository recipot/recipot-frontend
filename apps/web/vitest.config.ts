/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@recipot/api': path.resolve(__dirname, '../../packages/api/src'),
    },
  },
  esbuild: {
    target: 'node14',
  },
});
