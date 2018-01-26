import AbstractBlock from '../AbstractBlock';

export default class Block1 extends AbstractBlock {
  static displayName: string = 'block1';

  private btn: HTMLButtonElement;

  constructor(el: HTMLElement) {
    super(el);

    this.btn = this.element.querySelector('button');
    this.btn.addEventListener('click', this.onButtonClick);
  }

  private onButtonClick = () => {
    // tslint:disable-next-line no-console
    console.log('btn click');
  };

  public dispose() {
    this.btn.removeEventListener('click', this.onButtonClick);
    this.btn = null;

    super.dispose();
  }
}
