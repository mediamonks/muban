# Guides

Here you can find a collection of guides to help you perform certain tasks you might want to do in
your project!

## Muban

### Create a component
Creating a component can be done manually by creating all the files as described in the [page on the components](./03-component). This process takes up a lot of time and increases chance of errors! To avoid this you can use the [seng-generator](https://www.npmjs.com/package/seng-generator) to generate them for you! If you followed the preparation instructions you will by now have this installed. 

### Using the wizard
Start by opening the terminal in the root of your project and run the following command.

```
sg wizard
```

This will start up the wizard and it will prompt you with a couple of questions. Use the `up` and `down` keys to select the template that you want to use and press the `enter` key to continue.

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

After you've provided the name you can choose the location where the component should be created. The default directory is shown so if you don't want to change this just press `enter` to continue.

> **Note:** If you want to provide a different location please provide the full relative path from the root of your project.

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

While using the wizard to generate your components is very easy and descriptive of what's happening it requires quite a lot of interaction. If you do not want to go through this every time you can use the shorthand to create the components.

Open up the terminal in the root of your project and run the following command:

```bash
sg component my-component
```

This have the same result as when the wizard is followed.


### Create a smart-component
> ⚠️ Creating a smart-component uses the same steps as described in the [creation of a basic component](#Create-a-component).

### Create a block
> ⚠️ Creating a block uses the same steps as described in the [creation of a basic component](#Create-a-component).

### Create a page
Creating a page can be done manually by creating the files as described in the [page on the pages](./04-page.md). This process takes up a lot of time and increases chance of errors! To avoid this you can use the [seng-generator](https://www.npmjs.com/package/seng-generator) to generate them for you! If you followed the preparation instructions you will by now have this installed. 

### Using the wizard

Start by opening the terminal in the root of your project and run the following command.

```
sg wizard
```

This will start up the wizard and it will prompt you with a couple of questions. Use the `up` and `down` keys to select the *page template* and press `enter` to continue.

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

After you've provided the name you can choose the location where the page should be created. The default directory is shown so if you don't want to change this just press `enter` to continue.

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? (./src/data) 
```
> **Note:** If you want to provide a different location please provide the full relative path from the root of your project.

After that you can provide an optional list of blocks that you want to render out on that page. If you want to skip this step you can just press `enter`. Otherwise provide a `slug-cased` list of components that you want to render.

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

While using the wizard to generate your pages is very easy and descriptive of what's happening it requires quite a lot of interaction. If you do not want to go through this every time you can use the shorthand to create the pages.

Open up the terminal in the root of your project and run the following command:

```
sg page my-page
```

> **Note:** This will generate a page file for you, but leave out the step to render in blocks.

### Do not use the default index template
The index overview template is always rendered in the development mode, if for any reason you would not want this in the distrubution build you can simply create a page called `index`.

### Using JSON for data files
Using JSON as the source for your data files is not recommended but if for any reason you would want to do this you can. 

Add a `data.json` file with the following structure:

```json
{
	"title": "Hi I'm a block! 💪",
	"content": "I'm the body copy for the block."
}

```

> If you are planning on using JSON for all data files, it is recommended to remove the template file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/block/` and add a JSON variant: `{name_sc}.json`.

### Using JavaScript for data files
If you want dynamic data, add loops or something from the `process.env` you can use JavaScript as the source of your data. 

There are two ways of defining the data in JavaScript.

#### Object notation
This is a static object and will only be initialised once.

```javascript
module.exports = {
  title: 'Hi I\'m a block! 💪',
  content: 'I\'m the body copy for the block.',
};
```

#### Function notation
This method is executed on run time so you could technically use this to renew data runtime.

```javascript
module.exports = () => ({
  title: 'Hi I\'m a block! 💪',
  content: 'I\'m the body copy for the block.',
});
```

> If you are planning on using JavaScript for all data files, it is recommended to remove the template file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/block/` and add a JavaScript variant: `{name_sc}.js`

### Using JSON for page files
Using JSON as the source for your pages is not recommended but if for any reason you would want to do this you can. 

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

> If you are planning on using JSON for all pages, it is recommended to remove the template file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/page/` and add a JSON variant: `{name_sc}.json`

### Using JavaScript for page files
If you want dynamic data, add loops or something from the `process.env` you can use JavaScript as the source of your data.  Just add a `my-page.js` file in the data `src/data/` folder.

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

> If you are planning on using JavaScript for all pages, it is recommended to remove the template file `{name_sc}.yaml` from the page directory: `build-tools/generator-templates/page/` and add a JavaScript variant: `{name_sc}.js`

### Use custom variables in your data
Using variables in your data can be really usefull if you have to modify certain parts multiple times. Imagine a situation where your all data files contain absolute paths to images and you would have to change this for any reason.

**Starting point:** `http://www.some-domain.com/some/path/to/image.jpg`

**Expected result:** `http://www.some-other-domain.com/some/path/to/image.jpg` 

You could do this by running find and replace all the files, but apply a find and replace on everything is always risky. Another way of doing this would be defining commonly used variables in the `src/data/_variables.yaml` file. These variables will be replaced in the data before the component is rendered.

**Example _variables.yaml file**

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
The HTML templates of your project can be found in the `build-tools/templates` folder. This folder contains three files that are used for the different layouts. 

| File | Description |
|---	|---	|
| `build-html-template.hbs` |  This template is used with all bundled assets. |
| `build-html-template-standalone` | This template is used with page specific assets. |
| `devserver-index.html` | This template is used to run the development server |``

### Excluding page files.
If for any reason you would like to keep the page files but have them excluded from the Muban project you can do this by prefixing them with an underscore.

Example: `_my-page.yaml`

## TypeScript

### Ensure all components have been adopted
When the application is initialised it runs through a [lifecycle](./05-application.md#Application-lifecycle). This basically means that all your components will be initialised from the deepest child up. This could mean that your child component is initialised before the parent component. This could (in some cases) cause problems if you rely on parent components. 

If you want to ensure that your component is fully adopted by the application you can add the `adopted` method to the components TypeScript file and it will be called once the application is fully mounted.

```typescript
import AbstractComponent from "../AbstractComponent";

export default class MySmartComponent extends AbstractComponent {
  static displayName:string = 'my-smart-component';

  constructor(el:HTMLElement) {
    super(el);

    // I'm ready but might not be adopted by the application! ☹️
  }
  
  public adopted():void {
  	// I'm finally adopted by the application! 🎉
  }
  

  public dispose() {
    super.dispose();
  }
}
```

### Select child element/elements
Selecting elements is usually done with the querySelector or the querySelectorAll methods, when using the querySelector the result will be typed as a Node and if you use the querySelectorAll it will be typed as a NodeList. In a lot of situations this is not the desired output since you will most likely want to loop over the Nodes in a forEach loop or use HTMLElement specific properties or eventListeners.

This would mean casting the result or modifying the NodeList every time you use these selectors. To avoid typing a lot of the same code all AbstractComponents have two public methods available for selecting elements.

```typescript
const element = this.getElement('.some-selector');
const elements = this.getElements('.some-selector');
```

By default the selector is based on the components root element, if you would like to use a different element you can provide a second parameter that should be used as a containing element.

```typescript
const element = this.getElements('.some-selector', document.body);
const elements = this.getElements('.some-selector', document.body);
```

The methods both return an array of `HTMLElements`, if you want to modify the return type you can still provide a generic to overwrite the default.

```typescript
const element = this.getElements<HTMLVideoElement>('.some-selector');
const elements = this.getElements<HTMLVideoElement>('.some-selector');
```

### Adding event listeners
Attaching an event handler to a specific element is a very common thing in JavaScript. In Muban this works the same as it would on any other plain JavaScript setup:

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-component';

  private button:HTMLButtonElement;

  constructor(el: HTMLElement) {
    super(el);

    // 1. Select the button in the DOM 
    this.button = this.getElement<HTMLButtonElement>('.my-button');
    // 2. Attach the event listener.
    this.button.addEventListener('click', this.onButtonClick);
  }
  
  private onButtonClick = () => {
    // 3. Handler for the event. 
  }

  public dispose() {
    // 4. Remove the listener once the component is disposed.
    this.button.removeEventListener('click', this.onButtonClick); 
    super.dispose();
  }
}
```

This covers basically all DOM interactions, but sometimes you would want to dispatch custom events from your component. For example if your carousel component opens the next slide and you want to notify a parent component about this. 

The easiest way to do this is to use the [seng-event](https://www.npmjs.com/package/seng-event) module. Please read the extensive documentation to learn more about this!

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
    const colors = this.element.dataset.colors.split(',');
  }

  public dispose() {
    super.dispose();
  }
}
```

### Get data from embedded json

> ⚙️ TODO.

### Get data through a http-request

> ⚙️ TODO.

### Update an entire section through a http-request

> ⚙️ TODO.

#### The API returns HTML

> ⚙️ TODO.

#### The API returns JSON

> ⚙️ TODO.

### Sort or filter items already in the DOM

> ⚙️ TODO.

### Load more items to the page

> ⚙️ TODO.

#### Clone and update element

> ⚙️ TODO.

#### Use a handlebars template

> ⚙️ TODO.

#### use a knockout template

> ⚙️ TODO.

## Handlebars

### Render data in your component

> ⚙️ TODO.

### Render data as HTML in your component

> ⚙️ TODO.

### Render a component

> ⚙️ TODO.

### Reference static assets

> ⚙️ TODO.

### Dynamically render components

> ⚙️ TODO.

### Dynamically render out components that are not in the block folder

> ⚙️ TODO.

### Create a custom helper

> ⚙️ TODO.

## Knockout

### Create a global state

> ⚙️ TODO.

### Apply bindings to the entire component

> ⚙️ TODO.

## Webstorm

### Setup a Prettier shortcut

> ⚙️ TODO.

## Seng-generator

### Create a custom template

> ⚙️ TODO.
