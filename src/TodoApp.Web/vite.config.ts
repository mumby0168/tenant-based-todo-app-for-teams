import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5180,  // Use 5180 to match Aspire configuration
    proxy: {
      '/api': {
        // Use Aspire service discovery environment variable, fallback to localhost for non-Aspire development
        target: process.env.services__api__https__0 || 
                process.env.services__api__http__0 || 
                'http://localhost:5050',
        changeOrigin: true,
        secure: false,  // Allow self-signed certificates in development
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'src/main.tsx',
      ],
    },
  },
})
