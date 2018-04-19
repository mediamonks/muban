import ICoreComponent from 'muban-core/lib/interface/ICoreComponent';

function abstractComponentMixin<TBase extends Constructor<ICoreComponent>>(Base: TBase) {
  return class AbstractComponentMixin extends Base {
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

export default abstractComponentMixin;
