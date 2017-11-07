/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
import path from 'path';
import indexTemplate from './component/layout/index/index';
import appTemplate from './component/layout/app/app';

import { initComponents, cleanElement } from './muban/componentUtils';
import { getComponentInfo } from './components';

// Get info for current page
const pageMatch = /\/(.*)\.html/i.exec(document.location.pathname);
const jsonModuleName = (pageMatch && pageMatch[1]) || 'index';

// eslint-disable-next-line no-use-before-define
const { jsonModules } = getComponentInfo(() => render(true), jsonModuleName);

const getJsonData = () => jsonModules[`./${jsonModuleName}.json`];

function render(clean) {
  const div = document.getElementById('app');

  if (clean) {
    cleanElement(div);
  }

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
      render(true);
    },
  );
}
