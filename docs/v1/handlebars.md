# Handlebars

## Helpers

Besides the default helpers that are shipped with Handlebars itself, Muban includes additional
helpers to make dynamic templates easier, and to be more compatible with backend template languages
that these templates will be converted to.

The helpers are placed in the `/build-tools/handlebars-helpers` folder, and the filename should be
used as helper name.

> When you are converting templates with the
[muban-convert-hbs](https://github.com/mediamonks/muban-convert-hbs) library, make sure you try to
stick with the helpers that are supported there, otherwise your custom helpers need to be manually
updated after conversion.

> When you use the Handlebars templates as-is in a backend system, make sure that implementation has
the same helpers registered, otherwise your templates will fail rendering.

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

# TODO

* [http://handlebarsjs.com/](http://handlebarsjs.com/)
* [https://github.com/pcardune/handlebars-loader](https://github.com/pcardune/handlebars-loader)
* How to use helpers
* How partials are resolved (source root, `foo > foo/foo.hbs`)
* How script and style files are included
* Stuff that doesn't work
