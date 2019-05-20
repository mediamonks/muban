# Distribution implementation guide

_Note: this file is copied from docs to the dist package._

This package contains all the information that is needed for implementing the frontend in
your website. It contains assets that can be copied over as is, preview pages to view the
(static) end result, and the developer templates that can be referenced as example when
implementing the html in your template language of choice.

The package content:

* **site/** - _the preview site_
  * **aem/** - contains all assets that should be copied over and included in the page HTML
  * **etc.clientlibs/** - This is duplicated from `aem/clientlibs/clientlibs-site/resources`
  to work outside of AEM.
  * **\*.html** - statically rendered preview pages (with index.html as overview)
* **template/** - the developer templates and mock data, can be used as reference

#### Preview

To view the preview pages, you must upload or run a local http server, where the contents of the
`site` folder is your webroot.

## Integration

Follow the steps below to integrate the files in this package into your own website.

1. Copy over the `aem` folder over your own webroot (keeping the same folder name). Or move the
  contents of the `aem` folder within your AEM file structure (this step can be automated as part)
  of the build script once the source is also available in your repo.
2. Use the `*.html` preview pages and the `template/*.hbs` templates to implement the HTML in your
   own website.
3. Include the contents from `aem/clientlibs/clientlibs-shared/bundle/clientlibs` in your HTML as
   dependency ofo all components, so they are loaded before any component file.
4. Copy over the `<head>` section from `site/index.html` as good as possible, so all information
   like doctype, charset, meta tags, icons, etc are present on your own website. Some tags like
   icons are optional, but the `<meta ...>` are all needed to guaranty the website is displayed
   correctly.

Read the sections below for more information about certain files or folders.

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
