import IAbstractComponentMixin from 'app/data/interface/IAbstractComponentMixin';

function abstractBlockMixin<TBase extends Constructor<IAbstractComponentMixin>>(Base: TBase) {
  return class AbstractBlockMixin extends Base {
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

export default abstractBlockMixin;
