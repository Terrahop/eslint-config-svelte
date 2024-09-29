import * as eslintrc from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import pluginStylistic from '@stylistic/eslint-plugin'
import pluginSecurity from 'eslint-plugin-security'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginSonar from 'eslint-plugin-sonarjs'
import pluginSvelte from 'eslint-plugin-svelte'
import pluginJsdoc from 'eslint-plugin-jsdoc'

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new eslintrc.FlatCompat({
  baseDirectory: __dirname
})

const ecmaVersion = 2021

export default [
  js.configs.recommended,

  pluginJsdoc.configs['flat/recommended-typescript'],
  pluginUnicorn.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  pluginSonar.configs.recommended,
  ...pluginSvelte.configs['flat/recommended'],

  pluginStylistic.configs.customize({
    braceStyle: '1tbs',
    commaDangle: 'never',
    arrowParens: true
  }),

  ...compat.config({
    extends: [
      'plugin:@typescript-eslint/strict-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
      'love'
    ],
    plugins: [
      '@typescript-eslint',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion,
      extraFileExtensions: ['.svelte']
    },
    env: {
      browser: true,
      es2021: true,
      es6: true,
    },
    rules: {
      // Core
      'no-void': 'off', // Conflicts with @typescript-eslint/no-floating-promises.
      'no-undef': 'off', // Doesn't work with typescript global types
      'prefer-arrow-callback': 'error',

      // Typescript plugin
      '@typescript-eslint/no-unused-vars': 'off', // tsserver already reports this
      '@typescript-eslint/strict-boolean-expressions': 'off', // A bit excessive.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/naming-convention': 'off',

      // JsDoc plugin
      'jsdoc/check-indentation': 'warn',
      'jsdoc/no-bad-blocks': 'warn',
      'jsdoc/no-blank-blocks': 'warn',
      'jsdoc/no-blank-block-descriptions': 'warn',
      'jsdoc/require-asterisk-prefix': 'warn',
      'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
      'jsdoc/require-description-complete-sentence': 'warn',
      'jsdoc/sort-tags': 'warn',
      'jsdoc/require-returns': 'off',

      // Unicorn plugin
      'unicorn/switch-case-braces': ['error', 'avoid'],
      'unicorn/filename-case': ['error', { case: 'kebabCase', ignore: ["\\.test\\.ts$"] }],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-useless-undefined': 'off',

      // Security plugin
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-regexp': 'off'
    },
    overrides: [{
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion,
        ecmaFeatures: {
          globalReturn: false,
        }
      },
      rules: {
        // Core

        // Unicorn plugin
        // Enforce pascal case for svelte files, ignore sveltekit's special files like +page.svelte
        'unicorn/filename-case': ['error', { case: 'pascalCase', ignore: [/^\+.*\.svelte$/] }],

        // Svelte plugin
        // Stricter and more opinionated svelte specific rules that are not enabled with 'plugin:svelte/recommended'.
        'svelte/infinite-reactive-loop': 'warn',
        'svelte/no-store-async': 'warn',
        'svelte/no-target-blank': 'warn',
        'svelte/no-immutable-reactive-statements': 'warn',
        'svelte/no-reactive-functions': 'warn',
        'svelte/no-reactive-literals': 'warn',
        'svelte/no-useless-mustaches': 'warn',
        'svelte/require-optimized-style-attribute': 'warn',
        'svelte/valid-each-key': 'warn',

        // Typescript plugin
        '@typescript-eslint/no-unsafe-assignment': 'off', // Svelte 5 props....

        // Sonarjs plugin
        'sonarjs/no-unused-collection': 'off', // Doesn't work with svelte processor at all.
      },
    }],
    settings: {
      jsdoc: { ignoreInternal: true },
      svelte: {
        ignoreWarnings: [
          "@typescript-eslint/no-unsafe-assignment",
          "@typescript-eslint/no-unsafe-return",
          "@typescript-eslint/no-unsafe-member-access",
          "@typescript-eslint/no-unsafe-argument",
          "@typescript-eslint/no-confusing-void-expression",
          "@typescript-eslint/promise-function-async",
          "sonarjs/no-extra-arguments", // Does not pickup svelte's snippet args
          "sonarjs/no-use-of-empty-return-value", // Does not work with svelte's snippets
          "sonarjs/no-unused-collection", // Does not work within svelte markup
        ]
      }
    },
  }),

  {
    files: ['**/*.ts', '**/*.svelte'],
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
  },

  pluginStylistic.configs['disable-legacy'],
]
