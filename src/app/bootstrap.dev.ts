/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
import Handlebars from 'handlebars/runtime';
import { bootstrap } from 'muban-core/lib/dev';
import symbol from 'core-js/es6/symbol';
symbol;

declare var require: any;
declare var module: any;

// create context for json data and handlebar templates
// pick any json/yaml file that doesn't start with a _ in the filename
const dataContext = require.context('../data/', true, /^(.*[\/\\])?[^_][^\/\\]+\.(yaml|json|js)$/);
const partialsContext = require.context('./component/', true, /\.hbs$/);
const replaceVariables = require('../data/_variables.yaml');

// bootstrap the app
const appElement = document.getElementById('app');
if (!appElement) {
  throw new ReferenceError('Could not find DOM element with id "app"');
}
const app = bootstrap(appElement, <any>{
  Handlebars,
  dataContext,
  partialsContext,
  indexTemplate: require('./component/layout/index'),
  appTemplate: require('./component/layout/app'),
  onData: (data: any) => ({
    ...replaceVariables,
    ...JSON.parse(
      Object.keys(replaceVariables).reduce(
        (data, varName) =>
          // replace ${foo} occurrences in the data to be rendered.
          data.replace(new RegExp(`\\$\{${varName}}`, 'g'), () => replaceVariables[varName]),
        JSON.stringify(data),
      ),
    ),
  }),
});

// Hot reloading support
if (module.hot) {
  module.hot.accept(dataContext.id, () => {
    const changedContext = require.context(
      '../data/',
      true,
      /^(.*[\/\\])?[^_][^\/\\]+\.(yaml|json|js)$/,
    );
    app.updateData(changedContext);
  });

  module.hot.accept(partialsContext.id, () => {
    const changedContext = require.context('./component/', true, /\.hbs$/);
    app.updatePartials(changedContext);
  });

  module.hot.accept(['./component/layout/index', './component/layout/app'], () => {
    app.update(require('./component/layout/index'), require('./component/layout/app'));
  });
}
