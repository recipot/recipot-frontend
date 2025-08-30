import baseConfig from '../../.config/eslint.config.mjs';

export default [
  ...baseConfig,
  {
    rules: {
      'import/no-relative-parent-imports': 'off',
    },
  },
  {
    files: ['jest.config.cjs', 'tailwind.config.cjs', 'postcss.config.cjs'],
    languageOptions: {
      parserOptions: { project: null },
    },
  },
];
