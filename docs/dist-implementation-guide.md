# Distribution implementation guide

_Note: this file is copied from docs to the dist package._

This package contains all the information that is needed for implementing the frontend in
your website. It contains assets that can be copied over as is, preview pages to view the
(static) end result, and the developer templates that can be referenced as example when
implementing the html in your template language of choice.

The package content:

* **site/** - _the preview site_
  * **asset/** - contains all assets that should be copied over and included in the page HTML
    * **font/** - custom fonts, will be loaded by the css
    * **image/** - images required for the design/markup, will be loaded by css or js
  * **\*.html** - statically rendered preview pages (with index.html as overview)
  * The other folders contain static assets that are referenced from the preview html pages, and
    should normally be served dynamically (so should not be copied over, it's just sample content).
* **template/** - the developer templates, can be used as reference
* **data/** - the developer mock data, can be used as reference
* **storybook/** - optionally, a component viewer 'site', where all components can be previewed,
  together with all the source code and documentation

#### Preview

To view the preview pages, you must upload or run a local http server, where the contents of the
`site` folder is your webroot.

## Integration

Follow the steps below to integrate the files in this package into your own website.

1. Copy over the `asset` folder over your own webroot (keeping the same folder name).

2. Use the `*.html` preview pages and the `template/*.hbs` templates to implement the HTML in your
   own website.
3. Include the `asset/common.css` and `asset/bundle.css` in the html `<head>`, and the
   `asset/common.js` and `asset/bundle.js` just before the closing `</body>` tag.
4. Copy over the `<head>` section from `site/index.html` as good as possible, so all information
   like doctype, charset, meta tags, icons, etc are present on your own website. Some tags like
   icons are optional, but the `<meta ...>` are all needed to guaranty the website is displayed
   correctly.

Read the sections below for more information about certain files or folders.

## Assets

The content in the `site/asset/` folder is the output of our webpack build. Webpack takes all
development source files, which are nicely structured per component and written using modern web
standards. It then transpiles, minifies, optimizes and bundles all the assets it encounters,
and places them in the output folder.

The JS and CSS that should be included in the HTML have a default filename, which stays the same
for each build. All other assets (that are loaded from JS and CSS) will get a unique filename with
the content-hash in the filename (see below for caching).

The JS and CSS files are split between `common` and `bundle`. The common files contain all
library/vendor code that doesn't change (often), and the bundle files contain all application
code that could change more often. If desired, they can be outputted into a single file.

By default, all those files are placed into the `asset` folder. This path is also included in the
JS and CSS files that load other assets (like fonts and images). This means that the folder should
be accessible at `https://www.example.com/asset/*`. When a different folder (structure) is desired,
we have two options:

1. We can build the files using a different (or nested) folder, or

2. The path (called the `publicPath`) can be configured at runtime. The default is set to `/`, but
   can be changed to any path or domain. _Please note that this is just a prefix, and you still
   need the `asset` folder after that._

   You can do this by setting the `webpackPublicPath` variable in a `<script>` tag on the window
   before any script file is loaded:

   ```js
    window.webpackPublicPath = '/nested/folder/';
    // results in '/nested/folder/assets/...'

    // or
    
    window.webpackPublicPath = 'https://cdn-domain.site.com/nested/folder/';
    // results in 'https://cdn-domain.site.com/nested/folder/assets/...'
   ```

## Templates

The content in the `site/templates/` folder contains the development templates written in
handlebars. Handlebars is powerful enough to create 'dynamic' html for the given mock data, but
also simple enough that all used backend/cms template languages (like twig, django, aem) have
support for the used 'template features'.

It also works nicely with this Webpack build system, and can be easily extended to implement
missing features that a 3rd party template engine might want to use.

The templates are set up in such a way that:

* All dynamic data (copy or content) that needs to be displayed on the pages, is passed from the
  mock yaml files. This means that everything else can be copied over as is.

* Iteration over a list of items, or conditionally rendering something, is already present. This
  makes the intention of how templates should be used more clear than just looking at the preview
  pages. It also makes all the possible variations (e.g. conditionally adding a css-class) more
  clear.

* Everything that is 'used' multiple times (like buttons, form items, sliders) is its own component.
  If the same structure is also implemented in the 'backend', future updates to components that
  are used a lot will be as simple as changing a single file.
  
* There is a division between **blocks** and other components. Blocks are 'special' components that
  are 'top level' on a page, are 'stand-alone' and could be dynamically chosen from a CMS.
  Normal components are just reusable parts that are referenced from blocks and other components.

* In the preview html pages, the templates are surrounded by html comments containing the template
  paths. This makes it easy to look at the preview page source, and see how it's built up.

#### Data

As mentioned above, to fill the html content with data we make mock yaml files. These contain
the blocks we want to include in a page, and the data each block should display. Each `.yaml` file
corresponds to a single page. Some pages have multiple yaml files, to show different variations,
e.g. a carousel with 1 or 5 items, a search page with or without results.

To make the integration easier, it is a good practice to keep the structure in the yaml files
similar to the modals that are used on the server to render the actual dynamic pages. The more
similar the models are, the less manual conversion has to be done.
  

#### Automatic template conversion

To make implementation easier, a tool is in the works that can convert most (if not all) handlebar
templates to another template language (e.g. twig, django, htl). In that case, there is an
additional folder with the converted template files. This means that there is less (or none at all)
manual conversion of templates needed.

## Storybook

Storybook is inspired by the [React and Vue Storybook](https://storybook.js.org/). It is a UI
development environment for your UI components. With it, you can visualize different states of your
UI components and develop them interactively.
                                                                                   
Storybook runs outside of your app. So you can develop UI components in isolation without worrying
about app specific dependencies and requirements.

Besides showing the component in isolation, it also shows the source files
(template, script, style), the mock data that is used, the rendered html, and some documentation
about how the component can be used.
                                                                                   
## Caching

All (static) assets should be cached by the server or a CDN. When files update you have two options,
either invalidating the cache, or changing the filename.

By default, the js and css files that should be included in the HTML have a normal filename that
doesn't change when the content updates, so the responsibility of managing the cache is the
responsibility of the implementation party. When desired, the build output can also be configured
to include a hash in the filename that is derived from the file's content, so it only updates
when the file content is changed (e.g. `common.5486f02.js`).

Besides the js and css files that should be included in the HTML, there are also files in the assets
folder that are loaded internally. Those files have the checksum content hash in the filename by
default, so the filename changes when the content of that file changes. This means that the cache
of those files can be configured to be very long, since they will never update, and will improve
load performance.

## Development

The reason Muban exists is to create the best developer experience as possible, while still making
it easy to integrate into any backend system. The benefits are:

* Let Frontend Developers use the tools they know and love in a setup they are comfortable with,
  which include:
  * Webpack for building everything
  * Webpack for hot reloading, increasing the development speed
  * Babel to use the newest javascript language features
  * TypeScript for extra type safety
  * SCSS to write stylesheets, and keep them next to your components
  * Code quality tools such as editorconfig, eslint, stylelint and prettier
  
* Handlebars as an easy to use template language which can be easily ported to other languages
* Having local mock data in yaml files, so development can start without having a backend ready
* Client and QA can checks and approve the static preview pages, without having a backend ready
* Having storybook as a nice overview of all the components, with documentation
