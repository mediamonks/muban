# Real world examples

_Note: sometimes the examples below first show the 'manual' way to execute certain tasks, and after
that the utils that are available in Muban. This is to understand what's done under the hood._

## 1. Backend returns HTML for an updated section

Sometimes, a section rendered by the backend has multiple options, and when switching options you
want new data for that section. If the backend cannot return JSON, they might return a HTML snippet
for that section. In that case we should:

1. fetch the new section
2. clean up the old HTML element (remove attached classes, for memory leaks)
3. replace the HTML on the page
4. initialize new component instances for that section and nested components

```
// code is located a component, where this.element points to HTML element for that section

import { cleanElement, initComponents } from 'muban-core';

fetch(`/api/section/${id}`)
  .then(response => response.text())
  .then(body => {
    const currentElement = this.element;

    // 2. dispose all created component instances
    cleanElement(currentElement);

    // insert the new HTML into a temp container to construct the DOM
    const temp = document.createElement('div');
    temp.innerHTML = body;
    const newElement = temp.firstChild;

    // 3. replace the HTML on the page
    currentElement.parentNode.replaceChild(newElement, currentElement);

    // 4. initialize new components for the new element
    initComponents(<HTMLElement>newElement);
  });
```

Luckily there is a utility function for this:

```
// code is located a component, where this.element points to HTML element for that section

import { updateElement } from 'muban-core';

fetch(`/api/section/${id}`)
  .then(response => response.text())
  .then(body => {
    updateElement(this.element, body);
  });
```

While this seams like a good option, keep in mind that the whole section will be reset into its
default state, which could (depending on the contents of the section) be a bad experience,
especially when dealing with animation/transitions.

## 2. Backend returns JSON for an updated section

This one might be a bit more work compared to just replacing HTML, but gives you way more control
over what happens on the page. The big benefit is that the state doesn't reset, allowing you to make
nice transitions while the new data is updated on the page.

```
fetch(`/api/section/${id}`)
  .then(response => response.json())
  .then(json => {
    // this part really depends on what the data will be

    // if it's just text, you could:
    this.element.querySelector('.js-content').innerHTML = json.content;

    // or pass new data to a child component
    this.childComponent.setNewData(json.content);
  });
```

Or when using knockout to update your HTML:

```
import { initTextBinding } from '../../../muban/knockoutUtils';
import ko from 'knockout';

// when using knockout to bind your data, first init the observable with the correct intial data
this.content = ko.observable(this.element.querySelector('.content').innerHTML);

// then apply the observable to the HTML element
ko.applyBindingsToNode(this.element.querySelector('.content'), {
  'html': this.content,
});

// or a better way to do the above two steps:
this.content = initTextBinding(<HTMLElement>this.element.querySelector('.content'), true);

fetch(`/api/section/${id}`)
  .then(response => response.json())
  .then(json => {
    this.content(json.content); // content is an knockout observable
  });
```

## 3. Sorting or filtering lists

Sometimes the server renders a list of items on the page, but you have to sort or filter them
client-side, based on specific data in those items. Since we already have all the items and data on
the page, it's not that difficult.

We can just query all the items, and retrieve the information we need to execute our logic, and add
them back to the page.

```
constructor() {
  this.initItems();
  this.updateItems();
}

private initItems() {
  // get all DOM nodes
  const items = Array.from(this.element.querySelectorAll('.item'));

  // convert to list of useful data to filter/sort on
  this.itemData = items.map(item => ({
    element: item,
    title: item.querySelector('.title').textContent,
    tags: Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()),
  }));
}

private updateItems() {
  // empty the container
  const container = this.element.querySelector('.items');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // filter on any tags that contains an 's'
  let newItems = this.filterOnTags(this.itemData, 's');
  // sort descending
  newItems = this.sortOnTitle(newItems, false);

  // append new items to the container
  const fragment = document.createDocumentFragment();
  newItems.forEach(item => fragment.appendChild(item.element));
  container.appendChild(fragment);
}


// sort items base on the title attribute
private sortOnTitle(itemData, ascending:boolean = false) {
  return [...itemData].sort((a, b) => a.title.localeCompare(b.title) * (ascending ? 1 : -1));
}

// filter items based on the tags array
private filterOnTags(itemData, filter:string) {
  return itemData.filter(item => item.tags.some(tag => tag.includes(filter.toLowerCase())));
}
```

## 4. Load more items to the page

Sometimes the server renders the first page of items, but they want to have the second page to be
loaded and displayed from the client. If the server returns HTML, we can just re-use some of the
logic in our HTML example above.

