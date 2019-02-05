// MyLib.imports.ts
import AbstractBlock from './app/component/block/AbstractBlock';
import AbstractComponent from './app/component/AbstractComponent';
import { getComponentForElement, registerComponent } from 'muban-core';
export const Lib = {
  Muban: {
    AbstractComponent,
    AbstractBlock,
  },
  MubanCore: {
    getComponentForElement,
    registerComponent,
  }
};
