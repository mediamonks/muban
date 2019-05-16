// MyLib.imports.ts
import AbstractBlock from './app/component/block/AbstractBlock';
import AbstractComponent from './app/component/AbstractComponent';
import { getComponentForElement, registerComponent } from 'muban-core';

const StaticLib = {
  Muban: {
    AbstractComponent,
    AbstractBlock,
  },
  MubanCore: {
    getComponentForElement,
    registerComponent,
  },
  Modules: {},
};

interface Constructor<T> {
  new (...args: Array<any>): T;
}
type ConstructorArgs<T> = T extends new (...args: infer A) => any ? A : never;

type DynamicLibType = {
  Shared: { [key: string]: { new (...args: Array<any>): any } };
  addShared: (classes: { [key: string]: Constructor<any> }) => void;
  getShared: <T>(name: string) => Constructor<T>;
  createShared: <T extends new (...args: any) => any>(
    name: string,
    ...args: ConstructorArgs<T>
  ) => InstanceType<T>;
};

const DynamicLib: DynamicLibType = {
  Shared: {},
  addShared(classes: { [key: string]: Constructor<any> }) {
    this.Shared = { ...this.Shared, ...classes };
  },
  getShared<T>(name: string): Constructor<T> {
    return this.Shared[name];
  },
  createShared<T extends new (...args: any) => any>(
    name: string,
    ...args: ConstructorArgs<T>
  ): InstanceType<T> {
    // @ts-ignore
    return new this.Shared[name](...args);
  },
};

export const Lib = { ...StaticLib, ...DynamicLib };
