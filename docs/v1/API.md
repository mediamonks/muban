# API reference

## Muban

### initComponents

Init components for the passed container and all children in the DOM.

```ts
initComponents(rootElement: HTMLElement): void
```

* **rootElement** - The container to make 'interactive'. This container and all elements in it will
  be searched for Muban components (using the `data-component` attribute), and a new class instance
  will be created for every component. All HTML outside of this component will be ignored.
  
Once the component tree for the passed rootElement is fully constructed, the `adopted()` lifecycle
method will be called on all new components that implement that method.
When the `adopted()` method is called, it means that the component is fully adopted by all its
parents and the application is fully mounted.

### cleanElement

Cleans all component classes previously created by calling initComponents on the same container. 

```ts
cleanElement(rootElement: HTMLElement): void
```

* **rootElement** - The container to 'clean'. This container and all elements in it will
  be searched for Muban components (using the `data-component` attribute) that have an instance
  registered. All HTML outside of this component will be ignored.

You will only need this method when removing HTML from the DOM (or replacing it with something
else), to make sure there won't be any active code around linked to elements that don't exist
anymore.

### updateElement

Updates an element with new HTML, makes use of `cleanElement` and `initComponents`.

```ts
updateElement(element: HTMLElement, html: string): void
```

* **element** - The element to clean and insert the new HTML in.
* **html** - The new HTML to add to the element, it will be made interactive afterwards.

First calls `cleanElement` to clean up the current HTML in the element, then adds the provided HTML
in the DOM and calls `initComponents`.

Mostly useful when receiving rendered HTML from an API call that should be inserted in the DOM.

### getComponentForElement

Returns a class instance for DOM node.

```ts
getComponentForElement(element: HTMLElement): CoreComponent
```

* **element** - A HTML element with a `data-component` attribute, where a previous call to
  `initComponents` created a class instance.
* returns **CoreComponent** - The created class instance for the provided element.

This can be useful for inter-component communication. From `component A` you can do a
`querySelector` to find the DOM node of another component, and then call `getComponentForElement` to
retrieve the instance. From there, you can read properties, call methods or add events.

Muban creates child components first, so in the `constructor` of any components, all children
classes already have been instantiated. If you want to have access to class instances of parent
DOM elements, you should call this method from the `adopted()` lifecycle method.

## Handlebars

### renderItem

Renders an item in the DOM using a handlebars template and some data.

```ts
renderItem(
  container: HTMLElement,
  template: (data?: any) => string,
  data: any,
  append: boolean = false,
): void
```

* **container** - The container to render the item in.
* **template** - A precompiled Handlebars template, where you can pass in data and get the rendered
  HTML as a result.
* **data** - The data object being passed to the Handlebars template.
* **append** - When false (default), it cleans the container, so only the rendered HTML will end up
  in the container. When true, it will append the rendered item at the end of the container.

The rendered HTML will be made interactive by calling `initComponents` on the newly added
components.

This is useful when you don't have an HTML node available in the DOM to clone, or if the template
contains a lot of rendering logic that you don't want to repeat in JavaScript. The downside of
using this is that eventually the HTML will live in two places; in the imported .hbs template in the
JS bundle, and in the rendered HTML from the server. 

An example:
```js
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import buttonTemplate from '../../general/button/button.hbs?include';

renderItem(container, buttonTemplate, { text: 'button text' });
```

### renderItems

Renders a list of items in the DOM using a handlebars template and an Array of data.

```ts
renderItems(
  container: HTMLElement,
  template: (data?: any) => string,
  data: Array<any>,
  append: boolean = false,
): void
```

* **container** - The container to render the item in.
* **template** - A precompiled Handlebars template, where you can pass in data and get the rendered
  HTML as a result. The template will be called for each item in the data Array.
* **data** - An Array where each item is being passed to the Handlebars template.
* **append** - When false (default), it cleans the container, so only the rendered HTML will end up
  in the container. When true, it will append the rendered items at the end of the container.

This function is similar to `renderItem`, excepts it renders a list. See the documentation on
`renderItem` for more information.

## Knockout

### initTextBinding

Sets up a binding to the element, and sets the element's content as initial value.

```ts
initTextBinding(
  element: HTMLElement,
  html: boolean = false,
): KnockoutObservable<string>
```

* **element** - The element to apply the binding to, and where to extract the content from.
* **html** - When true, extracts the content as HTML, and sets the HTML binding. When false, extract
  the text contents, and sets the text binding.
* returns **KnockoutObservable\<string>** - The observable that is linked to the element. When
  updating this observable, the content in the element will update.

Please have a look at the knockout documentation for more information about the `text` and `html`
bindings.

An example:
```js
// init the binding
const label = initTextBinding(this.getElement('.label'));

// would return the original label text value
console.log(label());

// set the new label value, updates the HTML
label('new label text');
```

### initListBinding

Sets up a foreach template binding to a container, and can optionally extract the old data.

```ts
initListBinding<T>(
  container: HTMLElement,
  templateName: string,
  configOrData: Array<T> | any,
  additionalData?: any,
): KnockoutObservable<Array<T>>
```

