
import { defineConfig } from 'eslint/config'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'
import globals from 'globals'

// import prettierConfig from 'eslint-config-prettier'
import antfu from '@antfu/eslint-config'

import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginCompat from "eslint-plugin-compat"
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginLove from 'eslint-config-love'
import pluginSecurity from 'eslint-plugin-security'
import pluginSonar from 'eslint-plugin-sonarjs'
import pluginStylistic from '@stylistic/eslint-plugin'
import pluginSvelte from 'eslint-plugin-svelte'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginTailwindcss from 'eslint-plugin-better-tailwindcss'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,

  pluginJsdoc.configs['flat/recommended-typescript'],
  pluginUnicorn.configs.recommended,
  pluginSecurity.configs.recommended,
  pluginSonar.configs.recommended,
  pluginCompat.configs['flat/recommended'],

  ...pluginSvelte.configs.recommended,
  ...pluginSvelte.configs.prettier,

  // prettierConfig, // Disables rules that conflict with prettier formatting

  pluginStylistic.configs.customize({
    braceStyle: '1tbs',
    arrowParens: true
  }),

  {
    ...pluginLove,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        parser: ts.parser,
        projectService: true,
        project: false,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.svelte'],
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      jsdoc: { ignoreInternal: true },
    },
    rules: {
      // Core
      'no-void': 'off', // conflicts with no-floating-promises
      'no-undef': 'off', // typescript-eslint recommend that you do not use this
      'complexity': 'off', // conflicts with sonarjs/cognitive-complexity
      // 'prefer-arrow-callback': 'error',
      // 'promise/avoid-new': 'off',

      // Typescript plugin
      '@typescript-eslint/no-unused-vars': 'off', // tsserver already reports this
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/init-declarations': 'off',

      // Unicorn plugin
      'unicorn/prevent-abbreviations': 'off', // Nah

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

      // Security plugin
      'security/detect-object-injection': 'off',
    }
  },

  {
    files: ['**/*.svelte'],
    plugins: {
      "better-tailwindcss": pluginTailwindcss,
    },
    settings: {
      svelte: {
        ignoreWarnings: [
          '@typescript-eslint/no-unsafe-assignment',
          '@typescript-eslint/no-unsafe-return',
          '@typescript-eslint/no-unsafe-member-access',
          '@typescript-eslint/no-unsafe-argument',
          '@typescript-eslint/no-confusing-void-expression',
          '@typescript-eslint/promise-function-async',
          '@typescript-eslint/no-base-to-string', // Breaks completely in svelte
          'sonarjs/no-extra-arguments', // Does not pickup svelte's snippet args
          'sonarjs/no-use-of-empty-return-value', // Does not work with svelte's snippets
          'sonarjs/no-unused-vars', // ^^
        ],
      },
      "better-tailwindcss": {
        // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
        "entryPoint": "src/routes/layout.css",
      }
    },
    rules: {
      // Unicorn plugin
      'unicorn/filename-case': ['error', { case: 'pascalCase', ignore: [/^\+.*\.svelte$/] }], // Enforce pascal case for svelte files, ignore sveltekit's special files like +page.svelte

      // Svelte plugin
      // Stricter
      'svelte/no-target-blank': 'error',
      'svelte/prefer-const': 'error',
      'prefer-const': 'off', // Conflicts svelte's prefer-const rules
      'svelte/prefer-destructured-store-props': 'error',
      'svelte/require-optimized-style-attribute': 'error',
      // More opinionated style
      'svelte/consistent-selector-style': 'error',
      'svelte/html-closing-bracket-spacing': 'error',
      'svelte/html-quotes': 'error',
      'svelte/html-self-closing': ['error', 'default'],
      'svelte/prefer-class-directive': 'error',
      'svelte/prefer-style-directive': 'error',
      'svelte/require-event-prefix': 'error',
      'svelte/shorthand-attribute': 'error',
      'svelte/shorthand-directive': 'error',

      // Sonarjs plugin
      'sonarjs/no-unused-collection': 'off', // Doesn't work with svelte processor at all.
      'sonarjs/deprecation': 'off', // ^^

      // Better Tailwindcss plugin
      ...pluginTailwindcss.configs["recommended-error"].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': ['error', {
        printWidth: 100,
        group: 'newLine',
        preferSingleLine: true
      }],
      'better-tailwindcss/no-unregistered-classes': 'off'
    }
  }
)
