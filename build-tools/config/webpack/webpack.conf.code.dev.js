const detectPort = require('detect-port');
const opn = require('opn');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const config = require('../config');
const previewServer = require('../../script/preview-server');

const { DEVELOPMENT } = config.buildTypes;

module.exports = module.exports = detectPort(config.devServer.port).then(port => {
  const webpackConfig = require('./webpack.conf.base')(DEVELOPMENT, false, { isCode: true });

  process.env.PORT = port;

  // TODO: start preview server
  previewServer();

  if (config.devServer.autoOpenBrowser) {
    opn(`${config.devServer.useHttps ? 'https' : 'http'}://localhost:${port}`).catch(() => {});
  }

  // note: we inject this plugin here because we need access to the port
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: ${
            config.devServer.useHttps ? 'https' : 'http'
            }://localhost:${port}`,
        ],
      },
    }),
  );

  webpackConfig.stats = 'none';


  return webpackConfig;
});
