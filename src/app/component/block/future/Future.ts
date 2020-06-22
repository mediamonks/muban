import AbstractBlock from "../AbstractBlock";

export default class Future extends AbstractBlock {
  static displayName:string = 'future';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}
