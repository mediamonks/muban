# Muban boilerplate

Boilerplate to develop server-side-rendered templates with
[TypeScript](https://www.typescriptlang.org/)/[Babel](https://babeljs.io/) components and
[SCSS](http://sass-lang.com/) stylesheets, using [Handlebars](http://handlebarsjs.com/)
template system.

During development, the webpack-dev-server will supply fast compilation and hot reloading.

The dist build will generates preview html pages and a js and css bundle that third party
developers can use to integrate the pages in their server side templates or CMS of choice.

## Setup

After cloning this repos and removing the `.git` folder, run:
```
yarn
```
or
```
npm i
```

### Development

```
npm run dev
```
Open your browser at [http://localhost:9000](http://localhost:9000).

## Creating views, blocks and components
With seng-generator you're able to create views, blocks and components with the CLI.

```
sg wizard
```

Starts a wizard to create a component, view or block.

```
sg block foo
```

Generates a block with the name of foo. This can be done for views and components too.

### Build

```
npm run build
```

View your output at `/build`.

_TODO: run local http-server using `npm run serve` to view the dist build._

## Files and folders

* `src/app/index.js` Main dev file, you should never have to change anything here

* `src/app/code.js` Webpack entry file for production code build.
* `src/app/partials.js` Webpack entry file for production partials build.
* `src/app/index.hbs` Template file to list all the pages, used for dev and dist.
* `src/app/app.hbs` Template file that is used for all pages.
* `src/app/component/` Contains all components, each folder is made up of:
  * `component-name.hbs` The template file, can import a stylesheet using the html link tag.
  * `component-name.scss` The stylesheet, best to use a `component` prefix for your outer selector.
  * `ComponentName.ts/js` An optional TS/JS file for the component, receives the DOM element,
    and should have a static `block` property that corresponds with the `data-component`
    DOM attribute.
* `src/app/component/components.ts` The index file that loads all components and initiates them
  based on the found DOM elements.
* `src/app/component/blocks/` Contains all _block_ components. They are dynamically rendered based
  on the blocks entry in the json data file.
* `src/app/style` Folder containing global styles. All components will include their own stylesheet.
* `src/app/style/main.scss` Main stylesheet file, only for setting up global styles.
* `src/data` The json files for all preview pages. Each json file corresponds with a page.
  Using a `.` in the filename will allow to group alternative variations for a single page.
  E.g. `home.json` is the main page, and `home.alt.json` is an alternative version that can be
  visited via the overview page.
* `.modernizrrc` config file for Modernizrrc used by `modernizr-loader`, config rules can
  be found [here](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json).
