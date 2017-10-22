/**
 * Helper function that stores all modules from the context
 * @param context Passed webpack context
 * @param iterator A function (context, key, module) that walks each module in the context
 * @return {[object,Context]} The stored module, and passed context
 */
export function getModuleContext(
  context: any,
  iterator?: (context: any, key: string, module: any) => void,
): [{ [key: string]: any }, any] {
  const modules = {};

  context.keys().forEach(key => {
    const module = context(key);
    modules[key] = module;

    if (typeof iterator === 'function') {
      iterator(context, key, module);
    }
  });

  return [modules, context];
}

/**
 * Helper function that updates and returns the changed modules based on the reloaded context
 * @param reloadedContext Update of the original context with the new modules
 * @param modules The module map for the context
 */
export function getChanged(
  reloadedContext: any,
  modules: { [key: string]: string },
): Array<{ key: string; content: any }> {
  // To find out what module was changed you just compare the result of the
  // require call with the version stored in the modules hash using strict
  // equality. Equal means it is unchanged.
  const changedModules = reloadedContext
    .keys()
    .map(key => {
      return { key, content: reloadedContext(key) };
    })
    .filter(({ key, content }) => {
      return modules[key] !== content;
    });

  changedModules.forEach(({ key, content }) => {
    modules[key] = content;
  });

  return changedModules;
}
