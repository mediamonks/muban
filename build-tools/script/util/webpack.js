const webpack = require('webpack');

/**
 * Resolves a webpack config to an object. Config can be a Promise, a function or a plain object
 * @param config
 * @returns {Promise}
 */
function getWebpackConfig(config) {
  return new Promise(resolve => {
    if (config && typeof config.then === 'function') {
      config.then(result => resolve(result));
    } else if (typeof config === 'function') {
      resolve(config());
    } else {
      resolve(config);
    }
  });
}

/**
 * Resolves the config using `getWebpackConfig` and returns the compiler
 * @param config
 * @returns {Promise<any | never>}
 */
function getWebpackCompiler(config) {
  return getWebpackConfig(config).then(config => {
    return webpack(config);
  });
}

/**
 * Resolves the config using `getWebpackConfig` and executes the compiler
 * @param config
 * @param callback
 */
function compileWebpack(config) {
  return getWebpackCompiler(config).then(compiler => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });
  });
}

/**
 * Resolves the config using `getWebpackConfig` and executes the compiler in watch mode with options
 * @param config
 * @param options
 * @param callback
 */
function watchWebpack(config, options, callback) {
  getWebpackCompiler(config)
    .then(compiler => {
      compiler.watch(options || {}, callback);
    })
    .catch(e => callback(e));
}

function handleWebpackComplete(spinner, promise) {
  return promise
    .then(stats => {
      displayWebpackStats(stats);
      spinner.succeed();
    })
    .catch(err => {
      spinner.fail();
      throw err;
    });
}

/**
 * Display webpack stats, from one or multiple compilers. Hide some info during dev mode.
 * @param stats
 * @param dev
 */
function displayWebpackStats(stats, dev) {
  if (Array.isArray(stats.stats)) {
    stats.stats.forEach(s => displayWebpackStats(s, dev));
    return;
  }
  if (dev) {
    return;
  }

  if (stats.hasErrors() && !dev) {
    throw stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
    }) + '\n';
  }
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
    }) + '\n',
  );
}

module.exports = {
  getWebpackConfig: getWebpackConfig,
  getWebpackCompiler: getWebpackCompiler,
  compileWebpack: compileWebpack,
  watchWebpack: watchWebpack,
  displayWebpackStats: displayWebpackStats,
  handleWebpackComplete: handleWebpackComplete,
};
