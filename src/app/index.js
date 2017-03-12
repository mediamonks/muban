/**
 * This file is only used during development.
 * It's set up to render the twig templates in the DOM using javascript, and supports hot reloading.
 */
import Twig from 'twig';

import indexTemplate from "./index.twig";
import appTemplate from "./app.twig";
import { initComponents } from './component/components';
import { getModuleContext, getChanged } from './util/webpack';

import 'modernizr';

// when set to true, you cannot register a template twice, which is what we need for hot reloading
Twig.cache(false);

Twig.extend(function(Twig) {
	Twig.Templates.registerLoader('webpack', function(location, params, callback, error_callback) {

		throw new Error('"' + (location || params.id) + '" could not be loaded, register your template before hand!');

		// look at https://github.com/twigjs/twig.js/blob/751a8ba41b4275ee480d9c6de87d221e052a4b17/src/twig.core.js#L955
		// on how to implement this loader if you want something custom
	});
});


/**
 * Register all templates beforehand with a require context, and save the partial by filename
 */
const [partialModules, partialsContext] = getModuleContext(
	require.context('./component/blocks/', true, /\.twig$/),
	(context, key, module) => {
		const template = Twig.twig({
			id: /\/([^/]+)\.twig/gi.exec(key)[1],
			data: module.tokens,
			allowInlineIncludes: true,
			rethrow: true
		});
		template.method = 'webpack';
	}
);

/**
 * json data context, for hot reloading
 */
const [jsonModules, jsonContext] = getModuleContext(
	require.context('../data/', true, /\.json$/),
);

// Get info for current page
const pageMatch = /\/(.*)\.html/i.exec(document.location.pathname);
const jsonModuleName = (pageMatch && pageMatch[1] || 'index');
const getJsonData = () => {
	return jsonModules[`./${jsonModuleName}.json`];
};


function render() {
	const div = document.getElementById('app');

	if (jsonModuleName === 'index') {
		// render the index overview page
		div.innerHTML = indexTemplate({
			pages: Object.keys(jsonModules)
				.map(key =>
					key.split('/').pop().split('.').slice(0, -1).join('.')
				)
				.sort()
				.map(page => ({
					page,
					link: page + '.html',
				}))
		});
	} else {
		// render page with data
		div.innerHTML = appTemplate(getJsonData());

		// TODO: should we cleanup ALL block JS modules?
		initComponents(div);
	}
}
document.addEventListener("DOMContentLoaded", () => {
	render();
});


// Hot Module Replacement API
if (module.hot) {
	module.hot.accept(['./index.twig', './app.twig'], () => {
		render();
	});

	module.hot.accept(partialsContext.id, () => {
		// You can't use the previous context here. You _need_ to call require.context again to
		// get the new version. Otherwise you might get errors about using disposed modules
		const changedModules = getChanged(
			require.context('./component/blocks/', true, /\.twig$/),
			partialModules,
		);

		changedModules.forEach(({key, content}) => {
			// register updated partials and re-render the page
			Twig.twig({
				id: /\/([^/]+)\.twig/gi.exec(key)[1],
				data: content.tokens,
				method: 'webpack',
				allowInlineIncludes: true,
				rethrow: true
			});
			setTimeout(() => {
				render();
			}, 0);
		});
	});

	module.hot.accept(jsonContext.id, () => {
		const changedModules = getChanged(
			require.context('../data/', true, /\.json$/),
			jsonModules,
		);

		changedModules.forEach(({key, content}) => {
			// only re-render if the current page data is changed
			if (key === `./${jsonModuleName}.json`) {
				render(indexTemplate);
			}
		});
	});
}
