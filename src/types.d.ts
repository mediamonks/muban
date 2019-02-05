/// <reference path="./app/component/block/AbstractBlock.ts" />

// import TAbstractBlock from './app/component/block/AbstractBlock';

declare module '*.hbs?include';
declare module '*.json';
declare module '*.yml';

type Constructor<T = {}> = new (...args: any[]) => T;

// declare const process: {
//   env: {
//     NODE_ENV: 'production' | 'development';
//   };
// };

interface Window {
  webpackPublicPath: string;
}

// declare const foo: {
//   AbstractBlock:typeof TAbstractBlock;
// };

declare class AbstractBlock {

}
