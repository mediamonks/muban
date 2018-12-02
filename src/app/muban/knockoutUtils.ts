import ko from 'knockout';
import extract from 'html-extract-data';

/**
 * Sets up a binding to the element, and sets the element's content as initial value
 *
 * @param {HTMLElement} element
 * @param {boolean} html
 * @return {KnockoutObservable<string>}
 */
export function initTextBinding(
  element: HTMLElement,
  html: boolean = false,
): KnockoutObservable<string> {
  // init the observable with the correct initial data
  const obs = ko.observable(<string>element[html ? 'innerHTML' : 'textContent']);

  // then apply the observable to the HTML element
  ko.applyBindingsToNode(element, {
    [html ? 'html' : 'text']: obs,
  });

  return obs;
}

/**
 * Sets up a foreach template binding to a container, and can optionally extract the old data
 *
 * If extractData is an array, it will use that data as-is. This means you have extraced the
 * data yourself.
 *
 * Otherwise extractData should be an config object which will be used to extract the data for you.
 * An example of it is this:
 *
 * ```
 * {
 *   query: '.item',
 *   data: {
 *     title: '.title',
 *     description: { query: '.description', htm: true },
 *     tags: { query: '.tag', list: true },
 *   }
 * }
 * ```
 *
 * The outer `query` is used to select the items in the container.
 * For each item, it will store each key with the extract data.
 *
 * When given just a string, it will `query` that element and use the `textContent`.
 * When given an object, you can pass additional configuration.
 * The `query` parameter is the same that can be passed as just a string.
 * When `html` is true, it will use `innerHTML` instead of `textContent`.
 * When `list` is `true`, it use `querySelectorAll` and extract the values from those nodes into
 * an array.
 *
 * The output of the example above will match:
 * ```
 * <article class="item">
 *   <h3 class="title">item 3</h3>
 *   <p class="description">Description for <b>item 3</b></p>
 *   <div class="tags">
 *     <span class="tag">js</span>
 *     <span class="tag">html</span>
 *   </div>
 * </article>
 * ```
 *
 * To:
 * ```
 * {
 *   "title": "item 3",
 *   "description": "Description for <b>item 3</b>",
 *   "tags": ["js", "html"],
 * }
 * ```
 *
 * @param {HTMLElement} container
 * @param {string} templateName
 * @param {Array<T> | any} configOrData
 * @param [additionalData]
 * @return {KnockoutObservable<Array<T>>}
 */
export function initListBinding<T>(
  container: HTMLElement,
  templateName: string,
  configOrData: Array<T> | any,
  additionalData?: any,
): KnockoutObservable<Array<T>> {
  let currentData;
  if (Array.isArray(configOrData)) {
    currentData = configOrData;
  } else {
    currentData = extract(container, { ...configOrData, list: true }, additionalData);
  }
  // 2. create observable and set old data
  const list = ko.observableArray<T>(currentData);
  // 3. apply bindings to list, this will re-render the items
  ko.applyBindingsToNode(container, {
    template: { name: templateName, foreach: list },
  });
  return list;
}
