import sortBy from 'lodash/sortBy';
import AbstractComponent from '../component/AbstractComponent';

declare const module: any;
declare const require: any;

// store instances
const components: {
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
  const list = [];

  componentModules.forEach(component => {
    const BlockConstructor = component;
    const displayName = BlockConstructor.displayName;

    if (!components[BlockConstructor.displayName]) {
      components[BlockConstructor.displayName] = [];
    }

    if (rootElement.getAttribute('data-component') === displayName) {
      list.push({
        component,
        element: rootElement,
        depth: getComponentDepth(rootElement as HTMLElement),
      });
    }

    // find all DOM elements that belong the this block
    Array.from(rootElement.querySelectorAll(`[data-component="${displayName}"]`)).forEach(
      element => {
        list.push({
          component,
          element,
          depth: getComponentDepth(element as HTMLElement),
        });
      },
    );
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

  if (displayName && components[displayName]) {
    return (<any>(components[displayName].find(b => b.element === element) || {})).instance;
  }

  return null;
}

/**
 * Remove all instances bound to this html element or its children.
 *
 * Finds all elements with a data-component attribute, and disposes and removes the created
 * component instance for that element.
 *
 * You should call this function before removing/replacing any piece of HTML that has components
 * attached to it (e.g. when calling initComponents on replaced HTML)
 *
 * @param {HTMLElement} element
 */
export function cleanElement(element: HTMLElement): void {
  const displayName = element.getAttribute('data-component');

  // find instance linked to element and clean up
  if (displayName && components[displayName]) {
    const itemIndex = components[displayName].findIndex(b => b.element === element);
    if (itemIndex !== -1) {
      const item = components[displayName].splice(itemIndex, 1)[0];
      item.instance.dispose();
    }
  }

  // call recursively on all child data-components
  Array.from(element.querySelectorAll('[data-component]')).forEach(cleanElement);
}

/**
 * Updates the content of an element, including cleanup and initializing the new components.
 * Useful when you retrieved new HTML from the backend and need to replace a section of the page.
 *
 * @param {HTMLElement} element
 * @param {string} html
 */
export function updateElement(element: HTMLElement, html: string): void {
  // dispose all created component instances
  cleanElement(element);

  // insert the new HTML into a temp container to construct the DOM
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const newElement = temp.firstChild;

  // replace the HTML on the page
  element.parentNode.replaceChild(newElement, element);

  // initialize new components for the new element
  initComponents(<HTMLElement>newElement);
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
