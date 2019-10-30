import { getComponentForElement } from 'muban-core';
import Icon from '../../general/icon/Icon';
import AbstractBlock from '../AbstractBlock';

export default class Paragraph extends AbstractBlock {
  public static readonly displayName: string = 'paragraph';

  private button: HTMLButtonElement | null;
  private buttonLabel: HTMLSpanElement | undefined | null;
  private buttonIcon: HTMLElement | undefined | null;
  private contentMore: HTMLParagraphElement | undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.button = this.element.querySelector('button');
    if (this.button) {
      this.button.addEventListener('click', this.onButtonClick);
      this.buttonLabel = this.getElement<HTMLSpanElement>('.label', this.button);
      this.buttonIcon = this.getElement<HTMLElement>('.icon', this.button);

      this.contentMore = <HTMLParagraphElement>this.element.querySelector('.js-content-more');
    }
  }

  private onButtonClick = () => {
    this.contentMore!.classList.toggle('hidden');

    if (this.contentMore!.classList.contains('hidden')) {
      this.buttonLabel!.textContent = 'read more...';
      if (this.buttonIcon) {
        getComponentForElement<Icon>(this.buttonIcon).setIcon('arrow-down');
      }
    } else {
      this.buttonLabel!.textContent = 'read less...';
      if (this.buttonIcon) {
        getComponentForElement<Icon>(this.buttonIcon).setIcon('arrow-up');
      }
    }
  };

  public dispose() {
    if (this.button) {
      this.button.removeEventListener('click', this.onButtonClick);
      this.button = null;
    }

    super.dispose();
  }
}
