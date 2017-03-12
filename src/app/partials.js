/**
 * This file is the webpack entry for compiling all partials.
 * It's used by the nodejs build script for rendering all pages based on these partials
 */
const Twig = require('twig');
const indexTemplate = require("./index.twig");
const appTemplate = require("./app.twig");

const context = require.context('./component/', true, /\.twig$/);
context.keys().forEach(function(key) {
	Twig.twig({
		id: /\/([^/]+)\.twig/gi.exec(key)[1],
		data: context(key).tokens,
		allowInlineIncludes: true,
		rethrow: true
	});
});

module.exports = {
	indexTemplate,
	appTemplate,
};
