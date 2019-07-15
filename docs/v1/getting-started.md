# Getting started


## Setting up the project

Start by cloning or downloading [this repos](https://github.com/mediamonks/muban), and copy the
contents (without the `.git` folder) in your new project folder.

You might want to setup/enable tools for linting and formatting in your editor. Make sure you are
running the same node version as specified in the `.nvmrc` file.

Run `yarn` (or `npm i`) in the root folder to get all the node modules installed.

## Running and developing

After that, you should be able to run `yarn dev` to get the webpack dev server started. Open your
browser at [http://localhost:9000](http://localhost:9000) to preview an empty website.

The 'index' will list all the pages you have created, so you can easily navigate to them. By default
it will show a home and about page. On those pages, it will show some default components.

Any change that you make from now on will automatically update the page, without reloading the
browser.

## Creating a new component

While you can create all the component files yourself, it's easier to generate them via the CLI.

For this you can install seng-generator by running `yarn global add seng-generator` (or `npm i -g
seng-generator`).

You can start the generator wizard by running `sg wizard` and choosing `block`. Give it the name
'foo' and select the default location. Now navigate your project browser to
`src/app/component/block/foo` and notice all the files that are created.

A block is a special type of component that can be added to a page directly. Normal components can
only be included by blocks or other components.

To have this component show up on a page, we can update the `src/data/home.yaml`. Add your new
component in the list, and see how your page updates in the browser:

```yaml
title: "Home"
blocks:
  - name: "paragraph"
    data: "import!../app/component/block/paragraph/data.yaml"

  - name: "two-col"
    data: "import!../app/component/block/two-col/data.yaml"

  - name: "foo"
    data: "import!../app/component/block/foo/data.yaml"
```

## Adding a new page

It's more fun if your component is displayed alone on a page, so let's create a new one by running
`sg wizard` and select `page`. Give it the name `bar` and choose the default location. Let's also
add our just created block by choosing `yes` and specify `foo` when asked for a list of blocks.

Now inspect your new page at `src/data/bar.yaml`, it looks similar to the `home.yaml` before.

## Update your component

Now let's update our component with some content. We start out with this:

```html
<link rel="stylesheet" href="./foo.scss">
<script src="./Foo.ts"></script>

<div data-component="foo">
  <h1>foo</h1>
</div>
```

Here you can see it imports a stylesheet and a script file. All components have a `data-component`
attribute to identify itself. It's used for styling (your component styles are wrapped in a
`[data-component="foo"] { }` selector) and for creating a new component class that matches with
a static `displayName`:

```ts
export default class Foo extends AbstractBlock {
  static displayName:string = 'foo';
}
```

#### data

The last piece of the puzzle is the data we want to display in the HTML. We don't want to hardcoded
this, since it will later be filled by the backend, and it would also be nice to show different
variations of our component by just passing different data.

Open the `data.yaml` in your component folder, it contains an empty object by default, so just
add some fields:

```yaml
title: Hello world
description: |
  <strong>Lorum</strong> ipsum dolor amet...
tags:
  - muban
  - handlebars
  - webpack
```

#### template

Now we have the data, let's update our HTML to display this information by editing `foo.hbs`:

```html
<link rel="stylesheet" href="./foo.scss">
<script src="./Foo.ts"></script>

<div data-component="foo">
  <h1>{{title}}</h1>
  <p>{{{description}}}</p>
  <div>
    {{#each tags}}
      {{> general/button text=this }}
    {{/each}}
  </div>
</div>
```

Above you see four things:

1. we add the `{{title}}` variable
2. we add the `{{{description}}}` variable as raw html
3. we loop over our tags array using the handlebars `each` helper
4. we include the button component partial, and pass the tag as the text property

If you still have your browser open, you should see your updated component on the page.

#### code

As mentioned earlier, if a component template includes a script tag, it will create a new instance
of the component class, and passes the DOM element in the constructor.

Let's update our component class by editing `Foo.ts` in the component folder:

```typescript
import AbstractBlock from "../AbstractBlock";

export default class Foo extends AbstractBlock {
  static displayName:string = 'foo';

  constructor(el:HTMLElement) {
    super(el);

    this.getElements('[data-component="button"]').forEach(btn => {
      btn.addEventListener('click', this.handleButtonClick);
    });
  }

  handleButtonClick = (event) => {
    console.log(event.currentTarget);
  }

  public dispose() {
    this.getElements('[data-component="button"]').forEach(btn => {
      btn.removeEventListener('click', this.handleButtonClick);
    });

    super.dispose();
  }
}
```

The code above does a few things:

1. It uses the `getElements` helper function to get child elements, and loops over them
2. for each button, it adds a click event listener that logs the button element
3. in the dispose, it removes the listeners again

The dispose function is only needed during development when hot reloading (or when manually adding
and removing components into the DOM), since normally all listeners will be removed when the page
is reloaded.

You could also make everything look a bit nicer by updating `foo.scss`, but that's all up to you!

## Storybook

Previewing components on the page is one thing, but sometimes it's more useful to see them in
isolation. For this we have storybook. You can close your dev server, and start `yarn storybook`.

When opening `http://localhost:9002/` in your browser, you should immediately see your new 'foo'
component. If you click the `foo - default` link, it will just show that component preset, and all
information moves to the bottom.

The component is loaded in an iframe to be completely isolated, and you can click the 'responsive'
icon in the top-left to play around with breakpoints (this works in every browser).

At the bottom you see all the available information about the component, it's name, location and
description (that you must enter yourself). It also shows the preset source, the passed data, the
rendered HTML, and the source code of the template, style and script files. This is not only useful
for you as the frontend develop, but also for a backend developer that needs to implement your
templates.

### presets

Now let's add a second preset so to see how this works. Open the `preset.js` in your foo component
folder, and add a second preset:

```typescript
import { storiesOf } from 'storybook/utils/utils';

storiesOf('foo', require('./foo.hbs'))
  .add(
    'default',
    'No description yet...',
    `<hbs>
			{{> block/foo @root}}
		</hbs>`,
    require('./data'),
  )
  .add(
    'no tags',
    'A version without any tag buttons',
    `<hbs>
			{{> block/foo @root}}
		</hbs>`,
    require('./data-no-tags'),
  );
```

And add an additional preset file called `data-no-tags.yaml`:

```yaml
title: Hello world
description: |
  <strong>Lorum</strong> ipsum dolor amet...
```

You can also directly add the data in the preset, but keeping it in yaml files allows you to
include it in any page yaml you want, giving you more flexibility.

Now, if you click the file path in the info panel in your browser (`component/block/foo/foo.hbs`),
it will load the page to show all variants o the same component, and you'll see the component with
or without the tag buttons.

This will help you out to test styling whe certain elements are different or missing. It could also
help you spot script errors if you expect certain elements to exist, but will give an error if you
add an event listener to non-existing elements.

## Building

Now that your site is 'done', it's time to make a distribution build by running `yarn build`. After
completion the `dist/site` folder will contain your preview site. By running `yarn preview` you can
start a local node server to preview those pages in the browser at `http://127.0.0.1:9001/`. This
time they are static html pages, that load a bundled js and css file, and is very similar to the
actual website where your frontend will be integrated. It's always a good practice to build and
preview your site before sending it over to anyone else, so you know for sure everything works
properly.

Additionally you can run `yarn build:diff` to generate a diff report for all changed handlebars
templates. Command will create a `dist/diff` folder and put a report inside. Script can compare changes
with master branch or specific commit or git tag.

## Further reading

This is just the basics of working with Muban, to dive a bit deeper, check out the following:

* The `docs/` folder that contains a lot more in-depth information about certain topics (like more
  util functions, how to work with dynamic data, how to preview your build and storybook online,
  and much much more).
* The [webpack documentation](https://webpack.js.org/) and the webpack config located in
  `build-tools/config` (where `indedx.js` is a config file with paths and other settings).
* The [Handlebars documentation](http://handlebarsjs.com/) for writing more advanced templates
