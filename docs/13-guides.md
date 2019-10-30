# Guides

These guides will help you through certain tasks that you might need during your project! Have a look at the table of contents for a quick overview of the available guides.

- [Guides](#Guides)
  - [Muban](#Muban)
    - [Create a component](#Create-a-component)
    - [Using the wizard](#Using-the-wizard)
    - [Using the shorthand](#Using-the-shorthand)
    - [Create a smart-component](#Create-a-smart-component)
    - [Create a block](#Create-a-block)
    - [Create a page](#Create-a-page)
    - [Using the wizard](#Using-the-wizard-1)
    - [Using the shorthand](#Using-the-shorthand-1)
    - [Do not use the default index template](#Do-not-use-the-default-index-template)
    - [Using JSON for data files](#Using-JSON-for-data-files)
    - [Using JavaScript for data files](#Using-JavaScript-for-data-files)
      - [Object notation](#Object-notation)
      - [Function notation](#Function-notation)
    - [Using JSON for page files](#Using-JSON-for-page-files)
    - [Using JavaScript for page files](#Using-JavaScript-for-page-files)
      - [Object notation](#Object-notation-1)
      - [Function notation](#Function-notation-1)
    - [Use custom variables in your data](#Use-custom-variables-in-your-data)
    - [Updating the HTML boilerplate](#Updating-the-HTML-boilerplate)
    - [Excluding page files.](#Excluding-page-files)
    - [Using assets](#Using-assets)
    - [Static assets](#Static-assets)
      - [Webpack assets](#Webpack-assets)
  - [TypeScript](#TypeScript)
    - [Ensure all components have been adopted](#Ensure-all-components-have-been-adopted)
    - [Select child element/elements](#Select-child-elementelements)
    - [Adding event listeners](#Adding-event-listeners)
    - [Add a polyfill](#Add-a-polyfill)
    - [Get data from data-attributes](#Get-data-from-data-attributes)
    - [Get data from embedded json](#Get-data-from-embedded-json)
    - [Get data through a http-request](#Get-data-through-a-http-request)
      - [Getting HTML](#Getting-HTML)
      - [Getting JSON](#Getting-JSON)
      - [Post a form](#Post-a-form)
      - [Post JSON](#Post-JSON)
      - [File upload](#File-upload)
    - [Update an entire section through a http-request](#Update-an-entire-section-through-a-http-request)
      - [The API returns HTML](#The-API-returns-HTML)
      - [The API returns JSON](#The-API-returns-JSON)
    - [Sort or filter items already in the DOM](#Sort-or-filter-items-already-in-the-DOM)
    - [Load more items to the page](#Load-more-items-to-the-page)
      - [Clone and update element](#Clone-and-update-element)
      - [Use a handlebars template](#Use-a-handlebars-template)
        - [Data util methods](#Data-util-methods)
      - [Use a knockout template](#Use-a-knockout-template)
  - [Handlebars](#Handlebars)
    - [Render a component](#Render-a-component)
    - [Pass data to your component](#Pass-data-to-your-component)
    - [Render data in your component](#Render-data-in-your-component)
    - [Render data as HTML in your component](#Render-data-as-HTML-in-your-component)
    - [Dynamically render components](#Dynamically-render-components)
    - [Using icons](#Using-icons)
    - [Create a custom helper](#Create-a-custom-helper)
      - [A very basic example of a helper that reverses a word could look like this.](#A-very-basic-example-of-a-helper-that-reverses-a-word-could-look-like-this)
  - [Knockout](#Knockout)
    - [Apply bindings to a node.](#Apply-bindings-to-a-node)
    - [Apply bindings to the entire component](#Apply-bindings-to-the-entire-component)
  - [Seng-generator](#Seng-generator)
    - [Create a custom template](#Create-a-custom-template)

## Muban

### Create a component

Creating a component can be done manually by creating all the files as described in the
[page on the components](./03-component). This process takes up a lot of time and increases chance
of errors! To avoid this you can use the
[seng-generator](https://www.npmjs.com/package/seng-generator) to generate them for you! If you
followed the preparation instructions you will by now have this installed.

### Using the wizard

Start by opening the terminal in the root of your project and run the following command.

```
sg wizard
```

This will start up the wizard and it will prompt you with a couple of questions. Use the `up` and
`down` keys to select the template that you want to use and press the `enter` key to continue.

```
? Which template do you want to use? (Use arrow keys)
  block
> component
  page
  smart-component
```

After that enter the desired name of your component and press `enter` again.

```
? Which template do you want to use? component
? What name do you want to use? ()
```

> **Note:** The casing will automatically be changed to the required format.

After you've provided the name you can choose the location where the component should be created.
The default directory is shown so if you don't want to change this just press `enter` to continue.

> **Note:** If you want to provide a different location please provide the full relative path from
> the root of your project.

```
? Which template do you want to use? component
? What name do you want to use? my-component
? Where do you want to create the component? (./src/app/component)
```

After you pressed enter it will notify you that the component has been successfully created.

```
? Which template do you want to use? component
? What name do you want to use? my-component
? Where do you want to create the component? ./src/app/component
Generating files from 'component' template with name: my-component

Done!
```

### Using the shorthand

While using the wizard to generate your components is very easy and descriptive of what's happening
it requires quite a lot of interaction. If you do not want to go through this every time you can use
the shorthand to create the components.

Open up the terminal in the root of your project and run the following command:

```bash
sg component my-component
```

This have the same result as when the wizard is followed.

### Create a smart-component

> ⚠️ Creating a smart-component uses the same steps as described in the
> [creation of a basic component](#Create-a-component).

### Create a block

> ⚠️ Creating a block uses the same steps as described in the
> [creation of a basic component](#Create-a-component).

### Create a page

Creating a page can be done manually by creating the files as described in the
[page on the pages](./04-page.md). This process takes up a lot of time and increases chance of
errors! To avoid this you can use the [seng-generator](https://www.npmjs.com/package/seng-generator)
to generate them for you! If you followed the preparation instructions you will by now have this
installed.

### Using the wizard

Start by opening the terminal in the root of your project and run the following command.

```
sg wizard
```

This will start up the wizard and it will prompt you with a couple of questions. Use the `up` and
`down` keys to select the _page template_ and press `enter` to continue.

```
? Which template do you want to use? (Use arrow keys)
  block
  component
> page
  smart-component
```

After that enter the desired name of your page and press `enter` again.

```
? Which template do you want to use? my-page
? What name do you want to use? ()
```

> **Note:** The casing will automatically be changed to the required format.

After you've provided the name you can choose the location where the page should be created. The
default directory is shown so if you don't want to change this just press `enter` to continue.

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? (./src/data)
```

> **Note:** If you want to provide a different location please provide the full relative path from
> the root of your project.

After that you can provide an optional list of blocks that you want to render out on that page. If
you want to skip this step you can just press `enter`. Otherwise provide a `slug-cased` list of
components that you want to render.

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? ./src/data
? Add a list of comma separated blocks (optional) ()
```

After you pressed enter it will notify you that the page has been successfully created.

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? ./src/data
? Add a list of comma separated blocks (optional) my-block
Generating files from 'page' template with name: my-page

Done!
```

### Using the shorthand

While using the wizard to generate your pages is very easy and descriptive of what's happening it
requires quite a lot of interaction. If you do not want to go through this every time you can use
the shorthand to create the pages.

Open up the terminal in the root of your project and run the following command:

```
sg page my-page
```

> **Note:** This will generate a page file for you, but leave out the step to render in blocks.

### Do not use the default index template

The index overview template is always rendered in the development mode, if for any reason you would
not want this in the distrubution build you can simply create a page called `index`.

### Using JSON for data files

Using JSON as the source for your data files is not recommended but if for any reason you would want
to do this you can.

Add a `data.json` file with the following structure:

```json
{
  "title": "Hi I'm a block! 💪",
  "content": "I'm the body copy for the block."
}
```

> If you are planning on using JSON for all data files, it is recommended to remove the template
> file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/block/` and add a
> JSON variant: `{name_sc}.json`.

### Using JavaScript for data files

If you want dynamic data, add loops or something from the `process.env` you can use JavaScript as
the source of your data.

There are two ways of defining the data in JavaScript.

#### Object notation

This is a static object and will only be initialised once.

```javascript
module.exports = {
  title: "Hi I'm a block! 💪",
  content: "I'm the body copy for the block.",
};
```

#### Function notation

This method is executed on run time so you could technically use this to renew data runtime.

```javascript
module.exports = () => ({
  title: "Hi I'm a block! 💪",
  content: "I'm the body copy for the block.",
});
```

> If you are planning on using JavaScript for all data files, it is recommended to remove the
> template file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/block/`
> and add a JavaScript variant: `{name_sc}.js`

### Using JSON for page files

Using JSON as the source for your pages is not recommended but if for any reason you would want to
do this you can.

Add a `my-page.json` file in the data `src/data/` folder, with the following structure:

```json
{
  "title": "my-page",
  "meta": {
    "id": "",
    "status": "",
    "notes": "",
    "category": ""
  },
  "blocks": [
    {
      "name": "my-block",
      "data": "import!../app/component/block/my-block/data.json"
    }
  ]
}
```

> If you are planning on using JSON for all pages, it is recommended to remove the template file
> `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/page/` and add a JSON
> variant: `{name_sc}.json`

### Using JavaScript for page files

If you want dynamic data, add loops or something from the `process.env` you can use JavaScript as
the source of your data. Just add a `my-page.js` file in the data `src/data/` folder.

There are two ways of defining the data in JavaScript.

#### Object notation

This is a static object and will only be initialised once.

```javascript
module.exports = {
  title: 'my-page',
  meta: {
    id: '',
    status: '',
    notes: '',
    category: '',
  },
  blocks: [
    {
      name: 'my-block',
      data: 'import!../app/component/block/my-block/data.js',
    },
  ],
};
```

#### Function notation

This method is executed on run time so you could technically use this to renew data runtime.

```javascript
module.exports = () => ({
  title: 'my-page',
  meta: {
    id: '',
    status: '',
    notes: '',
    category: '',
  },
  blocks: [
    {
      name: 'my-block',
      data: 'import!../app/component/block/my-block/data.js',
    },
  ],
});
```

> If you are planning on using JavaScript for all pages, it is recommended to remove the template
> file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/page/` and add a
> JavaScript variant: `{name_sc}.js`

### Use custom variables in your data

Using variables in your data can be really usefull if you have to modify certain parts multiple
times. Imagine a situation where your all data files contain absolute paths to images and you would
have to change this for any reason.

**Starting point:** `http://www.some-domain.com/some/path/to/image.jpg`

**Expected result:** `http://www.some-other-domain.com/some/path/to/image.jpg`

You could do this by running find and replace all the files, but apply a find and replace on
everything is always risky. Another way of doing this would be defining commonly used variables in
the `src/data/_variables.yaml` file. These variables will be replaced in the data before the
component is rendered.

**Example \_variables.yaml file**

```yaml
assetBase: http://www.some-other-domain.com
```

After defining the variable you can use it in your data by wrapping it in the `${}` notation.

**Example data.yaml file**

```yaml
image: ${assetBase}/some/path/to/image.jpg
```

> ⚠️ Make sure the current `_src/data/_variables.yaml` file is not empty.

### Updating the HTML boilerplate

The HTML templates of your project can be found in the `build-tools/templates` folder. This folder
contains three files that are used for the different layouts.

| File                             | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| `build-html-template.hbs`        | This template is used with all bundled assets.      |
| `build-html-template-standalone` | This template is used with page specific assets.    |
| `devserver-index.html`           | This template is used to run the development server | `` |

### Excluding page files.

If for any reason you would like to keep the page files but have them excluded from the Muban
project you can do this by prefixing them with an underscore.

Example: `_my-page.yaml`

### Using assets

In Muban there are two types of assets the way you use them is a bit different.

1. Static assets
2. Webpack assets.

### Static assets

Static assets are assets that will not be processed by webpack and they will be copied over to the
root of the `dist` folder after you do a production build. The way to access them is to use the
absolute path to access the asset.

> ⚠️ Assets used in `CSS` will always be bundled, if you don't want this use inline styling.

```handlebars
<img src="/image/path/to/my-image.jpg" alt="Some alt text" />
```

```typescript
const image = new Image();
image.src = '/image/path/to/my-image.jpg';
```

> **Note:** It is recommended to create folders for the type of asset. This way you can keep your
> assets organised.

#### Webpack assets

As the name states Webpack assets are assets that are loaded through webpack, this means they will
automatically be bundled and versioned once you do a production build. This is usefull for assets
that are static and are not provided by the backend. Based on the type of assets they should be kept
in the correct directory in the `src/app` directory. So for example images are kept within an
`image` folder in the `app` folder.

```scss
.some-selector {
  background: url('../../../image/some-image.jpg');
}

// The same but using the seng-css image mixin.
.some-other-selector {
  background: image('some-image.jpg');
}
```

```typescript
const image = new Image();
image.src = require('../../../image/some-image.jpg');
```

## TypeScript

### Ensure all components have been adopted

When the application is initialised it runs through a
[lifecycle](./05-application.md#Application-lifecycle). This basically means that all your
components will be initialised from the deepest child up. This could mean that your child component
is initialised before the parent component. This could (in some cases) cause problems if you rely on
parent components.

If you want to ensure that your component is fully adopted by the application you can add the
`adopted` method to the components TypeScript file and it will be called once the application is
fully mounted.

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-smart-component';

  constructor(el: HTMLElement) {
    super(el);

    // I'm ready but might not be adopted by the application! 😢
  }

  public adopted(): void {
    // I'm finally adopted by the application! 🎉
  }

  public dispose() {
    super.dispose();
  }
}
```

### Select child element/elements

Selecting elements is usually done with the querySelector or the querySelectorAll methods, when
using the querySelector the result will be typed as a Node and if you use the querySelectorAll it
will be typed as a NodeList. In a lot of situations this is not the desired output since you will
most likely want to loop over the Nodes in a forEach loop or use HTMLElement specific properties or
eventListeners.

This would mean casting the result or modifying the NodeList every time you use these selectors. To
avoid typing a lot of the same code all AbstractComponents have two public methods available for
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

The methods both return an array of `HTMLElements`, if you want to modify the return type you can
still provide a generic to overwrite the default.

```typescript
const element = this.getElements<HTMLVideoElement>('.some-selector');
const elements = this.getElements<HTMLVideoElement>('.some-selector');
```

### Adding event listeners

Attaching an event handler to a specific element is a very common thing in JavaScript. In Muban this
works the same as it would on any other plain JavaScript setup:

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private button: HTMLButtonElement;

  constructor(el: HTMLElement) {
    super(el);

    // 1. Select the button in the DOM
    this.button = this.getElement<HTMLButtonElement>('.my-button');
    // 2. Attach the event listener.
    this.button.addEventListener('click', this.onButtonClick);
  }

  private onButtonClick = () => {
    // 3. Handler for the event.
  };

  public dispose() {
    // 4. Remove the listener once the component is disposed.
    this.button.removeEventListener('click', this.onButtonClick);
    super.dispose();
  }
}
```

This covers basically all DOM interactions, but sometimes you would want to dispatch custom events
from your component. For example if your carousel component opens the next slide and you want to
notify a parent component about this.

The easiest way to do this is to use the [seng-event](https://www.npmjs.com/package/seng-event)
module. Please read the extensive documentation to learn more about this!

### Add a polyfill

Sometimes you want to use functionality that not supported by all browsers, to do this you can add a
polyfill for that functionality. You can do this by installing the polyfill and adding it to the
`src/app/polyfills.js` file

For example if you want to install a polyfill for the fetch you first install the dependency.

```bash
yarn add whatwg-fetch
```

After installing the polyfill you add the import to the `polyfills.js` file

```javascript
...

// Add the polyfill for fetch at the bottom of the file
import 'whatwg-fetch';
```

### Get data from data-attributes

Providing data to your TypeScript file through data attributes is very easy and can be done by
adding it to the root element in your `.hbs` file.

```handlebars
<div class="my-component" data-component="my-component" data-colors="#CC9933,#22AA88,#FF8822">
  Hi, I'm a component! 👋
</div>
```

After that you can access it by using the `dataset` object on the element.

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);

    // Get the data from the colors data attribute.
    let { colors } = this.element.dataset;
    
    // Make sure the colors are available.
    if(colors) {
      // Split the values.
      const colorValues = colors.split(',');
      // Do something with the values.
      console.log(colorValues);
    }
  }

  public dispose() {
    super.dispose();
  }
}
```

### Get data from embedded json

When needing quite a big payload on your page, you can embed it in a non-JS script tag, and parse it
with JS afterwards.

```handlebars
<div class="my-component" data-component="my-component">
  <script type="text/json">
    {
      "users": [
        {
          "id": 0,
          "name": "Adam Carter",
          "email": "adam.carter@unilogic.com",
          "dob": "1978",
          "address": "83 Warner Street",
          "city": "Boston"
        },
        {
          "id": 1,
          "name": "Leanne Brier",
          "email": "leanne.brier@connic.org",
          "dob": "13/05/1987",
          "address": "9 Coleman Avenue",
          "city": "Toronto"
        }
      ],
      "images": [
        "img0.png",
        "img1.png",
        "img2.png"
      ],
      "coordinates": {
        "x": 35.12,
        "y": -21.49
      },
      "price": "$59,395"
    }
  </script>
</div>
```

After that you can access it by using the [`getElement`](#Select-child-elementelements) method.

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);

    // 1. Get the script element from the DOM.
    const scriptElement = this.getElement('script[type="text/json"]');
    // 2. Parse the contents as JSON.
    const data = JSON.parse(scriptElement.innerHTML);
  }

  public dispose() {
    super.dispose();
  }
}
```

### Get data through a http-request

If the data is too big, or too dynamic, and the backend has an API in place, we can also get more
data that way.

For basic XHR calls, you should use the Fetch API. To support older browsers (IE), you should
include the fetch polyfill (whatwg-fetch). See the section on
[installing polyfills](#Add-a-polyfill) on how to do this.

> 🔧 If you need more features, you could use [Axios](https://www.npmjs.com/package/axios). It's a
> wrapper around `fetch`, but with more configuration options.

#### Getting HTML

```typescript
fetch('/users.html')
  .then(response => response.text())
  .then(body => {
    document.body.innerHTML = body;
  });
```

#### Getting JSON

```typescript
fetch('/users.json')
  .then(response => response.json())
  .then(json => {
    console.log('parsed json', json);
  })
  .catch(ex => {
    console.error('parsing failed', ex);
  });
```

#### Post a form

```typescript
fetch('/users', {
  method: 'POST',
  body: new FormData(this.getElement('form')),
});
```

#### Post JSON

```typescript
fetch('/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Hubot',
    login: 'hubot',
  }),
});
```

#### File upload

```typescript
const input = this.getElement('input[type="file"]');

const data = new FormData();
data.append('file', input.files[0]); // 1. Add the file that you want to upload.
data.append('user', 'hubot'); // 2. Add any other data that is required.

fetch('/avatars', {
  method: 'POST',
  body: data,
});
```

### Update an entire section through a http-request

#### The API returns HTML

Sometimes, a section rendered by the backend has multiple options, and when switching options you
want new data for that section. If the backend cannot return JSON, they might return a HTML snippet
for that section. In that case we should:

1. Fetch the new section.
2. Clean up the old HTML element (remove attached classes, for memory leaks).
3. Replace the HTML on the page.
4. Initialize new component instances for that section and nested components.

```typescript
import { cleanElement, initComponents } from 'muban-core';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);
  }

  private update() {
    fetch('/api/section/some-slug')
      .then(response => response.text())
      .then(body => {
        // 1. dispose all created component instances.
        cleanElement(this.element);

        // 2. insert the new HTML into a temp container to construct the DOM.
        const temp = document.createElement('div');
        temp.innerHTML = body;
        const newElement = temp.firstChild;

        // 3. replace the HTML on the page.
        this.element.parentNode.replaceChild(newElement, this.element);

        // 4. initialize new components for the new element.
        initComponents(<HTMLElement>newElement);
      });
  }

  public dispose() {
    super.dispose();
  }
}
```

Since this is a lot of typoing there is a utility to do the exact same thing.

```typescript
import { updateElement } from 'muban-core';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);
  }

  private update() {
    fetch('/api/section/some-slug')
      .then(response => response.text())
      .then(body => {
        updateElement(this.element, body);
      });
  }

  public dispose() {
    super.dispose();
  }
}
```

> ⚠️ While this seams like a good option, keep in mind that the whole section will be reset into its
> default state, which could (depending on the contents of the section) be a bad experience,
> especially when dealing with animation/transitions.

#### The API returns JSON

This one might be a bit more work compared to just replacing HTML, but gives you way more control
over what happens on the page. The big benefit is that the state doesn't reset, allowing you to make
nice transitions while the new data is updated on the page.

```typescript
import { updateElement } from 'muban-core';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);
  }

  private update() {
    fetch('/api/section/some-slug')
      .then(response => response.json())
      .then(json => {
        // 1. Update the text in the DOM.
        this.getElement('.js-content).innerHTML = json.content.
      });
  }

  public dispose() {
    super.dispose();
  }
}
```

### Sort or filter items already in the DOM

Sometimes the server renders a list of items on the page, but you have to sort or filter them
client-side, based on specific data in those items. Since we already have all the items and data on
the page, it's not that difficult.

We can just query all the items, and retrieve the information we need to execute our logic, and add
them back to the page.

```typescript
import { updateElement } from 'muban-core';
import AbstractComponent from '../AbstractComponent';

interface ItemData {
  element: HTMLElement;
  title: string;
  tags: Array<string>;
}

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private itemData: Array<ItemData>;

  constructor(el: HTMLElement) {
    super(el);

    this.initItems();
    this.updateItems();
  }

  private initItems(): void {
    // 1. Get all DOM nodes.
    const items = this.getItems('.item');

    // 2. Convert to list of useful data to filter/sort on.
    this.itemData = items.map(item => ({
      element: item,
      title: item.querySelector('.title').textContent,
      tags: Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()),
    }));
  }

  private updateItems(): void {
    // 1. Empty the container.
    const container = this.element.querySelector('.items');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 2. filter on any tags that contains an 's'.
    let newItems = this.filterOnTags(this.itemData, 's');

    // 3. Sort descending.
    newItems = this.sortOnTitle(newItems, false);

    // 4. append new items to the container.
    const fragment = document.createDocumentFragment();
    newItems.forEach(item => fragment.appendChild(item.element));
    container.appendChild(fragment);
  }

  private sortOnTitle(itemData, ascending: boolean = false): Array<ItemData> {
    // Sort items base on the title attribute.
    return [...itemData].sort((a, b) => a.title.localeCompare(b.title) * (ascending ? 1 : -1));
  }

  private filterOnTags(itemData, filter: string): Array<ItemData> {
    // Filter items based on the tags array.
    return itemData.filter(item => item.tags.some(tag => tag.includes(filter.toLowerCase())));
  }

  public dispose() {
    super.dispose();
  }
}
```

### Load more items to the page

Sometimes the server renders the first page of items, but they want to have the second page to be
loaded and displayed from the client. If the server returns HTML, we can just re-use some of the
logic in our HTML example above.

However, if the server returns JSON, we sort of want to re-use the markup of the existing items on
the page. We could build up the HTML ourselves from JavaScript, but that would mean the HTML lives
in two places, on the server and in JavaScript, and it will be hard to keep them in sync.

There are two options we can choose from.

#### Clone and update element

For smaller items, we could just clone the first element of the list, and create a function that
updates all the data in that item, so we can append it to the DOM.

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private template:HTMLElement;
  private fragment:DocumentFragment;

  constructor(el: HTMLElement) {
    super(el);

    this.template = this.getElement('.item');
    this.fragment = document.createDocumentFragment();

    this.addNewItems([{title: 'foo'}, {title: 'bar'}])
  }

  private addNewItems(items:Array<{title:string;>):void {
    // 1. Clone template, update data, and add to fragment
    items.forEach(item => {
      const clone = template.cloneNode(true);
      clone.querySelector('.title').textContent = item.title;
      clone.querySelector('.description').textContent = item.description;
      fragment.appendChild(clone);
    });

    // 2. Add fragment to the list.
    this.element.querySelector('.list').appendChild(fragment);
  }


  public dispose() {
    super.dispose();
  }
}
```

#### Use a handlebars template

If we already have a `.hbs` template, we can use this in JavaScript as well. If we import the .hbs
file, it will be pre-compiled by webpack to a JavaScript function. This function accepts 1
parameter, the data, and returns the HTML string.

```typescript
import { initComponents } from 'muban-core';
import itemTemplate from '../../general/item/item.hbs?include';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private container:HTMLElement;

  constructor(el: HTMLElement) {
    super(el);

    this.container = this.getElement('.list');

    this.addNewItems([{title: 'foo'}, {title: 'bar'}])
  }

  private addNewItems(items:Array<{title:string;>):void {
    items.forEach(item => {
      // 1. Create the element based on the handlebars template.
      const content = itemTemplate(item)
      // 2. Append to the container.
      this.container.appendChild(content);
    });

    // 3. If the new item has any logicy you can optionally call the
    // init components method to make them interactive.
    initComponents(this.container);
  }


  public dispose() {
    super.dispose();
  }
}
```

##### Data util methods

Even though the previous example is quite simple, it still requires a lot of typing to get it done.
To do this more efficient there are two render helpers available in Muban.

1. [renderItem](./09-api-reference.md#renderItem)
2. [renderItems](./09-api-reference.md#renderItems)

```typescript
import { renderItem, renderItems } from 'muban-core/lib/utils/dataUtils';
import itemTemplate from '../../general/item/item.hbs?include';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private container: HTMLElement;

  constructor(el: HTMLElement) {
    super(el);

    this.container = this.getElement('.list');

    // 1. This will replace the current item in the container and initialise it.
    renderItem(this.container, itemTemplate, { title: 'foo' });
    // 2. This will append a new item to the container and only initialise that one.
    renderItem(this.container, itemTemplate, { title: 'foo' }, true);
    // 3. This will replace an entire list of items and initialise all of them.
    renderItems(this.container, itemTemplate, [{ title: 'foo' }, { title: 'bar' }]);
    // 4. This will append a new list to the container and ony initialise the new ones.
    renderItems(this.container, itemTemplate, [{ title: 'foo' }, { title: 'bar' }, true]);
  }

  public dispose() {
    super.dispose();
  }
}
```

#### Use a knockout template

This option works best when only used on the client, but when having server-rendered items in the
DOM you would first need to convert them to data to properly render them.

```handlebars
<!--
List item template, keep in HTML since it will be used by javascript.
The HTML in the script-template is similar to the html in the handlebars list below.
The handlebars template will be rendered on the server, and the script-template will
be used by knockout to render the list client-side (when new data comes in).
-->
<script type="text/html" id="item-template">
  <h3 class="title" data-bind="text: title"></h3>
  <p class="description" data-bind="html: description"></p>
  <div class="tags">
    <!-- ko foreach: tags -->
      <span class="tag" data-bind="text: $data"></span>
    <!-- /ko -->
  </div>
</script>

<section class="items">
  {{#each items}}
    <article class="item">
      <h3 class="title">{{title}}</h3>
      <p class="description">{{description}}</p>
      <div class="tags">
        {{#each tags}}
          <span class="tag">{{this}}</span>
        {{/each}}
      </div>
    </article>
  {{/each}}
</section>
```

```typescript
import ko from 'knockout';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);

    // 1. transform old items to data get all DOM nodes
    const items = this.getElements('.item');

    // Convert to list of useful data to filter/sort on
    const oldData = items.map(item => ({
      title: item.querySelector('.title').textContent,
      description: item.querySelector('.description').innerHTML,
      tags: Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent),
    }));

    // 2. create observable and set old data
    const itemData = ko.observableArray(oldData);

    // 3. apply bindings to list, this will re-render the items
    ko.applyBindingsToNode(this.element.querySelector('.items'), {
      template: { name: 'item-template', foreach: itemData },
    }, {});

    // 4. add new data to the observable or do any other funky stuff to the array, like sorting/filtering
    itemData.push(...newData);
  }

  public dispose() {
    super.dispose();
  }
}
```

> ⚠️ Keep in mind that when you include knockout into your project the distribution bundle size will
> increase a lot.

Even though the previous example is quite simple, it still requires a lot of typing to get it done.
To do this more efficient there is a [util available](./09-api-reference.md#initListBinding) in
Muban to do this for you.

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  constructor(el: HTMLElement) {
    super(el);

    const itemData = initListBinding(this.getElements('.items'), 'item-template', {
      query: '.item',
      data: {
        title: '.title',
        description: { query: '.description', htm: true },
        tags: { query: '.tag', list: true },
      },
    });
    // 4. add new data to the observable or do any other funky stuff to the array, like sorting/filtering
    itemData.push(...newData);
  }

  public dispose() {
    super.dispose();
  }
}
```

## Handlebars

### Render a component

Rendering a component can be done by using the
[handlebars partial call syntax](https://handlebarsjs.com/partials.html).

```handlebars
{{> general/my-component }}
```

> ⚠️ Just make sure the path is relative to the `src/app/component` directory

### Pass data to your component

Providing data to a components can be done by adding parameters.

```handlebars
{{> general/my-component parameter="value" another-parameter="another-value"}}
```

### Render data in your component

To render out provided data you can use handlebars expressions, the most basic version can be seen
in the following example.

```handlebars
<div class="my-component">
  <h1>{{parameter}}</h2>
</div>
```

> **Note:** If you want more detailed instructions and examples on data rendering please have a look
> at the [handlebars documentation](https://handlebarsjs.com/expressions.html).

### Render data as HTML in your component

By default handlebars escapes all inlined HTML tags, if you want to disable this logic you can use
the `triple-stash` notation.

```handlebars
<div class="my-component">
  <h1>{{{parameter}}}</h2>
</div>
```

### Dynamically render components

If you want to dynamically render out child components within a component you can use the
[lookup helper](https://handlebarsjs.com/partials.html) from handlebars.

For example if you have block data that dynamically renders out more blocks.

```yaml
title: My awesome block with child components
childComponents:
  - name: 'my-child-component'
    data: "🥇 I'm the first data."
  - name: 'my-child-component'
    data: "🥈I'm the second data."
  - name: 'my-child-component'
    data: "🥉 I'm the third data."
```

```handlebars
<div>
  <h1>{{title}}</h1>
  {{#each childComponents}}
    {{> (lookup . 'name') data }}
  {{/each}}
</div>
```

> ⚠️ This only works for components in the `src/app/component/block` folder.

### Using icons

SVG icons are a big part of websites nowadays, Muban has a default component that can be used to
render them. To add an SVG icon to your project simply add the `.svg` file in the `src/app/svg`
folder and use the name without the extension of the file to reference it.

```handlebars
{{> general/icon name="name-of-svg-file" }}
```

### Create a custom helper

Handlebars comes with a set of built-in helpers,
[documentation](https://handlebarsjs.com/builtin_helpers.html) on these can be found on their
website. By default Muban already adds one helper that can be used in combintation with the `if`
helper to do more conditional rendering. If you want to add more custom helpers you can add them in
the `build-tools/handlebars-helpers` folder.

#### A very basic example of a helper that reverses a word could look like this.

```javascript
// file: reverse.js
module.exports = function(value) {
  return value
    .split('')
    .reverse()
    .join();
};
```

> **Note 1:** You do not need to register them using the `registerHelper` method this is all handled
> by webpack.

> **Note 2:** The helper will take the name of the file that it's in!

```handlebars
<p>We need to reverse the word "palindrome": {{reverse "palindrome"}}.</p>
```

## Knockout

> ⚠️ Keep in mind that when you include knockout into your project the distribution bundle size will
> increase a lot.

### Apply bindings to a node.

This example will show you how to bind a knockout observable to an element in the DOM. If you want a
more detailed explanation on knockout in Muban please have a look at the
[page bout knockout](./08-knockout.md).

```handlebars
<div class="my-component" data-component="my-component">
  <button>I'm the initial text</p>
</div>
```

```typescript
import ko from 'knockout';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private buttonActive = ko.observable(false);

  constructor(el: HTMLElement) {
    super(el);

    // 1. Bind the value to the element
    ko.applyBindingsToNode(this.getELement('p'), {
      css: { isActive: this.buttonActive },
    }, {});

    // 2. Change the value and see the class change
    this.searchOpened(true);
  }

  public dispose() {
    super.dispose();
  }
}
```

### Apply bindings to the entire component

```handlebars
<div class="my-component" data-component="my-component">
  <button data-bind="text: buttonText"></p>
</div>
```

```typescript
import ko from 'knockout';
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private buttonText = ko.observable("I'm the initial text");

  constructor(el: HTMLElement) {
    super(el);

    // 1. Apply the bindings to the component
    ko.applyBindings(this, this.element);

    // 2. Update the button text
    this.buttonText("I'm the modified text");
  }

  public dispose() {
    super.dispose();
  }
}
```

## Seng-generator

### Create a custom template

The seng-generator CLI uses templates to generate the components and pages that we need to create a
website. These templates are stored in the `build-tools/generator-template` folder. If you add a new
folder there you the CLI will automatically pick this up an let's you use it when you run the
wizard. You can read more about the templates in the
[seng-generator documentation](https://www.npmjs.com/package/seng-generator).
