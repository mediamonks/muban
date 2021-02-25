declare module '*.hbs?include';
declare module '*.json';
declare module '*.yml';

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: Array<any>) => T;

// declare const process: {
//   env: {
//     NODE_ENV: 'production' | 'development';
//   };
// };

interface Window {
  webpackPublicPath: string;
}
