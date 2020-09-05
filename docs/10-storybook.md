# Storybook

By default, muban includes [@muban/storybook](https://www.npmjs.com/package/@muban/storybook) and
[@muban/storybook-addon-source](https://www.npmjs.com/package/@muban/storybook-addon-source) to bring
most of the existing [Storybook](https://storybook.js.org/) experience to Muban.

It allows you to write your stories using the new Args format, and you can customize the rendered template
using inline an hbs template, and optionally manipulate the passed data that is passed to your template.

The **source** addon will allow you to preview the source of your component files (template, styles, script and data)
in the Storybook panels for reference.

## Running

You can run the following commands

```sh
yarn storybook          # start the storybook app on port 6006
yarn build-storybook    # create a storybook build in /dist/storybook
```

Any of the normal storybook cli params apply here.

## Setup

Some things to keep in mind when working with storybook:

* Most of the webpack config is shared between Muban and Storybook, so all components are compiled
  using the same setup. This also means that if you make changes to your webpack config, you need to
  think if it could affect the storybook setup as well. Check out `.storybook/main.js` for this sharing.

* If you have any global styles or logic that you need for your stories, add them to `.storybook/preview.js`
  so they are loaded for each story. Have a look at https://storybook.js.org/docs/react/get-started/setup#render-component-styles
  and https://storybook.js.org/docs/react/configure/overview#configure-story-rendering for more information.

## Example

Just create a `MyComponent.stories.ts` file in your component folder.

You can have a look at the existing stories for the default preview components in this repo.

```typescript
import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

// Most things are just normal storybook configuration
export default {
  title: 'My Component',
  component: require('./my-component'), // require your hbs file here, omitting the .hbs extension
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
  },
  parameters: {
    source: {
      data: require('./data/data.yaml'), // this is for your muban source addon
    },
    docs: {
      description: {
        component: 'Some additional docs description',
      },
    },
  },
} as Meta;


export const Default = () => ({
  // this template is optional, if you omit it, this is how it will be used by default
  template: `<hbs>
      {{> my-component @root }}
    </hbs>`,
});
Default.args = require('./data/data.yaml');


// reuse the above template and data, just configuring different args
export const Simple = Default.bind({});
Simple.args = require('./data/data-simple');


// do more custom things
export const Custom = (args) => ({
  // use any hbs syntax to create your custom story template
  template: `<hbs>
      <div style="width: 300px; margin: 0 auto;">
        {{> my-component @root }}
      </div>
    </hbs>`,
  // optionally return custom data, you can use the passed args here to modify/etc.
  data: {
    ...args,
    foo: 'bar'
  }
});
```

