# Guides
Here you can find a collection of guides to help you perform certain tasks you might want to do in your project!

## Muban
### Create a component.
### Create a smart-component.
### Create a component block.
### Create a page.
### Do not use the default index template.
### Using JSON for data files.
### Using JavaScript for data files.
### Using JSON for page files
### Use custom variables in your data
### Add scripts/meta data to the head of your page.

## TypeScript
### Ensure all components have been initalised.
### Select child element/elements.
### Adding event listeners to components.
### Get data from data-attributes.
Providing data to your TypeScript file through data attributes is very easy and can be done by adding it to the root element in your `.hbs` file.

```handlebars
<div class="my-component" data-component="my-component" data-colors="#CC9933,#22AA88,#FF8822">
  Hi, I'm a component! 👋
</div>
```
After that you can access it by using the `dataset` object on the element.

```typescript
import AbstractComponent from "../AbstractComponent";

export default class MySmartComponent extends AbstractComponent {
  static displayName:string = 'my-component';

  constructor(el:HTMLElement) {
    super(el);
    
    // Get the data from the colors data attribute.
    const colors = this.element.dataset.colors.split(',');
  }

  public dispose() {
    super.dispose();
  }
}

```
### Get data from embedded json.
### Get data from through a http-request.
### Update an entire section through a http-request.
#### The API returns HTML.
#### The API returns Json.
### Sort or filter items already in the DOM.
### Load more items to the page.
#### Clone and update element.
#### Use a handlebars template.
#### use a knockout template.


## Handlebars
### Render data in your component.
### Render data as HTML in your component.
### Render a component.
### Reference static assets.
### Dynamically render components.
### Dynamically render out components that are not in the general folder.
### Create a custom helper.

## Knockout
### Create a global state.
### Apply bindings to the entire component.

## Webstorm
### Setup a Prettier shortcut.

## Seng-generator
### Create a custom template.