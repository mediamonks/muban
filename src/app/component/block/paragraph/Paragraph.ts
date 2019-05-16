import { Lib } from 'Lib';

// types only
import Icon from '../../general/icon/Icon';
import ParagraphHelper from './ParagraphHelper';

class Paragraph extends Lib.Muban.AbstractBlock {
  static displayName: string = 'paragraph';

  private btn: HTMLButtonElement | null;
  private btnLabel: HTMLSpanElement | undefined | null;
  private btnIcon: HTMLElement | undefined | null;
  private contentMore: HTMLParagraphElement | undefined;

  constructor(el: HTMLElement) {
    super(el);

    const helper = Lib.createShared<typeof ParagraphHelper>('ParagraphHelper');
    helper.help();

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
        Lib.MubanCore.getComponentForElement<Icon>(this.btnIcon).setIcon('arrow-down');
      }
    } else {
      this.btnLabel!.textContent = 'read less...';
      if (this.btnIcon) {
        Lib.MubanCore.getComponentForElement<Icon>(this.btnIcon).setIcon('arrow-up');
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

Lib.MubanCore.registerComponent(Paragraph);
