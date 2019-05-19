import { Lib } from 'Lib';

class {{name_pc}} extends Lib.Muban.AbstractBlock {
  public static displayName:string = '{{name_sc}}';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}

export default {{name_pc}};

Lib.MubanCore.registerComponent({{name_pc}});