* **container** - The container to apply the binding to, and where to extract the content from.
* **templateName** - The Knockout template to render for each
* **configOrData** - When passing an Array, it will be used as initial data to render. When passing
  an Object, it will be used as configuration for `html-extract-data`. The extracted data from the
  HTML will be used to render the same content again using the Knockout template.
* **additionalData** - Useful when extracting data from HTML, it is passed as third parameter to
  `html-extract-data`, and merged with each item extracted. This could be used to setup bindings
  that don't deal with data (e.g. click bindings).
* returns **KnockoutObservable<Array<T>>** - The observable Array that is linked to the rendered
  items, filled with either the passed data Array or the extracted data from the DOM. When updating
  this observable, the list in the DOM will also update. _Note, the fields of individual items are
  not observable, only the list itself._

This function can be used in two ways:
* setting up a normal Knockout `foreach` binding by passing data to render, or
* by extracting the rendered items from the DOM as a starting point using the `html-extract-data`
  module. This option is mostly useful when you already have rendered items in the DOM, and you want
  to append some more at a later time. Or when you want to make the current items interactive with
  additional Knockout bindings.
  
Please have a look at the knockout documentation how to define templates, and how foreach bindings
and observableArrays work.

And when extracting data, check the documentation from [html-extract-data](https://github.com/thanarie/html-extract-data).

A data example:
```js
const items = initListBinding(
  this.getElement('.items'),
  'list-template',
  [
    { name: 'Bob', age: 21 },
    { name: 'Alice', age: 19 },
  ]
);

// add a new item, will be added to the DOM
items.push({ name: 'Joe', age: 24 });
```

An extract example:
```js
const items = initListBinding(
  this.getElement('.items'),
  'list-template',
  {
    query: '.grid-item',
    data: {
      name: '.name',
      age: { query: '.age', convert: parseInt }
    }
  },
  {
    onClick(vm) {
      console.log('clicked', vm);
    }
  }
);

// add a new item, will be added to the DOM
items.push({ name: 'Joe', age: 24 });
```

## bootstrap

### dist

Bootstraps the Muban application during a production build.

```ts
bootstrap(
  appRoot: HTMLElement,
  options: {
    onInit?: () => void;
  } = {})
```

* **appRoot** - The container where the Muban application lives, most likely a div in the `<body>`.
* **onInit** - Optional callback that gets called after the application is fully interactive.

### dev

Bootstraps the Muban application during a development build.


```ts
bootstrap(
  appRoot: HTMLElement,
  options: {
    indexTemplate: (data: any) => string;
    appTemplate: (data: any) => string;
    dataContext: any;
    partialsContext: any;
    Handlebars: any;
    onBeforeInit?: () => void;
    onInit?: () => void;
    onUpdate?: () => void;
    onData: (data: object, pageName: string) => object;
    registerPartialMap?: Array<(path: string) => string | null>;
    pageName?: string;
  } = {}): {
    updateData: (changedContext) => void, 
    updatePartials: (changedContext) => void, 
    update: (updatedIndexTemplate, updatedAppTemplate) => void,
  }
```

* **appRoot** - The container where the Muban application lives, most likely a div in the `<body>`.
* **indexTemplate** - The hbs template to render the Muban index page.
* **appTemplate** - The hbs template to render the application shell, includes logic to render
  all the blocks.
* **dataContext** - A webpack context with all data (yaml/json) files.
* **partialsContext** - A webpack context with component hbs files.
* **Handlebars** - The Handlebars instance to register templates to.
* **onBeforeInit** - Optional callback that gets called right before the application becomes fully interactive.
* **onInit** - Optional callback that gets called after the application is fully interactive.
* **onUpdate** - Optional callback that gets called after hot reloading did an update.
* **onData** - Optional callback that gets called before rendering the page, and gives you the opportunity to modify the data before rendering.
* **registerPartialMap** - A map with functions to define if and how partials should be registered.
* **pageName** - Override a pageName to render, when you don't want to make use of the default url
  parsing logic of Muban.
* returns **App** - An object with 3 functions that can be called when hot reloading triggers. The
  app will do the appropriate re-rendering and trigger the `onUpdate` callback afterwards.

Both `indexTemplate` and `appTemplate` are passed from the outside, so you have full control in the
project about where they are located. Together with the `dataContext` and `partialsContext` they
are kept outside so we can apply hot reloading logic. When any of those 4 things change, we update
the returned `app` object.

**registerPartialsMap**

The `registerPartialsMap` has a default value:
```ts
[
    path => (path.includes('/block/') ? /\/([^/]+)\.hbs/gi.exec(path)[1] : null),
]
```
The above will first check if there is `/block/` in the path, and if so it will return the basename.
So a path of `component/block/paragraph/paragraph.hbs` will return `paragraph`. This means that the
partial is registered as `paragraph`, and is used in the `data.yaml` with that block name.

You can register multiple functions, but the first one that returns a non-null value will
short-circuit the map.

When providing a custom map, make sure to also include the default value above if you want to keep
it, since it will overwrite the complete map.

This option is most useful if you want to render non-block components in a dynamic way in
Handlebars. By default, the handlebars-loader will auto-require all static partial includes, but
dynamic includes (e.g. using the `lookup` helper) will need to be registered manually upfront.
