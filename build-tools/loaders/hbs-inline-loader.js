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

	const options = loaderUtils.getOptions(this);

	const currentModuleName = './' + this.resourcePath.split(path.sep).pop();

	const hbsBuildLoaderParams = JSON.stringify(options.hbsBuildOptions);
	const hbsLoaderParams = JSON.stringify(options.hbsOptions);

	let index = 0;
	let newContent = content.replace(
		/(["'])<hbs>(.*?)<\/hbs>\1/gi,
		(match, quote, template) => {

			// strip leading tabs
			let content = template.replace(/(^\\n|(\\n|\\t)+$)/g, '');
			const match2 = /^([\\t]*)/gi.exec(content);

			if (match2 && match2[0].length) {
				content = content.replace(new RegExp(`(\\\\n|^)(\\\\t){${match2[0].length / 2}}`, 'gmi'), '$1');
			}

			return `{
				compiled: require('!!hbs-build-loader?${hbsBuildLoaderParams}!handlebars-loader?${hbsLoaderParams}!extract-template-loader?target=${index++}!${currentModuleName}'),
				raw: '${content.replace(/'/gi, '\\\'')}',
			}`;
		}
	);

	done(null, newContent);
};
