const loaderUtils = require('loader-utils');


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
