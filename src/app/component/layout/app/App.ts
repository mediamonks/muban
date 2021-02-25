import AbstractComponent from '../../AbstractComponent';

export default class App extends AbstractComponent {
  public static readonly displayName: string = 'app-root';

  // eslint-disable-next-line no-useless-constructor
  public constructor(element: HTMLElement) {
    super(element);

    // for generic app logic
  }

  public dispose() {
    // clean up stuff when hot reloading
    super.dispose();
  }
}
