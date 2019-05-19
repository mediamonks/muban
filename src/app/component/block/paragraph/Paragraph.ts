import { Lib } from 'Lib';

// types only
import Icon from '../../general/icon/Icon';
import AbstractBlock from '../AbstractBlock';
import ParagraphHelper from './ParagraphHelper';

class Paragraph extends Lib.Muban.AbstractBlock {
  static displayName: string = 'paragraph';

  // this is the best we can do currently without proper namespace typings for Lib
  private ab1: InstanceType<typeof Lib.Muban.AbstractBlock> = new Lib.Muban.AbstractBlock(
    document.getElementById('foo')!,
  );
  // or just directly import the class / node_module, since imports will be stripped anyway
  private ab2: AbstractBlock = new Lib.Muban.AbstractBlock(document.getElementById('foo')!);

  private btn: HTMLButtonElement | null;
  private btnLabel: HTMLSpanElement | undefined | null;
  private btnIcon: HTMLElement | undefined | null;
  private contentMore: HTMLParagraphElement | undefined;

  constructor(el: HTMLElement) {
    super(el);

    // example of getting a class and constructing it with proper typescript
    const helper1 = new (Lib.getShared<typeof ParagraphHelper>('ParagraphHelper'))('msg');
    helper1.help();

    // example of getting a new instance of a class with the correct constructor arguments
    const helper2 = Lib.createShared<typeof ParagraphHelper>('ParagraphHelper', 'msg');
    helper2.help();

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
