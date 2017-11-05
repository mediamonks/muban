/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import Handlebars from 'handlebars/runtime';
import { getModuleContext, getChanged } from './muban/webpackUtils';

let onHotChange = () => undefined;
let jsonModuleName;

/**
 * Register all templates beforehand with a require context, and save the partial by filename
 */
const [partialModules, partialsContext] = getModuleContext(
  require.context('./component/', true, /\.hbs$/),
  (context, key, module) => {
    // only blocks have to be registered, the others are automatically done by the hbs-loader
    if (key.includes('/blocks/')) {
      Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], module);
    }
  },
);

/**
 * json data context, for hot reloading
 */
const [jsonModules, jsonContext] = getModuleContext(require.context('../data/', true, /\.json$/));

// eslint-disable-next-line import/prefer-default-export
export function getComponentInfo(onChange, jsonModuleName_) {
  if (onChange) {
    onHotChange = onChange;
    jsonModuleName = jsonModuleName_;
  }

  return {
    partialModules,
    jsonModules,
  };
}

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept(partialsContext.id, () => {
    // You can't use the previous context here. You _need_ to call require.context again to
    // get the new version. Otherwise you might get errors about using disposed modules
    const changedModules = getChanged(
      require.context('./component/', true, /\.hbs$/),
      partialModules,
    );

    changedModules.forEach(({ key, content }) => {
      // register updated partials and re-render the page
      if (key.includes('/blocks/')) {
        Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], content);
      }
    });

    onHotChange();
  });

  module.hot.accept(jsonContext.id, () => {
    const changedModules = getChanged(require.context('../data/', true, /\.json$/), jsonModules);

    let update = false;
    changedModules.forEach(({ key }) => {
      // only re-render if the current page data is changed
      if (key === `./${jsonModuleName}.json`) {
        update = true;
      }
    });

    if (update) {
      onHotChange();
    }
  });
}
