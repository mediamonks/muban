const detectPort = require('detect-port');
const config = require('../config');

const { DEVELOPMENT } = config.buildTypes;

/**
 * Build config used in 'yarn build dev'
 * Should be a normal dev build that will be watched to recompile, but without devserver or preview.
 *
 * @type {Promise<T>}
 */
module.exports = module.exports = detectPort(config.devServer.port).then(port => {
  const webpackConfig = require('./webpack.conf.base')(DEVELOPMENT, false, { isCode: true });

  webpackConfig.stats = 'none';

  return webpackConfig;
});
