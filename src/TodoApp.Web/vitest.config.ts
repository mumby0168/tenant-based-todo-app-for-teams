import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    env: {
      VITE_ENABLE_MSW: 'true' // Enable MSW for integration tests
    },
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/*.e2e.*',
      '**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockServiceWorker.js',
        'src/main.tsx',
      ]
    },
  },
});