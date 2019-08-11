# Setup guide

This section will allow to to get started with Muban. It will give you the most basic information
required to get started with a project. For more in depth instructions please see the tutorial
section for more specific tasks.

## Preparations

Before you can get started building your Muban site, you'll need to familiarize yourself with some
core web technologies and make sure that you have installed all required software tools.

### Compatability note

Muban does **not** support IE10 and below. However it supports all
[ECMAScript 5 compliant browsers](https://caniuse.com/#feat=es5).

### Release notes

Detailed release notes for each version are available on
[GitHub](https://github.com/mediamonks/muban/releases).

### Get familiar with the core technologies

As described in the introduction, you'll need to get familiar with a couple of technologies. Not all
of them are equally as important to start building websites but it's good to know which technologies
are being used.

#### Handlebars

[Handlebars](https://handlebarsjs.com/) is a templating engine that let's you dynamically generate
HTML pages. It's an extension of [Mustache](http://mustache.github.io/) with some extra features
(such as `if`, `with`, `unless`, `each` and more).

#### SCSS

[Sass](https://sass-lang.com/) is a stylesheet language that’s compiled to CSS. It allows you to use
[variables](https://sass-lang.com/documentation/variables),
[nested rules](https://sass-lang.com/documentation/style-rules#nesting),
[mixins](https://sass-lang.com/documentation/at-rules/mixin),
[functions](https://sass-lang.com/documentation/functions), and more, all with a fully
CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share
design within and across projects.

#### TypeScript

[TypeScript](https://www.typescriptlang.org/) starts from the same syntax and semantics that
millions of JavaScript developers know today. Use existing JavaScript code, incorporate popular
JavaScript libraries, and call TypeScript code from JavaScript.

> **Note:** The default language in Muban is TypeScript but if you want to you can still use
> JavaScript if you want to.

#### Knockout

[Knockout](https://knockoutjs.com/) is a JavaScript library that helps you to create rich,
responsive display and editor user interfaces with a clean underlying data model. Any time you have
sections of UI that update dynamically (e.g., changing depending on the user’s actions or when an
external data source changes), KO can help you implement it more simply and maintainably.

> ⚠️ By default knockout is not loaded because for simple operations it is most likely not needed,
> so keep in mind that loading knockout will increase your bundle size!

### Setup your environment

Before we can get started with Muban you will need to prepare you development environment. Make sure
the following sections are covered before you get started!

#### Install Node.js

[Node.js](https://nodejs.org/en/) allows you to run JavaScript code on a server, Muban uses Node.js
so you'll need to make sure you have a recent version installed on your computer.

##### Using Homebrew on MacOS, Linux or Windows 10.

1. Make sure you have the latest version of [homebrew](https://brew.sh/) installed.

2. Open up the terminal.

3. Run the following command to install Node.js.

   ```bash
   brew install node
   ```

##### Alternative instructions

Alternatively you can [download the LTS installer package](https://nodejs.org/en/download/) from the
Node.js website and follow the installation steps.

#### Install Yarn

Muban uses [Yarn](https://yarnpkg.com/) for dependency management. So to make sure all dependencies
are correct you will need to install it.

##### Using Homebrew on MacOS, Linux or Windows 10.

1. Open up the terminal.

2. Run the following command to install Yarn

   ```bash
   brew install yarn
   ```

##### Alternative instructions

You can find alternative install instructions on the
[Yarn website](https://yarnpkg.com/en/docs/install).

#### Install the seng-generator CLI

The [seng-generator](https://www.npmjs.com/package/seng-generator) is an optional step that is not
required to get started with Muban but it's highly recommended. The seng-generator is a command line
interface that creates code based on templates. It will make the development process go a whole lot
faster.

##### Using Yarn

```bash
yarn global add seng-generator
```

> **Note:** On all the other documentation if a CLI is referenced it will be the seng-generator!

## Getting started

Once all the preparations have been completed you can follow these steps to get started building
websites!

> **Note:** In these examples assume you want the latest stable version of Muban.

### Setup the project

To get started with your new Muban project first start by creating a folder somewhere on your drive
that wil serve as the project root (for example: `/my-muban-project`).

#### Download source code

There are two ways of getting the Muban source code:

1. Clone the [GitHub repository](https://github.com/mediamonks/muban) somewhere on your drive and
   copy over the content (excluding the `.git` folder) to your newly created project root.

   **Clone with HTTPS**

   ```bash
   git clone https://github.com/mediamonks/muban.git
   ```

   **Clone with SSH**

   ```bash
   git clone git@github.com:mediamonks/muban.git
   ```

2. Download the zip directly from GitHub and extract the contents in the newly create project root.

   [📦 Download the zip file](https://github.com/mediamonks/muban/archive/master.zip)

#### Install dependencies

After downloading the source code we need to download all of Mubans dependencies. Simply install
them by running the following command in the project root (in the case of this example that would be
/`my-muban-project`).

```bash
yarn
```

#### Running the development server

After installing the dependencies you can start up the development server. Muban uses the
[webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) in combintation with
hot-reloading to serve you your project.

You can start it up by running the following command in the root of your project.

```bash
yarn dev
```

Once the server has started you can open your browser up at
[http://localhost:9000](http://localhost:9000/) to preview Muban with some boilerplate code.

The index page in the root of the server will list you all the pages that are available, this way you can easily
navigate them and keep track of your progress.

#### Running the Storybook server

> ⚠️ Storybook will become an installable module, therefore it is temporarily unavailable!

As described in the introduction Muban comes with a Storybook inspired by react-storybook. For a
more detailed section including examples please see the page on [Storybook](./10-storybook.md).

You can start it up by running the following command in the root of your project.

```
yarn storybook
```

Once the server has started you can open your browser up at
[http://localhost:9002](http://localhost:9002/) to see Storybook in action. The components are
loaded in an iframe to be completely isolated, and you can click the `responsive` icon in the
top-left to play around with breakpoints (this works in every browser).

#### Clean boilerplate code

As described in the previous step Muban comes with some boilerplate code that you will most likely
want to remove when you start your project.

To make life a little easier you can run the following command in the root of your project to remove
it.

```
yarn clean:boilerplate
```

#### Clean Storybook

If for any reason you would want to totally remove Storybook from Muban you can easily do this by
running the following command in the root of your project.

```bash
yarn clean:storybook
```

> **Note:** Once you remove Storybook all scripts related to storybook will no longer be available.

### Create a distribution build

Once you have finished your project you will most likely want to create a build that you can be used
in production. You can do this by running the following command in the root of your project.

```bash
yarn build
```

Once this is done you will end up with a `dist` folder in the root of your project, this folder wil
contain the following folders and files:

```
- dist/
  - site/
  - data/
  - templates/
  - bundlesize-profile.json
  - dist-implementation-guide.md
```

#### Preview your distribution build

Inside of the dist folder is a folder called `site`, this folder contains the static html pages that
load the bundled JavaScript and CSS. This is very similar to the actual website where your frontend
code will be served by a backend.

You can use the following command to startup a local server to preview that specific build.

```
yarn preview
```

Once the server has started you can open your browser up at
[http://localhost:9001](http://localhost:9001/) to preview the build.

> **Note:** It is always good practice to build and preview your site before sending it over to
> anyone else, so you now for sure everything works properly.

#### Analyze your distribution build

When using a lot of different modules to manage small tasks for you your bundle might increase a lot
as well. To give a good overview of the size of your bundle you can run the following command in the
root of your project.

```bash
yarn analayze
```

Once the server has started you can open your browser up at
[http://localhost:8888](http://localhost:8888/) to preview the bundle analyzer.

#### Generate a difference report

When you handover the code to the backend it can be quite difficult to see the difference between
generated HTML in the builds. To make this easier you can also create a difference report. This also creates a `/diff`
folder inside of the `/dist` folder containing the report.

You can do this by running the following in the root of your project

```
yarn build:diff
```

> **Note:** To use the difference report you will need to make sure you are within a
> [Git repository](https://git-scm.com/). it can use either the `master branch`, a
> [tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) or `commit hash` to make the diff file.

#### Watch a code dev build

When you only want to make changes to html/css. This could happen when your server/cms will take
care of rendering the HTML, and you only use webpack for frontend development.

The following command will only compile js/css (and assets), with normal webpack watch mode, but
as a dev build (so it's easy to debug).

```
yarn dev:code
```

##### Watch a full dev build

Similar to the above, with one major difference; The HTML will also be watched and re-rendered on
changes. Live-reload will happen on any file change.

This is mostly useful when you want to test the normal HTML output process (instead of using
webpack-dev-server), and can also be adopted to render HTML files from other kind of templates.

```
yarn build:dev
```


## Code quality

### EditorConfig

We use [EditorConfig](http://editorconfig.org/) define and maintain consistent coding styles between
different editors and IDEs. Please make sure to enable/install the EditorConfig plugin in your IDE
of choice.

- indentation of `2 spaces`
- use `lf` line endings
- use `utf-8` charset
- trim trailing whitespaces
- add en empty newline at the end of each file

### Prettier

We use [Prettier](https://github.com/prettier/prettier) to format all our code. This is enabled for
`js`, `ts`, `scss` and `yaml` files. The corresponding linters are configured to adhere to the rules
from prettier (so they won't conflict), and linting errors should only occur for non-stylistic
errors.

Prettier is configured for:

- indentation of `2 spaces`
- the use of `semicolons`
- the use of `single quotes`
- a tab width of `100`

Prettier is configured to run on the `pre-commit` using `husky` and `lint-staged` hook, and can also
be manually invoked by:

```
yarn prettify
```

Settings can be changed in `.prettierrc` and files can be ignored in `.prettierignore`.

Please check the [editor integration](https://github.com/prettier/prettier#editor-integration)
section of the Prettier readme to enable running Prettier within your IDE of choice.

> **Note:** Keep in mind, that if you choose to automatically run Prettier when saving your file,
> Webpack will run twice (on your manual save, and when prettier reformats your code), slowing down
> the developer experience.

### Linting

The below tools are used to lint our code. They can be all executed by opening up the terminal in
the root of your project and running the following command:

```
yarn lint
```

#### eslint

We use [eslint](https://eslint.org/) lint our JavaScript code. It's configured for use with
Prettier, and set up to understand Webpack imports. It follows the
[AirBnB styleguide](https://github.com/airbnb/javascript) with some super small tweaks.

To triger eslint you should open up the terminal in the root of your project and run the following
command:

```
yarn lint:js
```

> **Note:** Settings can be changed in `.eslintrc.js` and files can be ignored in `.eslintignore`.

#### tslint

We use [tslint](https://palantir.github.io/tslint/) lint our TypeScript code. It's configured for
use with Prettier. It follows the [AirBnB styleguide](https://github.com/airbnb/javascript) with
some super small tweaks. It's consistent with the eslint settings.

To triger tslint you should open up the terminal in the root of your project and run the following
command:

```
yarn lint:ts
```

> **Note:** Settings can be changed in `.tslintrc.js`.

#### stylelint

We use [stylelint](https://github.com/stylelint/stylelint) lint our SCSS code. It's configured for
use with Prettier and uses
[stylelint-config-recommended-scss](https://github.com/kristerkari/stylelint-config-recommended-scss)without
any modifications.

To triger stylelint you should open up the terminal in the root of your project and run the
following command:

```
yarn lint:css
```

> **Note:** Settings can be changed in `.stylelintrc` and files can be ignored in
> `.stylelintignore`.

### Pre-commit hook

To make sure all code checked in to git, we use [husky](https://github.com/typicode/husky) to
configure git commit hooks. The `pre-commit` hook is configured to run
[lint-staged](https://github.com/okonet/lint-staged) on the files that are about to be committed.

It will run all linters on the appropriate files, and allows Prettier to reformat any code before
doing the actual commit.

You can also run the command manually in the root of your project:

```
yarn precommit
```

> **Note:** Keep in mind that some lint errors might pop up in files that are not updated by
> changing other things (like imports that are not correct after renaming a file), so it's good
> practice to run `yarn lint` once in while to verify the complete codebase is valid.
