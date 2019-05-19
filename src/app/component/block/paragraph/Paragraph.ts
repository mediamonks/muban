import { Lib } from 'Lib';

// types only
import Icon from '../../general/icon/Icon';
import ParagraphHelper from './ParagraphHelper';

class Paragraph extends Lib.Muban.AbstractBlock {
  public static readonly displayName: string = 'paragraph';

  // this is the best we can do currently without proper namespace typings for Lib
  private ab: InstanceType<typeof Lib.Muban.AbstractBlock> = new Lib.Muban.AbstractBlock(
    document.getElementById('foo')!,
  );

  private button: HTMLButtonElement | null;
  private buttonLabel: HTMLSpanElement | undefined | null;
  private buttonIcon: HTMLElement | undefined | null;
  private contentMore: HTMLParagraphElement | undefined;

  constructor(el: HTMLElement) {
    super(el);

    // example of getting a class and constructing it with proper typescript
    const helper1 = new (Lib.getShared<typeof ParagraphHelper>('ParagraphHelper'))('msg');
    helper1.help();

    // example of getting a new instance of a class with the correct constructor arguments
    const helper2 = Lib.createShared<typeof ParagraphHelper>('ParagraphHelper', 'msg');
    helper2.help();

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
        Lib.MubanCore.getComponentForElement<Icon>(this.buttonIcon).setIcon('arrow-down');
      }
    } else {
      this.buttonLabel!.textContent = 'read less...';
      if (this.buttonIcon) {
        Lib.MubanCore.getComponentForElement<Icon>(this.buttonIcon).setIcon('arrow-up');
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

Lib.MubanCore.registerComponent(Paragraph);
