import globals from 'globals'

import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginStylistic from '@stylistic/eslint-plugin'
import pluginSecurity from 'eslint-plugin-security'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginSonar from 'eslint-plugin-sonarjs'
import pluginSvelte from 'eslint-plugin-svelte'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginLove from 'eslint-config-love'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,

  pluginJsdoc.configs['flat/recommended-typescript'],
  pluginUnicorn.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  pluginSonar.configs.recommended,

  ...pluginSvelte.configs['flat/recommended'],
  ...pluginSvelte.configs['flat/prettier'],

  pluginStylistic.configs.customize({
    braceStyle: '1tbs',
    commaDangle: 'never',
    arrowParens: true
  }),

  {
    ...pluginLove,
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        projectService: true,
        project: false,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.svelte'],
        svelteFeatures: {
          experimentalGenerics: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  {
    files: ['**/*.ts', '**/*.svelte'],

    linterOptions: {
      reportUnusedDisableDirectives: true
    },

    settings: {
      jsdoc: { ignoreInternal: true },
      svelte: {
        ignoreWarnings: [
          '@typescript-eslint/no-unsafe-assignment',
          '@typescript-eslint/no-unsafe-return',
          '@typescript-eslint/no-unsafe-member-access',
          '@typescript-eslint/no-unsafe-argument',
          '@typescript-eslint/no-confusing-void-expression',
          '@typescript-eslint/promise-function-async',
          'sonarjs/no-extra-arguments', // Does not pickup svelte's snippet args
          'sonarjs/no-use-of-empty-return-value', // Does not work with svelte's snippets
          'sonarjs/no-unused-vars' // ^^
        ]
      }
    },

    rules: {
      // Core
      'no-undef': 'off', // Doesn't work with typescript global types
      'prefer-arrow-callback': 'error',
      'complexity': ['warn', { variant: 'modified', max: 10 }],
      'eslint-comments/no-unlimited-disable': 'off',
      'arrow-body-style': 'off', // jesus christ eslint-config-love, I thought you were suppose to make code more verbose and clear....

      // Typescript plugin
      '@typescript-eslint/no-unused-vars': 'off', // tsserver already reports this
      '@typescript-eslint/strict-boolean-expressions': 'off', // A bit excessive.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-magic-numbers': 'off', // get the fuck outta here eslint-config-love.... wtf
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/prefer-destructuring': 'off', // lol no, why am even using you anymore eslint-config-love.... I think the love is gone... bring back eslint-config-standard-with-typescript
      '@typescript-eslint/init-declarations': 'off', // stop it

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

      // Security plugin
      'security/detect-object-injection': 'off',

      // SonarJs plugin
      'sonarjs/todo-tag': 'off',
      'sonarjs/void-use': 'off'
    }
  },

  {
    files: ['**/*.svelte'],
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

      // Sonarjs plugin
      'sonarjs/no-unused-collection': 'off', // Doesn't work with svelte processor at all.
      'sonarjs/deprecation': 'off' // ^^
    }
  }
)
