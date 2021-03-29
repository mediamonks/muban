import AbstractComponent from '../../AbstractComponent';

export default class App extends AbstractComponent {
  public static readonly displayName: string = 'index-root';

  public constructor(element: HTMLElement) {
    super(element);

    document.documentElement.classList.add('index');

    this.getElements('sup').forEach(sup => {
      sup.addEventListener('click', event => {
        const page = (event.currentTarget as HTMLElement).closest('.page');
        if (page) {
          page.classList.toggle('show-blocks');
          this.updateBlocksButton();
        }
      });
    });

    this.getElement('.toggle-blocks')!.addEventListener('click', () => {
      const pages = this.getElements('.page');
      if (pages.some(page => page.classList.contains('show-blocks'))) {
        pages.forEach(page => page.classList.remove('show-blocks'));
      } else {
        pages.forEach(page => page.classList.add('show-blocks'));
      }
      this.updateBlocksButton();
    });

    // for generic app logic
  }

  private updateBlocksButton() {
    const pages = this.getElements('.page')!;
    if (pages.some(page => page.classList.contains('show-blocks'))) {
      this.getElement('.toggle-blocks')!.textContent = 'hide blocks';
    } else {
      this.getElement('.toggle-blocks')!.textContent = 'show blocks';
    }
  }

  public dispose() {
    // clean up stuff when hot reloading
    super.dispose();
  }
}
