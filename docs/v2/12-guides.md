# Guides

Here you can find a collection of guides to help you perform certain tasks you might want to do in
your project!

## Muban

### Create a component

> ⚙️ TODO.

### Create a smart-component

> ⚙️ TODO.

### Create a block

> ⚙️ TODO.

### Create a page

> ⚙️ TODO.

### Do not use the default index template

> ⚙️ TODO.

### Using JSON for data files

> ⚙️ TODO.

### Using JavaScript for data files

> ⚙️ TODO.

### Using JSON for page files

> ⚙️ TODO.

### Use custom variables in your data

> ⚙️ TODO.

### Add scripts/meta data to the head of your page

> ⚙️ TODO.

## TypeScript

### Ensure all components have been initalised

> ⚙️ TODO.

### Select child element/elements

> ⚙️ TODO.

### Adding event listeners to components

> ⚙️ TODO.

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
