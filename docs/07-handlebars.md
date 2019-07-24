# Handlebars

[Handlebars](https://handlebarsjs.com/) is a templating engine that let's you dynamically generate
HTML pages. It's an extension of [Mustache](http://mustache.github.io/) with some extra features
(such as `if`, `with`, `unless`, `each` and more).

This page be the starting point for the core functionality of handlebars within Muban. For more
detailed documentation please check the official [Handlebars](https://handlebarsjs.com/)
documentation.

> **Note:** You can read why handlebars was chosen in the
> [introduction section](./01-introduction.md#Template).

## Partials

Handlebars allows for template reuse through partials. Partials are normal Handlebars templates that
may be called directly by other templates.

Usually you will need to register each partial individually if you want to be able to call it in
your `.hbs` file. Muban automatically resolves all the `.hbs` files in the `/src/app/component/`
directory using the [handlebars-loader](https://www.npmjs.com/package/handlebars-loader).

So for example if you create a component in the general directory called `my-component` using the
wizard. You can then call this right away in any other `.hbs` file in the component directory.

```handlebars
<div>
  {{> general/my-component }}
</div>
```

> **Note:** Dynamically loading partials, like on the `app` compoennt is a bit more complex, see the
> guide on this for an example on how to do this.

## Helpers

Besides the default helpers that are shipped with Handlebars itself, Muban includes additional
helpers to make dynamic templates easier, and to be more compatible with backend template languages
that these templates will be converted to.

The helpers are placed in the `/build-tools/handlebars-helpers` folder, and the filename should be
used as helper name.

> When you are converting templates with the
> [muban-convert-hbs](https://github.com/mediamonks/muban-convert-hbs) library, make sure you try to
> stick with the helpers that are supported there, otherwise your custom helpers need to be manually
> updated after conversion.

> When you use the Handlebars templates as-is in a backend system, make sure that implementation has
> the same helpers registered, otherwise your templates will fail rendering.

### condition

The `condition` helper can be used in any place where just truthy or falsy data values are not
enough, but you instead like to compare two data values, or compare something against a static
value.

It supports all common operators, like `==`, `===`, `!=`, `!==`, `<`, `<=`, `>`, `>=`, `&&` and
`||`.

**Usage:**

```handlebars
{{#if (condition variable1 '!==' value) }}
  foo
{{else if (condition variable2 '>=' 10) }}
  bar
{{/if}}
```

#### Custom helpers

If you want to create a custom helper please
[see the guide on how to do this](./13-guides.md#Create-a-custom-helper)!
