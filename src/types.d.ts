declare module '*.hbs?include';
type Constructor<T = {}> = new (...args: any[]) => T;

interface Window {
  webpackPublicPath: string;
}
