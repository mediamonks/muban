import AbstractBlock from './app/component/block/AbstractBlock';
import AbstractComponent from './app/component/AbstractComponent';
import { getComponentForElement, registerComponent } from 'muban-core';

// Share all shared code and node_modules on this window namespace
const StaticLib = {
  // muban related shared code
  Muban: {
    AbstractComponent,
    AbstractBlock,
  },
  // muban-core utils
  MubanCore: {
    getComponentForElement,
    registerComponent,
  },
  // any node modules you are using in the code
  Modules: {},
};

interface Constructor<T> {
  new (...args: Array<any>): T;
}
type ConstructorArgs<T> = T extends new (...args: infer A) => any ? A : never;

type DynamicLibType = {
  Shared: { [key: string]: Constructor<any> };
  addShared: (classes: { [key: string]: Constructor<any> }) => void;
  getShared: <T extends Constructor<InstanceType<T>>>(name: string) => T;
  createShared: <T extends new (...args: any) => any>(
    name: string,
    ...args: ConstructorArgs<T>
  ) => InstanceType<T>;
};

// This section will be used to dynamically share code via the namespaced window
const DynamicLib: DynamicLibType = {
  Shared: {},
  /**
   * Add shared classes
   * @param classes
   *
   * @example
   * class ParagraphHelper {}
   * Lib.addShared({ ParagraphHelper });
   */
  addShared(classes: { [key: string]: Constructor<any> }) {
    this.Shared = { ...this.Shared, ...classes };
  },
  /**
   * Retrieve a shared class
   * @param name
   *
   * @example
   * const helper = new (Lib.getShared<typeof ParagraphHelper>('ParagraphHelper'))('msg');
   * helper.help();
   */
  getShared<T extends Constructor<InstanceType<T>>>(name: string): T {
    return this.Shared[name] as T;
  },
  /**
   * Retrieve an instance of a shared class
   * @param name
   * @param args The class constructor arguments
   *
   * @example
   * const helper = Lib.createShared<typeof ParagraphHelper>('ParagraphHelper', 'msg');
   * helper.help();
   */
  createShared<T extends Constructor<T>>(
    name: string,
    ...args: ConstructorArgs<T>
  ): InstanceType<T> {
    // @ts-ignore
    return new this.Shared[name](...args);
  },
};

export const Lib = { ...StaticLib, ...DynamicLib };
