const path = require('path');
const loaderUtils = require('loader-utils');

/**
 * Processes knockout templates to import script and style files.
 * Registers itself as knockout component based on its filename.
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

  const options = loaderUtils.getOptions(this) || {};

  const componentName = path.basename(loaderContext.resourcePath, '.ko');

  const hot = typeof options.hot === 'undefined' ? true : options.hot;

  const scripts = [];
  const styles = [];

  content = content.replace(/<script src=["']([^"']+)["']><\/script>[\\r\\n]*/ig, (res, match) => {
    scripts.push(match);
    return '';
  });

  content = content.replace(/<link rel=["']stylesheet["'] href=["']([^"']+)["']>[\\r\\n]*/ig, (res, match) => {
    styles.push(match);
    return '';
  });

  let newContent = '';

//   if (scripts.length) {
//     newContent = `
// ${scripts.map(script => `
// var component = require(${loaderUtils.stringifyRequest(loaderContext, script)}).default;
// var registerComponent = require(${loaderUtils.stringifyRequest(loaderContext, 'app/muban/componentUtils.ts')}).registerComponent;
// registerComponent(component);
// ${hot ? `var updateComponent = require(${loaderUtils.stringifyRequest(loaderContext, 'app/muban/componentUtils.ts')}).updateComponent;
//
// // Hot Module Replacement API
// if (module.hot) {
//   module.hot.accept(${loaderUtils.stringifyRequest(loaderContext, script)}, function() {
//     var component = require(${loaderUtils.stringifyRequest(loaderContext, script)}).default;
//     updateComponent(component);
//   });
// }` : ''}
// `).join("\n")}
//
// ` + newContent;
//   }

  if (styles.length) {
    newContent = `
${styles.map(style =>
      `require(${loaderUtils.stringifyRequest(loaderContext, style)});`
    ).join("\n")}
` + newContent;
  }

  newContent = newContent + `
var ko = require('knockout');
if (ko.components.isRegistered('ko-${componentName}')) {
  ko.components.unregister('ko-${componentName}');
}
ko.components.register('ko-${componentName}', {${
  scripts.length ? `viewModel: require(${loaderUtils.stringifyRequest(loaderContext, scripts[0])}).default,` : ''}
  template: '${content.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'
});
console.log('registered: ko-${componentName}');
  `;

  done(null, newContent);
};
