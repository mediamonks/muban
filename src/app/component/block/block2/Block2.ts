import AbstractBlock from '../AbstractBlock';

export default class Block2 extends AbstractBlock {
  static displayName: string = 'block2';

  constructor(el: HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}
