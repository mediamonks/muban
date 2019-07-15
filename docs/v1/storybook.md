# Storybook

Storybook is a web-app that lets you preview and interact with the components in your project. You
can create presets that render your component with custom HTML, and pass different properties by
providing a yaml/json object.

Within the viewer you can list all components, list all variations of a single component, or view a
single preset isolated.

Besides the component, it will show:

* the name
* the file path
* the description
* the preset html
* the preset data
* the component .hbs source
* the component .ts source
* the component .scss source
* the rendered html

The viewer also includes a media query viewer that read the media queries from your projects, just
like it's done in Chrome DevTools.

```
yarn storybook          # start the storybook app on port 9002
yarn storybook:build    # create a storybook build in /dist/storybook
yarn storybook:preview  # preview the built storybook on port 9003
```

## Example

Just create a `preset.js` file in your component folder and add a story like this:

```
import { storiesOf } from 'storybook/utils/utils';

storiesOf('Paragraph', require('./paragraph'))
  .add(
    'default',
    'A Paragraph block with a "read more" section you can show by clicking a button.',
    `<hbs>
      <div>
        {{> paragraph @root }}
      </div>
    </hbs>`,
    {
      title: 'What is Lorem Ipsum?',
      content: 'industry. Lorem Ipsum has been the industry's standard ...',
      contentMore: 'Contrary to popular belief, Lorem Ipsum is not simply random text...',
    },
  )
```

You can add multiple presets of the same component by chaining the `add()`:

```
storiesOf('Paragraph', require('./paragraph'))
  .add('preset 1', ...)
  .add('preset 2', ...)
  .add('preset 3', ...);
```

The `<hbs>` section will be parsed as a handlebars template by a custom webpack loader, so within
there you can just use any html or hbs syntax to make up your preset.

Using the `@root` in the partial will pass the complete context to that component. The context is
the object you pass as the last argument.

You can also store the data objects in a yaml file in the same folder and just require it in place:

```
storiesOf('Paragraph', require('./paragraph'))
  .add(
    'default',
    'A Paragraph block with a "read more" section you can show by clicking a button.',
    `<hbs>
      {{> paragraph @root }}
    </hbs>`,
    require('./data'),
  )
```

## Customize

The storybook should be as much separated from the main project as possible, but sometimes it's
needed to include certain assets from the main project in the storybook.

One of theme are the main styles, these are included by default in the story frame.

Other things could be svg sprites that should be available in the HTML. When it's plain HTML it can
be added in the `/src/storybook/static/story.html` file. When it's a hbs partial, it can be added in
`/src/storybook/story-list.hbs` and `/src/storybook/story-single.hbs`.

## Configuration

The Storybook configuration files live in `build-tools/config/storybook`.

The `config.js` file is included in the storybook build and is used configure the storybook.

The only configuration available at the moment is loading the stories. When the `loadStories`
function is called, you have to require all the preset files, which can be done by using a webpack
context:

```
import { configure } from 'storybook/utils/utils';

const context = require.context('app/component/', true, /preset\.js$/);

function loadStories() {
  context.keys().forEach(context);
}

configure(loadStories);
```

the **webpack configuration** for development and a distribution build is located in
`build-tools/config/storybook` It extends the base configuration from the project so it can reuse
most of its (loader) configuration.
