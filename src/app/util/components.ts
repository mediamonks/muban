import sortBy from 'lodash/sortBy';
import AbstractComponent from '../component/AbstractComponent';

declare const module: any;
declare const require: any;

// store instances
let components: {
  [key: string]: Array<{
    instance: any;
    element: HTMLElement;
  }>;
} = {};

// store constructors
let componentModules = [];

/**
 * Registers a component class to be initialized later for each DOM element matching the
 * displayName.
 *
 * @param component A reference to the component constructor function
 */
export function registerComponent(component) {
  if (component.displayName) {
    // remove old instance before adding the new one
    componentModules = componentModules.filter(c => c.displayName !== component.displayName);
    componentModules.push(component);
  } else {
    // tslint:disable-next-line no-console
    console.error('missing "block" definition on component', component);
  }
}

/**
 * Used for hot reloading, is called when a new version of a component class is called.
 *
 * @param component A reference to the component constructor function
 */
export function updateComponent(component): void {
  const BlockConstructor = component;
  const displayName = BlockConstructor.displayName;

  // cleanup and recreate all block instances
  components[displayName].forEach(c => {
    c.instance.dispose && c.instance.dispose();
    c.instance = new BlockConstructor(c.element);
  });
}

/**
 * Called to init components for the elements in the DOM.
 *
 * @param {HTMLElement} rootElement
 */
export function initComponents(rootElement: HTMLElement): void {
  // first dispose all old instances
  Object.values(components).forEach(group => {
    group.forEach(b => {
      b.instance.dispose && b.instance.dispose();
    });
  });
  components = {};

  const list = [];

  componentModules.forEach(component => {
    const BlockConstructor = component;
    const displayName = BlockConstructor.displayName;
    components[BlockConstructor.displayName] = [];

    // find all DOM elements that belong the this block
    Array.from(
      rootElement.querySelectorAll(`[data-component="${displayName}"]`),
    ).forEach(element => {
      list.push({
        component,
        element,
        depth: getComponentDepth(element as HTMLElement),
      });
    });
  });

  // sort list by deepest element first
  // this will make sure that child components are constructed
  // before any parents, allowing the parents to directly reference them
  const sortedList = sortBy(list, ['depth']).reverse();

  // create all corresponding classes
  sortedList.forEach(({ component, element }) => {
    const BlockConstructor = component;
    const displayName = BlockConstructor.displayName;

    const instance = new BlockConstructor(element);
    components[displayName].push({ instance, element });
  });
}

/**
 * Given a DOM element, retrieve the attached class instance
 *
 * When component classes are created, a reference to them, along with the element,
 * are stored. This method can be used to retrieve them.
 *
 * This can be useful when using querySelectors to select child DOM elements,
 * and you want to communicate with the attached code, e.g. listen to events,
 * read properties or call functions on them.
 *
 * @param {HTMLElement} element
 * @return {AbstractComponent}
 */
export function getComponentForElement(element: HTMLElement): AbstractComponent {
  const displayName = element.getAttribute('data-component');
  return (<any>((components[displayName] &&
    components[displayName].find(b => b.element === element)) ||
    {})).instance;
}

/**
 * Returns the depth of an element in the DOM
 *
 * @param {HTMLElement} element
 * @return {number}
 */
function getComponentDepth(element: HTMLElement): number {
  let depth = 0;
  let el = element;
  while (el.parentElement) {
    ++depth;
    el = el.parentElement;
  }
  return depth;
}
