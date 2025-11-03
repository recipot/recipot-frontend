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
      '@recipot/contexts': path.resolve(__dirname, '../../packages/contexts/src'),
      '@recipot/types': path.resolve(__dirname, '../../packages/types/src'),
      '@recipot/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
  esbuild: {
    target: 'node14',
  },
  define: {
    global: 'globalThis',
  },
});
