const path = require('path');
const loaderUtils = require('loader-utils');

/**
 * Processes handlebar templates to import script and style files.
 * Also has an option to remove al the template code itself to only extract the scripts out of it
 *
 * For scripts:
 * - Changes the html script include to a js file require
 * - Also registers the class to be initialized
 * - Has support for hot reloading
 *
 * For styles:
 * - Changes the html style link to a css file require
 */
module.exports = function(content) {
	const loaderContext = this;
	const done = this.async();
	this.cacheable();

	// const options = loaderUtils.getOptions(this) || {};

	const scripts = [];
	const styles = [];

	content.replace(/<script src=["']([^"']+)["']><\/script>/ig, (res, match) => {
		scripts.push(match);
		return '';
	});

	content.replace(/<link rel=["']stylesheet["'] href=["']([^"']+)["']>/ig, (res, match) => {
		styles.push(match);
		return '';
	});

	const currentModuleName = './' + this.resourcePath.split(path.sep).pop();
	const niceModulePath = this.resourcePath.replace(/\\/g, '/').split('src/app/')[1];

	const newContent = `
		module.exports = {
		  path: '${niceModulePath}',
			default: require(${loaderUtils.stringifyRequest(loaderContext, currentModuleName)}),
			template: require(${loaderUtils.stringifyRequest(loaderContext, '!!raw-loader!' + currentModuleName)}),
			style: ${styles[0] ? `require(${loaderUtils.stringifyRequest(loaderContext, '!!raw-loader!' + styles[0])})` : `undefined`},
			script: ${scripts[0] ? `require(${loaderUtils.stringifyRequest(loaderContext, '!!raw-loader!' + scripts[0])})` : `undefined`},
		};
	`;

	done(null, newContent);
};
