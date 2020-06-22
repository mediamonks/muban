import AbstractBlock from "../AbstractBlock";

export default class Perks extends AbstractBlock {
  static displayName:string = 'perks';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}
