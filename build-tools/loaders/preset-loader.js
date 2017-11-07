const loaderUtils = require('loader-utils');

/**
 * Adds html comments around the partial so it's easily findable
 */
module.exports = function(content) {
  const loaderContext = this;
  const done = this.async();
  this.cacheable();

  const toReplace = [];
  let loadCount = 0;
  let syncDone = false;

  const finish = (done) => {
    toReplace.forEach(r => {
      content = content.replace(r.match, `require(${loaderUtils.stringifyRequest(loaderContext, 'hbs-source-loader!' + r.result)})`);
    });
    done(null, content);
  };

  content.replace(/require\(['"]([^)]+)['"]\)/gi, (match, g1) => {
    ++loadCount;
    loaderContext.resolve(loaderContext.context, g1, (err, result) => {
      --loadCount;
      if (/\.hbs$/i.test(result)) {
        // these are imports to .hbs files, rewrite them to include name and sources
        toReplace.push({
          match,
          result,
        })
      }
      if (loadCount === 0 && syncDone) {
        finish(done);
      }
    });
    return match;
  });
  syncDone = true;

  if (loadCount === 0) {
    if (toReplace.length !== 0) {
      console.log(' ------ NOOOOOOOOO ------', loaderContext.context)
    }
    console.log('normal exit', loaderContext.context);
    done(null, content);
  }
};
