declare const module: any;
declare const require: any;

// store instances
const components = {};

// store constructors
const componentModules = [];

/**
 * Registers a component class to be initialized later for each DOM element matching the
 * displayName.
 * @param component
 */
export function registerComponent(component) {
  if (component.displayName) {
    componentModules.push(component);
  } else {
    // tslint:disable-next-line no-console
    console.error('missing "block" definition on component', component);
  }
}

/**
 * Used for hot reloading, is called when a new version of a component class is called.
 * @param component
 */
export function updateComponent(component) {
  const BlockConstructor = component;
  const displayName = BlockConstructor.displayName;

  // cleanup and recreate all block instances
  components[displayName].forEach(b => {
    b.instance.dispose && b.instance.dispose();
    b.instance = new BlockConstructor(b.element);
  });
}

/**
 * Called to init components for the elements in the DOM.
 * @param rootElement
 */
export function initComponents(rootElement) {
  componentModules.forEach(component => {
    const BlockConstructor = component;
    const displayName = BlockConstructor.displayName;
    components[BlockConstructor.displayName] = [];

    // find all DOM elements that belong the this block
    [].forEach.call(rootElement.querySelectorAll(`[data-component="${displayName}"]`), element => {
      const instance = new BlockConstructor(element);
      components[displayName].push({ instance, element });
    });
  });
}
