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

	let newContent = '';
	let match;
	let index = 0;
	const regex = /(["'`])<hbs>([\s\S]*?)<\/hbs>\1/gi;
	do {
		match = regex.exec(content);
		if (match && index === parseInt(options.target, 10)) {
			newContent = match[2].replace(/\\"/gi, '"').replace(/^\n/, '');

			// strip leading tabs
			const match2 = /^([\t]*)/gi.exec(newContent);

			if (match2 && match2[0].length) {
				newContent = newContent.replace(new RegExp(`^\\t{${match2[0].length}}`, 'gmi'), '');
			}

			done(null, newContent);
			return;
		}
		++index;
	} while (match);

	done(null, newContent);
};
