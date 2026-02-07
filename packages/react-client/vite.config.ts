import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build'
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
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
      enabled: true,
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
      ],
      provider: 'v8',
      reportsDirectory: 'coverage'
    },
    globals: true,
    environment: 'jsdom',
    exclude: ['.next/**', '**/*d.ts', '**/*.mjs'],
    setupFiles: "src/vitest.setup.ts"
  }
})
