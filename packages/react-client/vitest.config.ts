/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    coverage: {
      include: './src/**/*',
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['html', 'json', 'text'],
      testNamePattern: '*.test.[js|jsx|ts|tsx]'
    }
  }
}))