# Setup guide

This section will allow to to get started with Muban. It will give you the most basic information required to get started with a project. For more in depth instructions please see the tutorial section for more specific tasks.

## Preparations

Before you can get started building your Muban site, you'll need to familiarize yourself with some core web technologies and make sure that you have installed all required software tools.

### Compatability note

Muban does **not** support IE10 and below. However it supports all [ECMAScript 5 compliant browsers](https://caniuse.com/#feat=es5).

### Release notes

Detailed release notes for each version are available on [GitHub](https://github.com/mediamonks/muban/releases).

### Get familiar with the core technologies

As described in the introduction, you'll need to get familiar with a couple of technologies. Not all of them are equally as important to start building websites but it's good to know which technologies are used.

#### Handlebars

[Handlebars](https://handlebarsjs.com/) is a templating engine that let's you dynamically generate HTML pages. It's an extension of [Mustache](http://mustache.github.io/) with some extra features (such as `if`, `with`, `unless`, `each` and more).

#### SCSS

[Sass](https://sass-lang.com/) is a stylesheet language that’s compiled to CSS. It allows you to use [variables](https://sass-lang.com/documentation/variables), [nested rules](https://sass-lang.com/documentation/style-rules#nesting), [mixins](https://sass-lang.com/documentation/at-rules/mixin), [functions](https://sass-lang.com/documentation/functions), and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.

#### TypeScript

[TypeScript](https://www.typescriptlang.org/) starts from the same syntax and semantics that millions of JavaScript developers know today. Use existing JavaScript code, incorporate popular JavaScript libraries, and call TypeScript code from JavaScript. 

*Note: The default language in Muban is TypeScript but if you want to you can still use JavaScript if you want to.*

#### Knockout

[Knockout](https://knockoutjs.com/) is a JavaScript library that helps you to create rich, responsive display and editor user interfaces with a clean underlying data model. Any time you have sections of UI that update dynamically (e.g., changing depending on the user’s actions or when an external data source changes), KO can help you implement it more simply and maintainably.

*Note: By default knockout is not loaded because for simple operations it is most likely not needed, so keep in mind that loading knockout will increase your bundle size!*

### Setup your environment

Before we can get started with Muban you will need to prepare you development environment. Make sure the following sections are covered before you get started!

#### Install Node.js

[Node.js](https://nodejs.org/en/) allows you to run JavaScript code on a server, Muban uses Node.js so you'll need to make sure you have a recent version installed on your computer.

##### Using Homebrew on MacOS, Linux or Windows 10.

1. Make sure you have the latest version of [homebrew](https://brew.sh/) installed.

2. Open up the terminal.

3. Run the following command to install Node.js.

   ```bash
   brew install node
   ```

##### Alternative instructions

Alternatively you can download the LTS installer package from the Node.js website and follow the installation steps.

#### Install Yarn

Muban uses Yarn for dependency management. So to make sure all dependencies are correct you will need to install it. 

##### Using Homebrew on MacOS, Linux or Windows 10.

1. Open up the terminal.

2. Run the following command to install Yarn

   ```bash
   brew install yarn
   ```

##### Alternative instructions

You can find alternative install instructions on the [Yarn website](https://yarnpkg.com/en/docs/install).

#### Install the seng-generator CLI

The [seng-generator](https://www.npmjs.com/package/seng-generator) is an optional step that is not required to get started with Muban but it's highly recommended. The seng generator is a command line interface that creates code based on templates. It will make the development process go a whole lot faster. 

##### Using Yarn 

```bash
yarn global add seng-generator
```

*Note: On all the other documentation if a CLI is referenced it will be the seng-generator!*

## Getting started

Once all the preparations have been completed you can follow these steps to get started building websites!

*Note: In these examples assume you want the latest stable version of Muban.*

### Setup the project

To get started with your new Muban project first start by creating a folder somewhere on your drive that wil serve as the project root (for example: `/my-muban-project`). 

#### Download source code

There are two ways of getting the Muban source code:

1. Clone the [GitHub repository](https://github.com/mediamonks/muban) somewhere on your drive and copy over the content (excluding the `.git` folder) to your newly created project root.

   **Clone with HTTPS**

   ```bash
   git clone https://github.com/mediamonks/muban.git
   ```

   **Clone with SSH**

   ```bash
   git clone git@github.com:mediamonks/muban.git
   ```

2. Download the zip directly from GitHub and extract the contents in the newly create project root.
   
   1. https://github.com/mediamonks/muban/archive/master.zip

#### Install dependencies

After downloading the source code we need to download all of Mubans dependencies. Simply install them by running the following command in the project root (in the case of this example that would be /`my-muban-project`).

```bash
yarn
```

#### Running the development server

After installing the dependencies you can start up the development server. Muban uses the [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) in combintation with hot-reloading to serve you your project. 

You can start it up by running the following command in the root of your project.

```bash
yarn dev
```

Once the server has started you can open your browser up at [http://localhost:9000](http://localhost:9000/) to preview Muban with some boilerplate code. 

The root of the server will list you all the pages that are available, this way you can easily navigate them and keep track of your progress.

#### Running the Storybook server

As described in the introduction Muban comes with a Storybook inspired by react-storybook. For a more detailed section including examples please see the page on Storybook.

You can start it up by running the following command in the root of your project.

```
yarn storybook
```

Once the server has started you can open your browser up at [http://localhost:9002](http://localhost:9002/) to see Storybook in action. The components are loaded in an iframe to be completely isolated, and you can click the `responsive` icon in the top-left to play around with breakpoints (this works in every browser). 

#### Clean boilerplate code

As described in the previous step Muban comes with some boilerplate code that you will most likely want to remove when you start your project. 

To make live a little easier you can run the following command in the root of your project to remove it.

```
yarn clean:boilerplate
```

#### Clean storybook

If for any reason you would want to totally remove Storybook from Muban you can easily do this by running the following command in the root of your project. 

```bash
yarn clean:storybook
```

*Note:  Once you remove Storybook all scripts related to storybook will no longer be available.*

### Create a distribution build

Once you have finished your project you will most likely want to create a build that you can be used in production. You can do this by running the following command in the root of your project.

```bash
yarn build
```

Once this is done you will end up with a `dist` folder in the root of your project, this folder wil contain the following folders and files:

```
- dist/
	- site/
	- data/
	- templates/
	- bundlesize-profile.json
	- dist-implementation-guide.md
```

#### Preview your distribution build

Inside of the dist folder is a folder called `site`, this folder contains the static html pages that load the bundled JavaScript and CSS. This is very similar to the actual website where your frontend code will be served by a backend.

You can use the following command to startup a local server to preview that specific build. 

```
yarn preview
```

Once the server has started you can open your browser up at [http://localhost:9001](http://localhost:9001/) to preview the build.

*Note: It is always good practice to build and preview your site before sending it over to anyone else, so you now for sure everything works properly.*

#### Generate a difference report

When you handover the code to the backend it can be quite difficult to see the difference between builds. To make this easier you can also create a difference report. This also creates a `/diff`  folder inside of the  `/dist` folder containing the report. 

You can do this by running the following in the root of your project

```
yarn build:diff
```

*Note: To use the difference report you will need to make sure you are within a [Git repository](https://git-scm.com/). it can use either the `master branch`, a [tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) or `commit hash`  to make the diff file.*

### Code quality

