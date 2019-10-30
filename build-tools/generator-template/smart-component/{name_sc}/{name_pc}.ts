import AbstractComponent from '../AbstractComponent';

export default class {{name_pc}} extends AbstractComponent {
  public static readonly displayName:string = '{{name_sc}}';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}
