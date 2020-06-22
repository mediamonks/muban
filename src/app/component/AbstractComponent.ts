import { CoreComponent } from 'muban-core';
import abstractComponentMixin from 'app/component/AbstractComponentMixin';

export default class AbstractComponent extends abstractComponentMixin(CoreComponent) {
  constructor(element: HTMLElement) {
    super(element);
  }
}
