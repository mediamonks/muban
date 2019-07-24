# Muban [![muban-release-status]][muban-release]

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

- **Totally new:** If you are new to Muban we suggest to start by reading the
  [preparations guide](./docs/02-setup-guide.md#preparations). This will guide you through the core
  technologies and the required steps to setup your environment.
- **Ready to get started:** Once you've completed the preparations you can have a look at the
  [getting started guide](./docs/02-setup-guide.md#getting-started). This guide will walk you
  through all the steps to setup the a new Muban project
- **Give me some examples:** If you want to dive straight into examples have a look at the
  [guides section](./docs/13-guides.md) of the documentation. This page contains a lot of example
  situations that hopefully cover all your questions.

## 🚀 Quick start

If you have all the [preparations](./docs/02-setup-guide.md#preparations) done and you don't want to
read the documentation you can follow these steps to get you started.

1. Get the a _copy_ of the source code using one of the following methods
   - Clone the repository and remove the `.git` folder.
   - [📦 Download](https://github.com/mediamonks/muban/archive/master.zip) the repository `zip`
     file.
2. Install the project dependencies using `yarn`.
3. Startup the development server using `yarn dev`.
   - Open your browser at [http://localhost:9000](http://localhost:9000).
4. Start editing!

> **Note:** If you need more instructions we suggest you take a look at the full
> [getting started guide](./docs/02-setup-guide.md#getting-started)!

## 📚 Ecosystem

| Project                      | Status                                                                     | Description                     |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| [muban-core]                 | [![muban-core-status]][muban-core-package]                                 | The core functionality of Muban |
| [muban-transition-component] | [![muban-transition-component-status]][muban-transition-component-package] | GSAP transitions for Muban      |

## 📝 License

Muban is released under the [MIT](http://opensource.org/licenses/MIT) License.

[muban-release]: https://github.com/mediamonks/muban/releases
[muban-release-status]: https://img.shields.io/github/release/mediamonks/muban.svg?colorB=41a6ff
[muban-core]: https://github.com/mediamonks/muban-core
[muban-transition-component]: https://github.com/riccoarntz/muban-transition-component
[muban-core-status]: https://img.shields.io/npm/v/muban-core.svg?colorB=41a6ff
[muban-transition-component-status]:
  https://img.shields.io/npm/v/muban-transition-component.svg?colorB=41a6ff
[muban-core-package]: https://npmjs.com/package/muban-core
[muban-transition-component-package]: https://npmjs.com/package/muban-transition-component
