/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any, no-useless-constructor, import/no-named-as-default, import/no-named-as-default-member */
import ICoreComponent from 'muban-core/lib/interface/ICoreComponent';

function abstractComponentMixin<TBase extends Constructor<ICoreComponent>>(Base: TBase) {
  return class AbstractComponentMixin extends Base {
    public constructor(...args: Array<any>) {
      super(...args);
    }
  };
}

export default abstractComponentMixin;
