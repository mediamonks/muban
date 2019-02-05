import { Lib } from 'Lib';

export default class {{name_pc}} extends Lib.Muban.AbstractBlock {
  public static displayName:string = '{{name_sc}}';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}

Lib.MubanCore.registerComponent({{name_pc}});
