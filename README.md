# Muban

Muban is a backend-agnostic framework and development setup to enhance server-rendered HTML with
[TypeScript](https://www.typescriptlang.org/) or [Babel](https://babeljs.io/) components and
[SCSS](http://sass-lang.com/) stylesheets.

During development, [webpack](https://webpack.js.org/) will supply fast compilation and hot
reloading, while using [Handlebars](http://handlebarsjs.com/) templates to render everything.

The dist build will generates preview html pages and a js and css bundle that backend developers can
use to integrate the pages in their server side templates or CMS of choice.

## 🎓 Documentation

You can find the full documentation in the `/docs` folder. Here you will find the full
[table of contents](./docs/) covering all the subjects required to start on your own Muban project!

1. If you are new to Muban we suggest to start by reading the
   [preparations guide](./docs/02-setup-guide#preparations). This will guide you through the core
   technologies and the required steps to setup your environment.
2. Once you've completed the preparations you can have a look at the
   [getting started guide](./docs/02-setup-guide#getting-started). This guide will walk you through
   all the steps to setup the a new Muban project
3. If you want to dive straight into examples have a look at the [guides section](./docs/12-guides)
   of the documentation. This page contains a lot of example situations hopefully cover all your
   questions.

## 📚 Ecosystem

| Project                      | Status                                                                     | Description                     |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| [muban-core]                 | [![muban-core-status]][muban-core-package]                                 | The core functionality of Muban |
| [muban-transition-component] | [![muban-transition-component-status]][muban-transition-component-package] | GSAP transitions for Muban      |

[muban-core]: https://github.com/mediamonks/muban-core
[muban-transition-component]: https://github.com/riccoarntz/muban-transition-component
[muban-core-status]: https://img.shields.io/npm/v/muban-core.svg
[muban-transition-component-status]: https://img.shields.io/npm/v/muban-transition-component.svg
[muban-core-package]: https://npmjs.com/package/muban-core
[muban-transition-component-package]: https://npmjs.com/package/muban-transition-component

## 📝 License

Licensed under the [MIT](http://opensource.org/licenses/MIT) License.
