/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any, no-useless-constructor, import/no-named-as-default, import/no-named-as-default-member */
import IAbstractComponentMixin from 'app/data/interface/IAbstractComponentMixin';

function abstractBlockMixin<TBase extends Constructor<IAbstractComponentMixin>>(Base: TBase) {
  return class AbstractBlockMixin extends Base {
    public constructor(...args: Array<any>) {
      super(...args);
    }
  };
}

export default abstractBlockMixin;
