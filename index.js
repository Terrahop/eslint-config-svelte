import antfu from '@antfu/eslint-config'
import pluginLove from 'eslint-config-love'
import pluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import pluginCompat from 'eslint-plugin-compat'
import pluginSecurity from 'eslint-plugin-security'
import pluginSonarJs from 'eslint-plugin-sonarjs'
import ts from 'typescript-eslint'

const tsStrictTypeAwareRules = Object.assign(
  {},
  ...ts.configs.strictTypeChecked.map((v) => v.rules).filter(Boolean),
)

const tsStylisticTypeAwareRules = Object.assign(
  {},
  ...ts.configs.stylisticTypeChecked.map((v) => v.rules).filter(Boolean),
)

const pluginLoveRules = Object.entries(pluginLove.rules)
  .filter((v) => Boolean(v[1]) && v[0].startsWith('@typescript-eslint'))
  .map((v) => ({ [v[0]]: v[1] }))
  .reduce((p, c) => ({ ...p, ...c }))

export default antfu(
  {
    type: 'app',
    lessOpinionated: true,
    jsx: false,
    formatters: {
      css: true,
      html: true,
    },
    svelte: {
      overrides: {
        'svelte/html-quotes': ['warn', { prefer: 'double' }],
      },
    },
    typescript: {
      tsconfigPath: 'tsconfig.json',
      overrides: {
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        }],
      },
      filesTypeAware: ['**/*.{ts,svelte}'],
      overridesTypeAware: {
        // ...pluginLoveRules,
        // ...tsStrictTypeAwareRules,
        // ...tsStylisticTypeAwareRules,
      },
    },
    stylistic: {
      braceStyle: '1tbs',
      overrides: {
        'style/eol-last': 'off',
        'style/arrow-parens': 'error',
        'style/indent': ['error', 2, { ignoredNodes: ['TSTypeAnnotation'] }],
        'style/max-len': [
          'error',
          {
            code: 120,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
          },
        ],
      },
    },
    unicorn: {
      allRecommended: true,
      overrides: {
        'unicorn/prevent-abbreviations': 'off', // Nah
        'unicorn/no-abusive-eslint-disable': 'off',
      },
    },
    jsdoc: true,
    settings: {
      jsdoc: { ignoreInternal: true },
    },
  },

  { ...pluginSecurity.configs.recommended, name: 'security' },
  { ...pluginCompat.configs['flat/recommended'], name: 'compat' },
  { ...pluginSonarJs.configs.recommended, name: 'sonarjs ' },
  {
    name: 'better-tailwindcss',
    files: ['**/*.svelte'],
    plugins: {
      'better-tailwindcss': pluginBetterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app.css',
      },
    },
    rules: {
      ...pluginBetterTailwindcss.configs['recommended-warn'].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
        printWidth: 120,
        group: 'newLine',
        preferSingleLine: true,
      }],
    },
  },

  {

    name: 'Additional Global Rules',
    rules: {
      'no-unused-vars': 'off',

      // jsdoc plugin
      'jsdoc/check-indentation': 'warn',
      'jsdoc/no-bad-blocks': 'warn',
      'jsdoc/no-blank-blocks': 'warn',
      'jsdoc/no-blank-block-descriptions': 'warn',
      'jsdoc/require-asterisk-prefix': 'warn',
      'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
      'jsdoc/require-description-complete-sentence': 'warn',
      'jsdoc/sort-tags': 'warn',
      'jsdoc/require-returns': 'off',

      // security plugin
      'security/detect-object-injection': 'off',

      // sonarjs plugin
      'sonarjs/todo-tag': 'warn',
      'sonarjs/deprecation': 'off', // breaks svelte

      // import plugin
      'unused-imports/no-unused-vars': 'off',
      'import/consistent-type-specifier-style': 'off',

      // eslint-comments plugin
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },

  {
    name: 'Additional Svelte Rules',
    files: ['**/*.svelte'],
    settings: {
      svelte: {
        ignoreWarnings: [
          'ts/no-unsafe-assignment',
          'ts/no-unsafe-return',
          'ts/no-unsafe-member-access',
          'ts/no-unsafe-argument',
          'ts/no-confusing-void-expression',
          'ts/promise-function-async',
          'sonarjs/no-extra-arguments', // Does not pickup svelte's snippet args
          'sonarjs/no-use-of-empty-return-value', // Does not work with svelte's snippets
          'sonarjs/no-unused-vars', // ^^
        ],
      },
    },
    rules: {
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

      // Enforce pascal case for svelte files, ignore sveltekit's special files like +page.svelte
      'unicorn/filename-case': ['error', { case: 'pascalCase', ignore: [/^\+.*\.svelte$/] }],

    },
  },
)

