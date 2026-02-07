import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  { files: ['src/**/*.ts', 'src/**/*.tsx'] },
  { ignores: ['./*.config.{js|ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs.flat.recommended['recommended-latest']
])