However, if the server returns JSON, we sort of want to re-use the markup of the existing items on
the page. We _could_ build up the HTML ourselves from JavaScript, but that would mean the HTML lives
in two places, on the server and in JavaScript, and it will be hard to keep them in sync.

There are two options we can choose from.

#### 4.1. Clone and update element

For smaller items, we could just clone the first element of the list, and create a function that
updates all the data in that item, so we can append it to the DOM.

```
// get the template node to clone later
const template = <HTMLELement>this.element.querySelector('.item');
// create a documentFragment for better performance when adding items
const fragment = document.createDocumentFragment();

// clone template, update data, and add to fragment
newItems.forEach(item => {
  const clone = template.cloneNode(true);
  clone.querySelector('.title').textContent = item.title;
  clone.querySelector('.description').textContent = item.description;
  fragment.appendChild(clone);
});

// add fragment to the list
this.element.querySelector('.list').appendChild(fragment);
```

#### 4.2. Using the handlebars template

If we already have a `.hbs` template, we can use this in JavaScript as well. If we import the `.hbs`
file, it will be pre-compiled by webpack to a JS function. This function accepts 1 parameter, the
data, and returns the HTML string.

```js
// import the hbs template
import { initComponents } from 'muban-core';
import buttonTemplate from '../../general/button/button.hbs?include';

// render the template by passing data
const content = buttonTemplate({ text: 'button text' });

// append the HTML to the DOM (container already exists in the DOM somewhere)
container.innerHTML = content;

// make the component interactive
initComponents(container);
```

The example above is quite simple, but there are others that require some more work. For that there
are some dataUtils in muban-core you can use.

**Replacing a single item**

This is similar to the example above

```js
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import buttonTemplate from '../../general/button/button.hbs?include';

renderItem(container, buttonTemplate, { text: 'button text' });
```

It will:
* clean the container (both html and dispose all interactive classes)
* append the rendered template
* init the component

**Appending a single item**

```js
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import buttonTemplate from '../../general/button/button.hbs?include';

renderItem(container, buttonTemplate, { text: 'button text' }, true);
```

It will:
* keep the container as is
* append the rendered template
* _only_ init the new component

**Replacing a list of items**

```js
import { renderItems } from 'muban-core/lib/utils/dataUtils';
import buttonTemplate from '../../general/button/button.hbs?include';

renderItems(container, buttonTemplate, [ { text: 'button text' }, { text: '2nd btn' } ]);
```

It will:
* clean the container (both html and dispose all interactive classes)
* append the rendered templates using a documentFragment
* init all components in the container


**Adding a list of items**

```js
import { renderItems } from 'muban-core/lib/utils/dataUtils';
import buttonTemplate from '../../general/button/button.hbs?include';

renderItems(container, buttonTemplate, [ { text: 'button text' }, { text: '2nd btn' } ], true);
```

It will:
* keep the container as is
* append the rendered templates using a documentFragment
* _only_ init the new components

#### 4.3. Use Knockout with a template

This option works best when only used on the client, but when having server-rendered items in the
DOM you would first need to convert them to data to properly render them.

Handlebars template:

```
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

Script:

```
// 1. transform old items to data
// get all DOM nodes
const items = Array.from(this.element.querySelectorAll('.item'));

// convert to list of useful data to filter/sort on
const oldData = items.map(item => ({
  title: item.querySelector('.title').textContent,
  description: item.querySelector('.description').innerHTML,
  tags: Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent),
}));

// 2. create observable and set old data
const itemData = ko.observableArray(oldData);

// 3. apply bindings to list, this will re-render the items
ko.applyBindingsToNode(this.element.querySelector('.items'), {
  'template' : { 'name': 'item-template', 'foreach': itemData },
});

// 4. add new data to the observable
// or do any other funky stuff to the array, like sorting/filtering
itemData.push(...newData);
```

The above can be simplified by using a util. The 3rd parameter can also be `oldData` extract above
instead of the passed config for more control.

```
import { initListBinding } from '../../../muban/knockoutUtils';

// 1+2+3. extract data, create observable and apply bindings
const itemData = initListBinding(
  <HTMLElement>this.element.querySelector('.items'),
  'item-template',
  {
    query: '.item',
    data: {
      title: '.title',
      description: { query: '.description', htm: true },
      tags: { query: '.tag', list: true },
    }
  },
);

// 4. add new data to the observable
// or do any other funky stuff to the array, like sorting/filtering
itemData.push(...newData);
```
