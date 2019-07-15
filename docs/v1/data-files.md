# Data

The data files, located at `src/data/`, provide the content and the structure of your pages.
Every page has it's own data file, which can be either `yaml`, `json` or `js`.
Since `yaml` is less verbose, and can better handle multiline content, we've chosen
that as the default. `js` can be useful for more dynamic data, when creating loops or needing
something from `process.env`.

To render a page, the `src/app/component/layout/app/app.hbs` is provided with the data for the page,
and will decide how it will be rendered.
By default, a page will render a set of blocks, that are different for each page.
Blocks can be reused across different pages. Each block can be made up from multiple
components. Your block and component `hbs` files use and pass down the data provided
in the data files.

## Using data

The data used in Muban is used as a static mock representation of the eventual backend data that
will be used to render the templates on the server. Because of that it's good to communicate
with backed to set up a data structure that makes sense.

The data will only be used to render HTML, and cannot be used by JavaScript directly.
For JS to use any data, it has to be rendered in the HTML, either by a `data-` attribute,
or by rendering a `plain/text` script tag and fetching the (json) content via `innerHTML`.

## import

Because it's a lot of work to provide all data for the complete page directly in the page data files,
and because you'll most likely reuse blocks and components across multiple pages,
we've made it possible to import one data file into another. This way you can keep your
data nicely together with your component. Importing can look like this:

**home.yaml**
```yaml
blocks:
  - name: "paragraph"
    data: "import!../app/component/block/paragraph/data.yaml"

  - name: "two-col"
    data: "import!../app/component/block/two-col/data.json"
```

**paragraph/data.yaml**
```yaml
title: What is Lorem Ipsum?

content: >
  industry. Lorem Ipsum has been the industry's standard dummy text ever since
  the 1500s, when an unknown printer took a galley of type and scrambled it to
  make a type specimen book.

ctaReadMore: 'read more...'
```

Imports can be done by adding `"import!path-to-file"` on the place where a 'value'
should be located. The object or array in the data file will be inlined at the
location of the import statement.

Importing works for `yaml`, `json` and `js`, can be nested without recursion, and
the path is relative from the file the import statement is located in.

For more information, check out the [ThaNarie/json-import-loader](https://github.com/ThaNarie/json-import-loader)
documentation that makes this possible.

### Dynamic data

You can also use JS files for your data from the `import` statement. Your JS file
can either export an object, or a function that returns an object. You can add dynamic
code to create mock data, a large collection with little code, or use environment variables
to specify certain values.

Example: https://github.com/ThaNarie/json-import-loader/blob/master/test/_fixtures/e.js

## dev & dist

During **dev**, the data files are required by a webpack context, and passed to the included
handlebar templates (that are also required by webpack and precompiled), so that they
can render the resulting HTML.

If either the template or the data file is changed, the complete page will be re-rendered
without reloading.

During *build* the templates are precompiled to a `partials.js` file and used by the
build script to render a HTML page for each data file. These files, together with the
JS, CSS and other assets, can be uploaded to a preview server.

## Global data

If you need some specific data on each page, that is not a block or component, you can
create a data file in the data folder, and import it at the top level on each page.

_**Tip**: You can change the seng-generator template to make this work for all new pages._

_**Note**: data files that should not end up as a page, should start with a `_`, so they are skipped._

```yaml
title: Home

extra: "import!_extra.yaml"

meta:
  id: '' # can be number or string, used for ordering
  status: '' # dev, qa, feedback, done
  notes: '' # add some information about the page
  category: '' # to group pages in the overview
```

In your templates, you can access any page-level data using the `@root` context:
```hbs
<div data-component="paragraph">
  <h2>{{title}} {{@root.extra.foo}}</h2>
</div>
```

**Note:** See below for a slightly better approach for some cases making use of `_variables.yaml`.
The variables in that file are always available in all your pages and hbs files, so they won't have
to be imported manually in each page file.

## Modify data & variables

If you want to have a bit more control over your data, you are able to change the data
right before it gets rendered. During dev this can be done using the `onData` callback
that is passed to the dev `bootstrap` as an option. During build you can change the data
in `build-tools/script/util/getPages.js` for each page before rendering it to HTML.

By default, Muban already allows you to use variables in your data files, that will be
replaced by the contents of the `src/data/_variables.yaml`. This can be useful for
files you are linking to the `static` folder or are fetching from a `CDN`, where you want
to change the server location easily (or dynamically per build).

Variables can be used like this:
```yaml
title: Foobar
image: "${cdnPath}/images.foo.png"
```

This is implemented by default:
```js
const replaceVariables = require('../data/_variables.yaml');

const app = bootstrap(appElement, {
  ...otherStuff,
  onData: (data) => ({
      // include the _variables content by default in all page files
      ...replaceVariables,
      ...JSON.parse(
        Object.keys(replaceVariables).reduce(
          (data, varName) =>
            // replace ${foo} occurrences in the data to be rendered.
            data.replace(new RegExp(`\\$\{${varName}}`, 'g'), () => replaceVariables[varName]),
          JSON.stringify(data),
        ),
      ),
    }),
});
```

**Note**: data files that should not end up as a page, should start with a `_`, so they are skipped.

**Note**: You can change the extension of the variable file, and replace the require in
`src/app/bootstrap.dev.ts` and `build-tools/script/util/getPages.js`.

