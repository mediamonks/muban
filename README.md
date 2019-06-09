# Muban boilerplate

Muban is a backend-agnostic framework and development setup to enhance server-rendered HTML with
[TypeScript](https://www.typescriptlang.org/) or [Babel](https://babeljs.io/) components and
[SCSS](http://sass-lang.com/) stylesheets.

During development, [webpack](https://webpack.js.org/) will supply fast compilation and hot
reloading, while using [Handlebars](http://handlebarsjs.com/) templates to render everything.

The dist build will generates preview html pages and a js and css bundle that backend developers can
use to integrate the pages in their server side templates or CMS of choice.

## Why Muban?

Please read this [introduction](./docs/introduction.md) about why and how we created Muban.

## Getting started

Please read this [getting started guide](./docs/getting-started.md) if you're new to Muban.

## Distribution implementation guide

If you're a developer that needs to implement the dist build into an existing backend/cms, please
read the [implementation guide](./docs/dist-implementation-guide.md) that is also distributed with
the build output.

## Setup

After cloning this repos and removing the `.git` folder, run:

```sh
yarn
```

This boilerplate comes with some sample pages, blocks and components.
If you don't need them in your project, you can remove them all with a simple command:

```sh
yarn clean:boilerplate
```

You can also remove the storybook config, source and preset files if you don't need it:

```sh
yarn clean:storybook
```

### Config

The most basic settings can be found and changed in `build-tools/config/config.js`.

### Development

```sh
yarn dev
```

Open your browser at [http://localhost:9000](http://localhost:9000).

**Using own server for html**

When using server-generated html instead of the handlebars templates, you can use the following
command to just compile the `js` and `css` bundles (incl other assets).

```sh
yarn dev:code
```

The files will be outputted/updated in the same folder as the normal build is done, but uses the
`development` environment, enables sourcemaps, and disables minification and other stuff.

## Creating pages, blocks and components

With seng-generator you're able to create pages, blocks and components with the CLI. The
seng-generator needs to be installed globally.

```sh
yarn global add seng-generator
```

The easiest way to use it is by using the wizard

```sh
sg wizard
```

Starts a wizard to create a component, page or block.

For more information about the generating components, check the [docs](./docs/components.md).

## Code Quality tools

Muban uses multiple code quality tools like linters and formatters. Please read the
[extended documentation](docs/code-quality.md) for more information.

## Build

```sh
yarn build
```

The code is outputted in `/dist`.

To preview the build in the browser, run:

```sh
yarn preview
```

To analyze the created bundle, run:

```sh
yarn analyze
```

Using the build script, you can also run some parts of the process separately:

```sh
yarn build code      # or yarn compile:code
yarn build partials  # or yarn compile:partials
yarn build html      # or yarn compile:html
```

### Diff

If you want to generate a report on what has changed in the handlebars templates,
you can generate a diff report between two git commits (default to `master` and `HEAD`).

```sh
yarn build:diff
```

It will generate a file in `dist/diff/templates.html` with a proper formatted diff.

## Files and folders

* `src/app/dev.js` Main dev file, you should never have to change anything here

* `src/app/dist.js` Webpack entry file for production build, contains code that runs immediately.
* `src/app/partials.js` Webpack entry file for generating output html files.
* `src/app/bundle.js` Webpack entry that will include all js and css files referenced from all
  template files.
* `src/app/polyfills.js` List of polyfills to include in the bundles.
* `src/app/component/layout/index/index.hbs` Template file to list all the pages.
* `src/app/component/layout/app/app.hbs` Template file that is used for all pages, contains basic
  page layout (e.g. header, footer and wrapper).
* `src/app/component/` Contains all components, each folder is made up of:
  * `component-name.hbs` The template file, can import a stylesheet using the html `link` tag, and a
    script using the html `script` tag.
  * `component-name.scss` The stylesheet, best to use a `component` prefix for your outer selector.
  * `ComponentName.ts/js` An optional TS/JS file for the component, receives the DOM element, and
    should have a static `block` property that corresponds with the `data-component` DOM attribute.
* `src/app/component/blocks/` Contains all _block_ components. They are dynamically rendered based
  on the blocks entry in the json data file.
* `src/app/style` Folder containing global styles. All components will include their own stylesheet.
* `src/app/style/main.scss` Main stylesheet file, only for setting up global styles.
* `src/data` The yaml files for all preview pages. Each yaml file corresponds with a page. Using a
  `.` in the filename will allow to group alternative variations for a single page. E.g. `home.yaml`
  is the main page, and `home.alt.yaml` is an alternative version that can be visited via the
  overview page.
* `.modernizrrc` config file for Modernizrrc used by `modernizr-loader`, config rules can be found
  [here](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json).
* `build-tools/generator-template/*` Template files for seng-generator, for creating pages, blocks
  and components.

## Storybook

Storybook is a web-app that lets you preview and interact with the components in your project. You
can create presets that render your component with custom HTML, and pass different properties by
providing a json object.

Please read the [extended documentation](docs/storybook.md) for more information.
