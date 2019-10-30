import AbstractComponent from '../../AbstractComponent';

export default class App extends AbstractComponent {
  public static readonly displayName: string = 'app-root';

  constructor(element: HTMLElement) {
    super(element);

    // for generic app logic
  }

  public dispose() {
    // clean up stuff when hot reloading
  }
}
