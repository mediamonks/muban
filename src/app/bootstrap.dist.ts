/**
 * Code being executed on production builds on start
 */
/**
 * This file is the webpack entry for all scripts/styles that must be used in the website.
 */

/**
 * Allows the website to override the publicPath set in the build process.
 * This can be useful when:
 * - The same build is deployed in different folders
 * - The same build could use a cdn-path to load all assets from another domain
 *
 * If you know the publicPath during buildTime, you can do a build with the `--publicPath=...` flag
 * This feature is mostly useful when the publicPath can be different at runtime.
 */

import { bootstrap } from 'muban-core/lib/dist';

declare var __webpack_public_path__: string;

/* eslint-disable */
if (window['webpackPublicPath']) {
  __webpack_public_path__ = window['webpackPublicPath'];
}
/* eslint-enable */

// require all hbs templates to get reference to all used code
const context = require.context('./component/block/', true, /\.hbs$/);
context.keys().forEach(key => {
  context(key);
});

// Makes the website interactive
const appElement = document.getElementById('app');
if (!appElement) {
  throw new ReferenceError('Could not find DOM element with id "app"');
}
bootstrap(appElement);
