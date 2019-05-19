import { Lib } from 'Lib';

// import types only, all imports will be removed on build

class {{name_pc}} extends Lib.Muban.AbstractBlock {
  public static readonly displayName:string = '{{name_sc}}';

  constructor(el:HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}

export default {{name_pc}};

Lib.MubanCore.registerComponent({{name_pc}});
