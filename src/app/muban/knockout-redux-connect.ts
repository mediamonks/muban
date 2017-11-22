import mapping from 'knockout-mapping';

// TODO: copy logic from react-redux connect function
// - auto bindActionCreators logic when
export default function connect(store, mapStateToParams, mapDispatchToParams?, mergeParams?) {
  let mapStateToParamsFunc = mapStateToParams;
  let mapDispatchToParamsFunc = mapDispatchToParams;
  let mergeParamsFunc = mergeParams;

  // set some defaults
  if (typeof mapStateToParamsFunc !== 'function') {
    mapStateToParamsFunc = () => ({});
  }
  if (typeof mapDispatchToParamsFunc !== 'function') {
    mapDispatchToParamsFunc = () => ({});
  }
  if (typeof mergeParamsFunc !== 'function') {
    mergeParamsFunc = (stateParams, dispatchParams, ownParams) => ({
      ...ownParams,
      ...stateParams,
      ...dispatchParams,
    });
  }

  let stateObservables;
  let ownParams;

  store.subscribe(() => {
    const state = store.getState();
    // calls the mapStateToParams with the new state
    const stateParams = mapStateToParamsFunc(state, ownParams);
    // this updates the observables created in the initial mappings
    mapping.fromJS(stateParams, stateObservables);
  });

  return function(ViewModel) {
    if (typeof ViewModel !== 'function') {
      throw new TypeError('ViewModel must be function.');
    }
    return params => {
      ownParams = params;
      const state = store.getState();

      // calls the mapStateToParams wit the state,
      // and passes params that were passed from the parent
      const stateParams = mapStateToParamsFunc(state, ownParams);

      // create a mapping from the returned JS object to a nested observable list
      // TODO: provide a method to pass additional options that are forwarded to the mapping
      // the result will be used to execute updates
      stateObservables = mapping.fromJS(stateParams);

      // bind functions to dispatch actions
      const dispatchParams = mapDispatchToParamsFunc(store.dispatch, ownParams);

      // merge everything and return as final params to the component
      const mergedParams = mergeParamsFunc(stateObservables, dispatchParams, ownParams);

      return new ViewModel(mergedParams);
    };
  };
}
