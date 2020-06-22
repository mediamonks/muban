const loaderUtils = require('loader-utils');

/**
 * Allows you to import json files from another json file
 */
module.exports = function(content) {
  const loaderContext = this;
  const done = this.async();
  this.cacheable();

  content = content.replace(/"import!(.*?\.json)"/gi, (match, group) => {
    return `require(${loaderUtils.stringifyRequest(loaderContext, group)})`
  });

  done(null, content);
};
