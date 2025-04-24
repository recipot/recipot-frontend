import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
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
  // Shareable configs for React and Hooks
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ),

  // SonarJS rules (duplicate strings, identical functions, cognitive complexity)
  {
    plugins: {
      sonarjs: require('eslint-plugin-sonarjs'),
    },
    rules: {
      'sonarjs/cognitive-complexity': ['warn', 10],
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'error',
    },
  },

  // Core language options, plugins, and rules
  {
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
      perfectionist: require('eslint-plugin-perfectionist'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-relative-parent-imports': 'warn',
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      // console and any
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Perfectionist sorting for objects
      'perfectionist/sort-objects': [
        'warn',
        { order: 'asc', type: 'alphabetical' },
      ],
      'react-hooks/exhaustive-deps': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'simple-import-sort/exports': 'warn',
      // Import sorting and grouping
      'simple-import-sort/imports': 'warn',

      'unused-imports/no-unused-imports': 'warn',
      // Note: 'sort-arrays' rule not supported by current plugin version
    },
  },

  // Merge Prettier at the end to disable conflicting ESLint rules
  prettier,
];
