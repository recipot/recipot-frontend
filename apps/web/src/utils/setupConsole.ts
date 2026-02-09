const isDevelopment = (process.env.NEXT_PUBLIC_APP_ENV ?? 'production') === 'development';

// eslint-disable-next-line no-console
const originalLog = console.log.bind(console);
const originalInfo = console.info.bind(console);

// eslint-disable-next-line no-console
console.log = (...args: Parameters<typeof console.log>) => {
  if (isDevelopment) {
    originalLog(...args);
  }
};

console.info = (...args: Parameters<typeof console.info>) => {
  if (isDevelopment) {
    originalInfo(...args);
  }
};
