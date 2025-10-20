import baseConfig from '../../.config/eslint.config.mjs';

export default [
  ...baseConfig.map(config => {
    // TypeScript 프로젝트 경로를 웹 앱에 맞게 수정
    if (config.languageOptions?.parserOptions?.project) {
      return {
        ...config,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            ...config.languageOptions.parserOptions,
            project: './tsconfig.json',
          },
        },
      };
    }
    return config;
  }),
  {
    rules: {
      'import/no-relative-parent-imports': 'off',
    },
  },
  {
    files: ['tailwind.config.cjs', 'postcss.config.cjs'],
    languageOptions: {
      parserOptions: { project: null },
    },
  },
];
