import { getComponentForElement } from 'muban-core';
import Icon from '../../general/icon/Icon';
import AbstractBlock from '../AbstractBlock';

export default class Paragraph extends AbstractBlock {
  public static readonly displayName: string = 'paragraph';

  private btn: HTMLButtonElement | null;
  private btnLabel: HTMLSpanElement | undefined | null;
  private btnIcon: HTMLElement | undefined | null;
  private contentMore: HTMLParagraphElement | undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.btn = this.element.querySelector('button');
    if (this.btn) {
      this.btn.addEventListener('click', this.onButtonClick);
      this.btnLabel = this.getElement<HTMLSpanElement>('.label', this.btn);
      this.btnIcon = this.getElement<HTMLElement>('.icon', this.btn);

      this.contentMore = <HTMLParagraphElement>this.element.querySelector('.js-content-more');
    }
  }

  private onButtonClick = () => {
    this.contentMore!.classList.toggle('hidden');

    if (this.contentMore!.classList.contains('hidden')) {
      this.btnLabel!.textContent = 'read more...';
      if (this.btnIcon) {
        getComponentForElement<Icon>(this.btnIcon).setIcon('arrow-down');
      }
    } else {
      this.btnLabel!.textContent = 'read less...';
      if (this.btnIcon) {
        getComponentForElement<Icon>(this.btnIcon).setIcon('arrow-up');
      }
    }
  };

  public dispose() {
    if (this.btn) {
      this.btn.removeEventListener('click', this.onButtonClick);
      this.btn = null;
    }

    super.dispose();
  }
}
