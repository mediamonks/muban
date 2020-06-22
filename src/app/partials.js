/**
 * This file is the webpack entry for compiling all partials.
 * It's used by the nodejs build script for rendering all pages based on these partials
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const Handlebars = require('handlebars/runtime');
const indexTemplate = require('./component/layout/index/index.hbs');
const appTemplate = require('./component/layout/app/app.hbs');

const context = require.context('./component/', true, /\.hbs$/);
context.keys().forEach(key => {
  Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], context(key));
});

module.exports = {
  indexTemplate,
  appTemplate,
};
