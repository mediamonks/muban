import AbstractComponent from '../AbstractComponent';

export default class {{name_pc}} extends AbstractComponent {
  public static readonly displayName:string = '{{name_sc}}';

  public constructor(element:HTMLElement) {
    super(element);
  }

  public dispose() {
    super.dispose();
  }
}
