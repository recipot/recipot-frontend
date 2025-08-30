import { createRequire } from 'module';
import { dirname, join } from 'path';

import type { StorybookConfig } from '@storybook/nextjs-vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {},
  },
  staticDirs: ['../public'],
  stories: [
    '../src/stories/**/*.mdx',
    '../src/components/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/common/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/**/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  viteFinal: async config => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, '../src'),
    };

    // Vite CJS 경고 억제
    config.logLevel = 'error';

    return config;
  },
};
export default config;
