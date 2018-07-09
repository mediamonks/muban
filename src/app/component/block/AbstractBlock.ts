import CoreComponent from 'muban-core/lib/CoreComponent';
import abstractBlockMixin from 'app/component/block/AbstractBlockMixin';
import abstractComponentMixin from 'app/component/AbstractComponentMixin';

export default class AbstractBlock extends abstractBlockMixin(
  abstractComponentMixin(CoreComponent),
) {
  constructor(element: HTMLElement) {
    super(element);
  }
}
