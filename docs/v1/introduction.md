# Introduction

Here you can read about why and how we created Muban.

### Background

At MediaMonks we love frontend development. Our goal is always to make the development process as
smooth as possible, so developers can focus on what they love most, making beautiful websites.

While we know we can excel when building Single Page Applications, they are not always the best
approach. Sometimes a server rendered website is the best or only option.

Traditionally, those kind of websites had small pieces of interactivity, which were accomplished by
throwing in some jQuery plugins. But as things get bigger and more complicated, that way of working
won't suffice.

Also, the last years we have been spoiled with amazing tools like webpack and babel, and a way of
working that isolates everything in small components, so why not make use of those when building
more traditional kind of websites?

### Challenges

Before starting this project, we asked ourselves what didn't work quite well in the past, and what
problems we'd like to solve. What we came up with was the following:

* Adding all kind script tags to the page doesn't make sense anymore, we'd like to make use of all
  the **node modules** out there, and a way to **bundle** them.

* Development iteration should be fast and painless, so we'd like to have **hot reloading** in
  place.

* We're going to be building frontends to all kind of websites, running on a diverge range of
  backend languages, template systems and CMSs. We'd like our setup to be **backend-agnostic**.

* Related to the above, we'd like to **develop, test and preview in isolation**. This means we can
  start developing before or at the same time as the backend without being dependent on them.

* We like a way to **preview components** we create, to test them and have a great overview of what
  can be used on the website. Like a style guide, but better!

So whatever we choose to create, or update in the future, it will adhere to the above requirements.

### What we came up with

#### webpack

We know we wanted to use webpack, for the bundling feature and the hot reloading. But also for the
great loader and plugin system, which will come up below.

#### template

Because we want to be backend-agnostic, we needed a way to render templates on the client during
development. Because the HTML should stay decoupled from JavaScript, we could not go for anything
like Vue, React or Knockout (well, technically we could, but it wouldn't make much sense). So we
started looking at a js/node template language that:

* was easy enough to work with
* had enough features to get the basics done, and compatible enough with most backend template
  languages
* could be integrated in the frontend as well, ideally as a webpack loader.

After looking and playing around, Handlebars was our favorite, and had a great webpack loader. By
having this setup, even handlebar templates could be hot reloaded.

#### components

When we knew we could use webpack and handlebars, we went ahead to set up a way to work with
components. With a custom webpack loader, we could import our script and style files from the
handlebars component template file, similar to how Vue components work.

By adding in a webpack context to find all our .hbs files, we could bundle all our components.

Using handlebars partials, we could include one component into another. Partial paths are resolved
by the handlebars-loader, that also added them (and the imported js/css files) to the webpack
dependency list. This will make sure all the required files are ending up in the build, without
including anything that isn't used.

All component classes will register themselves to the application, so they can be constructed when
the component html is present on the page.

#### application

Now that the component setup worked, we needed a way to render a page. Because most CMSs have a
concept of building a page by drag-and-dropping components in a grid from a list, we introduced the
concept of 'blocks'. Blocks are sections that make up a page, and consist out of all kind of
reusable components like headings, paragraphs, buttons, images, etc.

So to build up a page when developing, we set up to have a yaml file per page that contains an array
of block names, and the data that it would need to display content. The data is there to mock the
data that a backend system would need to render the actual page in the end.

After that, we just needed an application template file that would loop over the yaml list, and
include the block component partials, so all html for the page would be rendered.

And when the DOM is constructed, we just select all the elements that have a `data-component`
attribute, and construct the corresponding component class to make them interactive.

#### building

Now that the development setup was done, we only needed to create two things.

* The js and css bundles, with a simple webpack config
* Preview html pages

The preview pages are useful to upload and QA them; see if they match the design and don't contain
any bugs. To generate those pages, we just use the same yaml page files, loop over the block
components, and use the pre-compiled handlebar templates to generate the HTML. One file for each
yaml.

#### preview components

While those preview pages are useful in their own way, sometimes you want to have an overview of
individual components, with some documentation, and maybe the used data, and the source files that
make up those components. For this we created muban-storybook, inspired by
[React Storybook](https://storybook.js.org/), but with some additional features.

#### integration

While the above makes for an amazing frontend development experience, the job is not done. Getting
everything integrated in the CMS is the last bit. Since we're being backend-agnostic, there is no
easy way to do this. All templates are handlebars, so they cannot be copied over.

In the beginning we manually changed them to twig, django, or whatever the template language of that
project would be. With a similar syntax, it wasn't that complex, but it still took some time. The
most annoying part is missing out on small updates that had happened in the source templates,
resulting in out-of-sync templates between the frontend and backend.

For this we're working on the muban-convert-hbs module, a transpiler that can convert 99% of the
templates to an increasing amount of template systems. To complement this, we're also creating a set
of handlebar helpers to implement useful features of other backend template languages, so they are
even more compatible.

To streamline this process even more, it's important to keep the mock data in your yaml files
similar to the backend data model. In that case, you won't even have to rename your template
variables.

As a last option, there is a way to totally ignore all the handlebar templates, and just work with
the scripts and styles. This could be done after initial conversion of the templates. However, that
process has some drawbacks of its own:

* Future updates should be done in the backend templates. This means that during development, you'll
  have to run the complete backend, and manually have to reload those pages (or implement
  browsersync). This will slow down development.
* You'll completely lose the storybook functionality, since your handlebar templates are removed
  or out of sync. If you don't want this, you could choose to do your updates twice, in the backend
  and in handlebars.

### Closing words

We believe that, with the above, we've created a system that allows for a consistent and modern
development experience, allowing you to create an amazing frontend for any website.

Other frameworks might pop up, but they are most likely linked to a specific backend, or will
add more logic in the HTML, which are things that don't match with our vision.

Even though we created something that works, it doesn't mean that we're finished; every new project
could introduce new challenges that we want to solve, and the frontend ecosystem keeps evolving,
which means we keep updating this project.
