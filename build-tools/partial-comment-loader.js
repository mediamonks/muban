const loaderUtils = require('loader-utils');

/**
 * Adds html comments around the partial so it's easily findable
 */
module.exports = function(content) {
	const loaderContext = this;
	const done = this.async();
	this.cacheable();

	const partialName = loaderContext.resolve(loaderContext.context, loaderContext.resourcePath, (err, partialName) => {
		partialName = partialName.split(/src[\\/]app[\\/]/)[1];

		content = `
<!-- partial: ${partialName} -->
${content.replace(/\s+$/, '')}
<!-- / ${partialName} -->
`;

		done(null, content);
	});
};
