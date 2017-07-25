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

	const removeScript = typeof options.removeScript === 'undefined' ? false : options.removeScript;
	const removeStyle = typeof options.removeStyle === 'undefined' ? false : options.removeStyle;
	const removeTemplate = typeof options.removeTemplate === 'undefined' ? false : options.removeTemplate;
	const hot = typeof options.hot === 'undefined' ? true : options.hot;

	const scripts = [];
	const styles = [];

	content = content.replace(/<script src=\\["']([^"']+)\\["']><\/script>[\\r\\n]*/ig, (res, match) => {
		scripts.push(match);
		return '';
	});

	content = content.replace(/<link rel=\\["']stylesheet\\["'] href=\\["']([^"']+)\\["']>[\\r\\n]*/ig, (res, match) => {
		styles.push(match);
		return '';
	});

	let newContent = '';

	if (scripts.length && !removeScript) {
		newContent = `
${scripts.map(script => `
var component = require(${loaderUtils.stringifyRequest(loaderContext, script)}).default;
var registerComponent = require(${loaderUtils.stringifyRequest(loaderContext, 'app/component/components.ts')}).registerComponent;
registerComponent(component);
${hot ? `var updateComponent = require(${loaderUtils.stringifyRequest(loaderContext, 'app/component/components.ts')}).updateComponent;

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept(${loaderUtils.stringifyRequest(loaderContext, script)}, function() {
		var component = require(${loaderUtils.stringifyRequest(loaderContext, script)}).default;
		updateComponent(component);
	});
}` : ''}
`).join("\n")}

` + newContent;
	}

	if (styles.length && !removeStyle) {
		newContent = `
${styles.map(style =>
			`require(${loaderUtils.stringifyRequest(loaderContext, style)});`
		).join("\n")}
` + newContent;
	}

	if (!removeTemplate) {
		newContent = newContent + `
` + content;
	} else {
		// only keep requires from original template
		newContent = newContent + `
// hbs partial requires
` + content.split(/(require\("[^"]+"\))/gmi)
			.filter((r, i) => (
				(i % 2) == 1 && r.endsWith('.hbs")')
			)).join("\n")
	}

	done(null, newContent);
};
