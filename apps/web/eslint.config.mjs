import baseConfig from '../../.config/eslint.config.mjs';

export default [
  ...baseConfig,
  {
    rules: {
      'import/no-relative-parent-imports': 'off',
    },
  },
];
