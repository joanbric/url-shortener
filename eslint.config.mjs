import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      // Basic rules
      'no-console': 'warn', // Warns about console.log statements
      'no-undef': 'error', // Prevents use of undefined variables
      semi: ['error', 'never'], // Disallows semicolons
      quotes: ['error', 'single'], // Enforces single quotes
      indent: ['error', 2, { SwitchCase: 1 }], // Enforces 2-space indentation
      'comma-dangle': ['error', 'never'], // Disallows trailing commas
      eqeqeq: 'error', // Enforces strict equality (===)

      // Best practices
      'no-eval': 'error', // Disallows eval()
      'no-implicit-globals': 'error', // Prevents implicit global variables

      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off'
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        jsxPragma: null // This tells ESLint that JSX doesn't need a pragma
      }
    }
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactJsxRuntime
]