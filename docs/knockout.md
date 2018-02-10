# Data binding with Knockout

Because muban is built for server-rendered pages, there is no possibility for client-side
data-binding without bloating the html with template mumbo-jumbo. Even then, things like looping
over lists (or other thing where a template is used in the non-rendered state) are not really
possible.

On the other hand, using just DOM APIs to read and update the DOM can become quite cumbersome and
error prone.

Luckily, Knockout allows us to initiate data-bindings from javascript (as opposed to in HTML), where
they can be bound to observables and computes, just like your normally would.

The big advantage is that you can specify those in one place (e.g. in the constructor or in a
dedicated named method) so they are visible to everyone, and they will automatically update your
view when the data updates.

## Basic Examples

Some examples on how to use this:

```
// initiate the observable
private searchOpened:KnockoutObservable<boolean> = ko.observable(false);

// set the 'opened' css class based on the 'searchOpened' observable
ko.applyBindingsToNode(this.element.querySelector('.search-results'), {
  'css' : { 'opened': this.searchOpened }
});

// do some code logic when the search is opened
this.searchOpened.subscribe((value) => {
  // make things awesome
})

...
// open the search
this.searchOpened(true);
```

## Data binding APIs

There are two, almost identical, knockout functions we can use for data-binding;
`applyBindingsToNode` and `applyBindingAccessorsToNode`.

The former is for simple use, and the latter expects each property to be a function, which allows us
write additional logic based on observables (basically creating an inline computed).

### applyBindingsToNode

Requires the DOM element to bind to, and an object with binding properties. Each key corresponds
with the normal data-binds you would normally write in your HTML (e.g. css, text, change).

Within the data-bind values you can pass observables, but you have to do so without including the
`()`. If you do so, it will just return that value, and the changes won't be tracked. By supplying
the observable itself, changes can be tracked to update the binding.

```
ko.applyBindingsToNode(element, object);
```

```
ko.applyBindingsToNode(this.element.querySelector('.search-results'), {
  'css' : { 'opened': this.searchOpened }
});
```

### applyBindingAccessorsToNode

Almost the same as `applyBindingsToNode`, but with a 3rd parameter that we don't really use, so just
pass an empty object here.

The big difference lies in the values of the data-bind keys; they have to be functions. The return
value of that function is the value that the data-bind expects (e.g. a string or object).

Within these functions you can use any observable to return a value, and all changes to those
observables will be tracked, just like in normal computeds.

If one of the data-bind properties for an element needs to be a function, you have to switch to this
method, and all of the properties have to be a function.

```
ko.applyBindingsToNode(element, object, viewModel);
```

Below, the `style` property has to be a function because we are using to observables to return a
custom value. Because of this, the `css` property also has to be a function, but that one will just
reference the observable (calling it would also work here).

```
ko.applyBindingAccessorsToNode(this.content, {
  'style' : () => ({
    maxWidth: model.deviceEmulateEnabled() ? model.viewportWidth() + 'px' : '100%',
  }),
  'css': () => ({ 'resizing' : model.isResizingViewport }),
}, {});
```

The following example applies a binding to a list of elements, where each element acts as a computed
by introducing some logic. For better performance, the reading of the attributes should be done only
once.

```
$('.bar').toArray().forEach((bar) => {
  ko.applyBindingAccessorsToNode(bar, {
    'css' : () => {
      let min:any = bar.getAttribute('data-size-min');
      let max:any = bar.getAttribute('data-size-max');
      min = min === '*' ? min : parseInt(min, 10);
      max = max === '*' ? max : parseInt(max, 10);

      return {
        active: (
          (model.viewportWidth() >= min || min === '*') &&
          (model.viewportWidth() <= max || max === '*')
        ),
      }
    }
  }, {});
});
```

## Using templates

_TODO - implement / test / finish_

When having to create lists based on (dynamic) data, you probably want to use a template item and
render that multiple times with the correct data.

Without Knockout, you would either:

* have to retrieve an existing rendered element from the DOM, clone it, and replace it values before
  appending it to the DOM again, or
* build up a HTML fragment (using strings, yikes, or DOM apis), and append it to the DOM.

With knockout, a HTML template can be defined in the handlebars template (not sure?) or in
JavaScript within a template string (might be better?) or as separate `.template.html` files that
can be imported using a custom webpack-knockout-partial loader.

These templates could include all normal data-bind attributes.
