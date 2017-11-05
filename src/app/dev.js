/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import Handlebars from 'handlebars/runtime';
import indexTemplate from './component/layout/index/index';
import appTemplate from './component/layout/app/app';

import { initComponents } from './muban/componentUtils';
import { getComponentInfo } from './components';
import { getModuleContext } from './muban/webpackUtils';

/**
 * Register all templates beforehand with a require context, and save the partial by filename
 */
getModuleContext(require.context('./component/blocks/', true, /\.hbs$/), (context, key, module) => {
  Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], module);
});

// Get info for current page
const pageMatch = /\/(.*)\.html/i.exec(document.location.pathname);
const jsonModuleName = (pageMatch && pageMatch[1]) || 'index';

// eslint-disable-next-line no-use-before-define
const { jsonModules } = getComponentInfo(render, jsonModuleName);

const getJsonData = () => jsonModules[`./${jsonModuleName}.json`];

function render() {
  const div = document.getElementById('app');

  if (jsonModuleName === 'index') {
    // render the index overview page
    div.innerHTML = indexTemplate({
      pages: Object.keys(jsonModules)
        .map(key => ({
          page: path.basename(key, '.json'),
          data: jsonModules[key],
        }))
        .sort()
        .map(({ page, data }) => ({
          page,
          link: `${page}.html`,
          data,
        })),
    });
  } else {
    // render page with data
    div.innerHTML = appTemplate(getJsonData());

    // TODO: should we cleanup ALL block JS modules?
    initComponents(div);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  render();
});

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept(
    ['./component/layout/index/index.hbs', './component/layout/app/app.hbs'],
    () => {
      render();
    },
  );
}
