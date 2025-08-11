import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: 'eslint:recommended',
});

export default [
  // Base configurations for Next.js, React, and accessibility
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    '@typescript-eslint/recommended',
  ),

  // Main configuration
  {
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2022,
        sourceType: 'module',
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      perfectionist: require('eslint-plugin-perfectionist'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'react-perf': require('eslint-plugin-react-perf'),
      security: require('eslint-plugin-security'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      sonarjs: require('eslint-plugin-sonarjs'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      // TypeScript rules - Enhanced type safety
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off', // Optional for flexibility
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      // React rules - Modern React best practices
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/jsx-key': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Performance rules
      'react-perf/jsx-no-new-object-as-prop': 'warn',
      'react-perf/jsx-no-new-array-as-prop': 'warn',
      'react-perf/jsx-no-jsx-as-prop': 'warn',

      // SonarJS rules - Code quality and complexity
      'sonarjs/cognitive-complexity': ['warn', 15], // Slightly increased for flexibility
      'sonarjs/no-duplicate-string': ['warn', { threshold: 4 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/prefer-immediate-return': 'warn',

      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',

      // Import management - Clean and organized imports
      'import/no-relative-parent-imports': 'warn',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
            ['type'],
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // Node.js builtins prefixed with `node:`
            ['^node:'],
            // Packages (React first, then others alphabetically)
            ['^react', '^@?\\w'],
            // Internal packages
            ['^(@|components)(/.*|$)'],
            // Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Type imports
            ['^.+\\u0000$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      // Unused imports cleanup
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Code style and consistency
      'perfectionist/sort-objects': [
        'warn',
        {
          type: 'alphabetical',
          order: 'asc',
          'partition-by-comment': true,
        },
      ],
      'perfectionist/sort-imports': 'off', // Using simple-import-sort instead

      // Console and debugging
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // General JavaScript best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'prefer-destructuring': ['warn', { object: true, array: false }],

      // Accessibility - Enhanced rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'] }],
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },

  // Test files - Relaxed rules for testing
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/__tests__/**/*',
      '**/test/**/*',
    ],
    rules: {
      'no-console': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-perf/jsx-no-new-object-as-prop': 'off',
    },
  },

  // Configuration files - Allow flexible imports
  {
    files: [
      '*.config.{js,ts,mjs}',
      '.eslintrc.{js,ts}',
      '**/tailwind.config.{js,ts}',
      '**/next.config.{js,ts}',
      '**/postcss.config.{js,ts}',
    ],
    rules: {
      'import/no-relative-parent-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },

  // Stories files (Storybook) - Allow default exports and relaxed rules
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    rules: {
      'react-perf/jsx-no-new-object-as-prop': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },

  // API routes - Node.js specific rules
  {
    files: ['**/pages/api/**/*', '**/app/**/route.{js,ts}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'log'] }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },

  // Disable conflicting formatting rules (Prettier integration)
  prettier,
];
