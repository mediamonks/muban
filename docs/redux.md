# Using Redux with Knockout

Some parts of the website can be client-only, and will just work like a SPA. For these sitations
you can use pure knockout components, and use Redux as global state management.

To set this up, you can do the following:

## Set up Knockout

Your block will be basically empty, and will be the starting point of your knockout app.

**spa.hbs**

```html
<link rel="stylesheet" href="./spa.scss">
<script src="./Spa.ts"></script>

<div data-component="spa">
  <ko-main></ko-main>
</div>
```

**Spa.ts**

```typescript
import ko from 'knockout';
import { getModuleContext } from '../../../muban/webpackUtils';
import AbstractBlock from '../AbstractBlock';

// sub-components-folder for your knockout app
import './components/main/main.ko';

declare var require: any;

export default class Spa extends AbstractBlock {
  static displayName: string = 'spa';

  constructor(el: HTMLElement) {
    super(el);

    // require all knockout components in this folder, so they are registered
    getModuleContext(require.context('./components/', true, /\.ko$/));
    
    // clean (for hot reloading), and start your app
    ko.cleanNode(this.element);
    ko.applyBindings({}, this.element);
  }

  public dispose() {
    super.dispose();
  }
}
```

In your block folder, create a `components` folder with the following:

* block-component-name
  * components
    * main
      * main.ko
      * main.scss
      * Main.ts
    * other-component
    * another-component

### Knockout component

A Knockout component has the same setup as a Handlebars component you can include your styles
and ViewModel from the template file. Inside the template you can do normal knockout,
like including other knockout components.

**main.ko**
```html
<link rel="stylesheet" href="./main.scss">
<script src="./Main.ts"></script>

<div>
  <ko-header></ko-header>
  <h3>Knockout App</h3>
  <p>This is awesome</p>
  
  <p data-bind="text: name"></p>
  <button data-bind="click: onClick">Hi!</button>
  
  <ko-todos></ko-todos>
</div>
```

**Main.ts**

```typescript
import ko from 'knockout';

export default class Main {
  public name:KnockoutObservable<string> = ko.observable('Narie');

  // params from parent components are passed in constructor
  constructor(params) {
    console.log(params);
  }
  
  // use arrow to auto-bind to this from tempalte
  onClick = () => {
    console.log('btn clicked');
    this.name(`${this.name()}!`);
  }
}
```

## Set up redux

In your block folder, create a `redux` folder with the following:

* block-component-name
  * redux
    * action
      * fooActions.js
    * reducer
      * index.js
      * fooReducer.js
    * store
      * index.js

### store/index.js

```js
/* eslint-disable dot-notation */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducer';

const middleware = [thunk];

const composeEnhancers =
  (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] &&
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
      maxAge: 200,
      actionsBlacklist: [],
    })) ||
  compose;

const additionalEnhancers = [];
const storeEnhancer = composeEnhancers(applyMiddleware(...middleware), ...additionalEnhancers);
const store = createStore(reducer, {}, storeEnhancer);

export default store;
```

### reducer/index.js

```js
import { combineReducers } from 'redux';
import foo from './fooReducer';

const appReducer = combineReducers({
  foo,
});

export default appReducer;
```

### Actions

Export action types and actions using the `redux-actions` module and the following conventions:

```js
import { createAction } from 'redux-actions';

export const ADD_FOO = 'fooActions/addFoo';
export const addFoo = createAction(ADD_FOO);

export const ADD_BAR = 'fooActions/addBar';
const addBarAction = createAction(ADD_BAR); // internal, no export
export const addBar = (dispath) => {
  // do some thunky stuff
  dispatch(addBarAction(...));
}
```

### Reducers

Export your reducers using the `redux-actions` module and the following conventions:

```js
import { handleActions } from 'redux-actions';
import { ADD_FOO } from '../action/fooActions';

const initialState = {
  foos: [],
};

export default handleActions(
  {
    [ADD_FOO]: (state, { payload: foo }) => ({
      ...state,
      foos: [...state.foos, { text: foo, completed: false }],
    }),
  },
  initialState,
);
```

## Connect Knockout and Redux

To link redux state and actions to a Knockout component, you can use the `connect` function
from `knockout-redux-connect.js`. This function will wrap your component constructor function,
and pass additional params to the constructor.

The data grabbed from the redux store will be converted to observables using the
[ko.mapping](http://knockoutjs.com/documentation/plugins-mapping.html) plugin. Later on, when
the store updates (after dispatching actions), it will update those observables.

When using those passed observables as params in your templates, or subscribing to them in
your ViewModel, they will automatically update when the store updates.

These parameters will be:
* state variables from `mapStateToParams`
* action functions from `mapDispatchToParams`

**todos.ko**
```html
<link rel="stylesheet" href="./todos.scss">
<script src="./Todos.ts"></script>

<!-- directly use observables from the params -->
<ul data-bind="foreach: params.todos">
  <li data-bind="text: $data.text"></li>
</ul>

<form>
  <input type="text" data-bind="value: newTodo" />
  <button type="submit" data-bind="click: addTodo">Add</button>
</form>
```

**Todos.ts**
```typescript
import ko from 'knockout';
import store from '../../redux/store';
import connect from 'app/muban/knockout-redux-connect';
import { addTodo } from '../../redux/action/todoActions';

class Todos {
  private params: any;
  public newTodo: KnockoutObservable<string> = ko.observable();

  constructor(params) {
    // store to this, so they can be used directly in templates
    this.params = params;
  }

  addTodo = () => {
    // call action with new todo as payload
    this.params.addTodo(this.newTodo());
    this.newTodo('');
  };
}

// Grab the todo list from the state, and pass to params as `todos`.
// This will be converted to an ObservableArray with ObservableStrings in there.
const mapStateToParams = state => ({
  todos: state.todo.todos,
});
// when calling `addTodo` from your component, it will dispatch it as an action.
const mapDispatchToParams = dispatch => ({
  addTodo: (...args) => dispatch(addTodo(...args)),
});

// wrap your component in the connect
export default connect(store, mapStateToParams, mapDispatchToParams)(Todos);
```
