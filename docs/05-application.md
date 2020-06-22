# Application

Everything in Muban is a component, this includes the application itself. This component is 
called `App` and can be found in the `src/app/component/layout/app` folder. By default 
the app does not do that much, it just renders out all the blocks that are provided by the 
blocks list as described in the page about pages.

The structure for the app component looks like this:

```
app/
  - app.hbs
  - app.scss
  - App.ts
```

If you would want to add some HTML that appears on all pages (for example a header and/or a footer)
you would add it here. Just make sure you leave the loop in there!

```handlebars
<link rel="stylesheet" href="./app.scss">
<script src="./App.ts"></script>

<div data-component="app-root">
  <header>I'm the header</header>
  {{#each blocks}}
    {{> (lookup . 'name') data }}
  {{/each}}
  <footer>I'm the footer</footer>
</div>
```

> **Note:** If you want to more information about smart components please see smart-components
> section on the [page about components](./03-component.md)

## Bootstrapping

The bootstrap file is the starting point of your Muban project, it is the entry point for webpack
and can be found in the root of the `/src/app` folder. This file bootstraps Muban with the required
configuration.

Since we have a development and a production version of the project we also have a development and a
production version of the bootstrap.

- `bootstrap.dev.ts`
- `bootstrap.dist.ts`

### Development bootstrapping

The development version of the bootstrap file consists of two sections. The first one is the
initialisation of Muban with all the configuration, and the second one enables hot reloading for the
development server. For a full detailed description of the development bootstrap method
[see the API reference page](./09-api-reference.md)!

### Production bootstrapping

The production version of the bootstrap file also consists of two sections. The first one is the
creation of a require context for all the blocks. The second part is the actual initialisation of
Muban, compared to the development version this initialisation does not require any more
configuration since everything is already bundled.

For a full detailed description of the production bootstrap method
[see the API reference page](./09-api-reference.md)!

## Application lifecycle

When a component file is loaded, it will register itself. When the app boots, all registered
components will be constructed:

- Loop trough all registered component

- Find DOM elements that match the components

  ```
  displayName
  ```

  - this is set statically on the component class
  - this is set using the `data-component` attribute on the HTML tag

- Sort found DOM elements based on their nesting depth

  - This will make sure child components are constructed first

- Construct the component class and pass the DOM element to the constructor

- Store a reference to the instance and the DOM element

- The above allows any component constructor to select its child components DOM element and look up
  its class instance to communicate with. This can be used to listen for events, read properties or
  call functions. The `getComponentForElement(element:HTMLElement):AbstractComponent` function can
  be used for that.

- When running the dev server, and you change your component script file, it will be hot-reloaded by
  webpack. Before constructing an instance from the updated file, `dispose()` will be called on the
  old instance, so any references or event listeners to the DOM elements can be removed.
