/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import indexTemplate from "./index.hbs";
import appTemplate from "./app.hbs";
import Handlebars from 'handlebars/runtime';

import { initComponents } from './component/components';
import { getModuleContext, getChanged } from './util/webpack';

/**
 * Register all templates beforehand with a require context, and save the partial by filename
 */
const [partialModules, partialsContext] = getModuleContext(
	require.context('./component/blocks/', true, /\.hbs$/),
	(context, key, module) => {
		Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], module)
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
	module.hot.accept(['./index.hbs', './app.hbs'], () => {
		render();
	});

	module.hot.accept(partialsContext.id, () => {
		// You can't use the previous context here. You _need_ to call require.context again to
		// get the new version. Otherwise you might get errors about using disposed modules
		const changedModules = getChanged(
			require.context('./component/blocks/', true, /\.hbs$/),
			partialModules,
		);

		changedModules.forEach(({key, content}) => {
			// register updated partials and re-render the page
			Handlebars.registerPartial(/\/([^/]+)\.hbs/gi.exec(key)[1], content);
			render();
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
