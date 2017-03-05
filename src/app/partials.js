/**
 * This file is the webpack entry for compiling all partials.
 * It's used by the nodejs build script for rendering all pages based on these partials
 */
const Handlebars = require('handlebars/runtime');
const indexTemplate = require("./index.hbs");
const appTemplate = require("./app.hbs");

const context = require.context('./component/', true, /\.hbs$/);
context.keys().forEach(function(key) {
	Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], context(key))
});

module.exports = {
	indexTemplate,
	appTemplate,
};
