/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/coverage/**',
        'src/registerServiceWorker.js'
      ],
      include: ['src/**/*'],
      provider: 'istanbul',
      reportsDirectory: './coverage',
      reportOnFailure: true
    }
  }
}))