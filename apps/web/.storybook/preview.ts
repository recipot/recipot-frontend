import '../src/app/globals.css';

<<<<<<< HEAD
import type { Preview } from '@storybook/react';
=======
import type { Preview } from '@storybook/nextjs-vite';
>>>>>>> 8a12b09e3bda6835192b1fd8c00cbf1b0bb7f503

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
