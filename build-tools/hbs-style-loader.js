const loaderUtils = require('loader-utils');

/**
 * Changes the html stylesheet include to a js stylesheet require
 */
module.exports = function(content) {
	const loaderContext = this;
	const done = this.async();
	this.cacheable();

	const requires = [];
	content = content.replace(/<link rel=\\["']stylesheet\\["'] href=\\["']([^"']+)\\["']>[\n]*/i, (res, match) => {
		requires.push(match);
		return '';
	});

	if (requires.length) {
		content = `
///////////////////////////
// hbs-style-loader
// extracted style requires
${requires.map(style => 
	`require(${loaderUtils.stringifyRequest(loaderContext, style)});`
).join("\n")}

// original hbs template
` + content;
	}

	done(null, content);
};
