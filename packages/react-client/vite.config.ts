import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build'
  },
  define: {
    'process': null
  },
  plugins: [react()],
  resolve: {
    "alias": {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3333,
    proxy: {
      "/sqwerl/": {
        secure: false,
        target: 'http://localhost:6719'
      },
      "/app/:id": {
        target: 'http://localhost:4444'
      }
    }
  },
  test: {
    coverage: {
      exclude: [
        './.next/**',
        './*.js',
        './*.ts',
        './build/**',
        './dist/**',
        './scripts/**',
        '**/*.d.ts',
        '**/*.mjs',
        '**/*.test.*'
      ]
    },
    globals: true,
    environment: 'jsdom',
    exclude: ['.next/**', '**/*d.ts', '**/*.mjs'],
    setupFiles: "src/vitest.setup.ts"
  }
})
