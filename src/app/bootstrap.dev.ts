/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
// tslint:disable import-name
import Handlebars from 'handlebars/runtime';
import { bootstrap } from 'muban-core/lib/dev';

declare var require: any;
declare var module: any;

// create context for json data and handlebar templates
const dataContext = require.context('../data/', true, /\.(yaml|json)$/);
const partialsContext = require.context('./component/', true, /\.hbs$/);

// bootstrap the app
const app = bootstrap(document.getElementById('app'), <any>{
  Handlebars,
  dataContext,
  partialsContext,
  indexTemplate: require('./component/layout/index'),
  appTemplate: require('./component/layout/app'),
});

// Hot reloading support
if (module.hot) {
  module.hot.accept(dataContext.id, () => {
    const changedContext = require.context('../data/', true, /\.yaml$/);
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
