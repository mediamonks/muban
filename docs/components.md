# Components

A muban project consists of components. Everything is a component.

At minimal, a component is a handlebars template file. Often it also contains a stylesheet file. To
make things interactive it can also contain a script file.

## Examples

A simple component could look like this:

```
<button class="component-button">{{text}}</button>
```

To make the button look nice, and handle some logic, you could link to a style and script file:

```
<link rel="stylesheet" href="./button.scss">
<script src="./Button.ts"></script>

<button data-component="button">{{text}}</button>
```

```
[data-component="button"] {
  border: 1px solid #ddd;
  background-color: #eee;
  padding: 4px 8px;
  color: #333;
  cursor: pointer;

  &:hover {
    color: #000;
    border-color: #bbb;
  }
}
```

```
import AbstractComponent from "app/component/AbstractComponent";

export default class Button extends AbstractComponent {
  // this should match the 'data-component' attribute value on the HTML element
  static displayName:string = 'button';

  private btn:HTMLElement;

  // the html element from the handlebars template is passed
  constructor(el:HTMLElement) {
    super(el);

    // when selecting DOM elements, always search from 'this.element'
    this.btn = this.element.querySelector('button');
    this.btn.addEventListener('click', this.handleButtonClick);
  }

  private handleButtonClick = () => {
    console.log('click');
  };

  // only called in development when hot reloading a component
  public dispose() {
    this.btn.removeEventListener('click', this.handleButtonClick);
    this.btn = null;

    super.dispose();
  }
}
```

### Data attributes

Component data attributes are available in a component and can be accessed using data object on the
component. The data attributes are stored as camelCased keys in the data object, without the data-
prefix. So attribute `data-slide-interval` can be referenced within a component using
`this.data.slideInterval`.

The component data object values are stored as strings. Validating and parsing this data is up to
the component author.

An example of using a data attribute

```
<script src="./Carousel.ts"></script>
<div data-component="carousel" data-slide-interval="2000">...</div>
```

```
import AbstractComponent from "app/component/AbstractComponent";

export default class Carousel extends AbstractComponent {
  static displayName:string = 'carousel';

  private slideInterval:number;

  constructor(el:HTMLElement) {
    super(el);

    const interval = (this.data.slideInterval && parseInt(this.data.slideInterval, 10)) || 5000;

    this.slideInterval = setInterval(() => {
      // Some code to slide your carousel
    }, interval);
  }

  public dispose() {
    clearInterval(this.slideInterval);
    this.slideInterval = null;

    super.dispose();
  }
}
```

### Element selecting

Selecting elements is usually done with the `querySelector` or the `querySelectorAll` methods, when
using the querySelector the result will be typed as a `Node` and if you use the querySelectorAll it
will be typed as a `NodeList`. In a lot of situations this is not the desired output since you will
most likely want to loop over the `Nodes` in a forEach loop or use `HTMLElement` specific properties
or eventListeners.

This would mean casting the result or modifying the NodeList every time you use these selectors. To
avoid typing a lot of the same code all `AbstractComponents` have two public methods available for
selecting elements.

```typescript
const element = this.getElement('.some-selector');
const elements = this.getElements('.some-selector');
```

By default the selector is based on the components root element, if you would like to use a
different element you can provide a second parameter that should be used as a containing element.

```typescript
const element = this.getElements('.some-selector', document.body);
const elements = this.getElements('.some-selector', document.body);
```

## Scaffolding

With seng-generator you're able to create pages, blocks and components with the CLI. The
seng-generator needs to be installed globally

```
npm i -g seng-generator
```

The easiest way to use it is by using the wizard

```
sg wizard
```

Starts a wizard to create a component, page or block.

```
sg block foo
```

Generates a block with the name of foo. This can be done for pages and components too.

```
sg page foo -v blocks=header,footer
```

Generates a page with the name of foo and adds the blocks header and footer.

## Lifecycle

When a component file is loaded, it will register itself. When the app boots, all registered
components will be constructed:

* Loop trough all registered component
* Find DOM elements that match the components `displayName`
  * this is set statically on the component class
  * this is set using the `data-component` attribute on the HTML tag
* Sort found DOM elements based on their nesting depth
  * This will make sure child components are constructed first
* Construct the component class and pass the DOM element to the constructor
* Store a reference to the instance and the DOM element
* The above allows any component constructor to select its child components DOM element and look up
  its class instance to communicate with. This can be used to listen for events, read properties or
  call functions. The `getComponentForElement(element:HTMLElement):AbstractComponent` function can
  be used for that.
* When running the dev server, and you change your component script file, it will be hot-reloaded by
  webpack. Before constructing an instance from the updated file, `dispose()` will be called on the
  old instance, so any references or event listeners to the DOM elements can be removed.
