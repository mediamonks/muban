const detectPort = require('detect-port');
const opn = require('opn');
const config = require('../config');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const { DEVELOPMENT } = config.buildTypes;

module.exports = detectPort(config.devServer.port).then(port => {
  const devWebpackConfig = require('./webpack.conf.base')(DEVELOPMENT);

  process.env.PORT = port;
  devWebpackConfig.devServer.port = port;

  const uri = `${config.devServer.useHttps ? 'https' : 'http'}://localhost:${port}`;

  if (config.devServer.autoOpenBrowser) {
    opn(uri).catch(() => {});
  }

  // note: we inject this plugin here because we need access to the port
  devWebpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: ${uri}`,
        ],
      },
    }),
  );

  return devWebpackConfig;
});
