const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('../index');

const { addStandalone } = require('../helpers/standalone');

const {
  getStyleLintPlugin,
} = require('../helpers/lint-config');

/**
 * Webpack config to compile production bundle
 */
webpackConfig = merge(require('./webpack.config.code.base'), {
  module: {
    rules: [
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    getStyleLintPlugin(config.dev.enableStyleLintPlugin),
  ].filter(_ => _),
  devtool: 'eval-source-map'
});

const configPromise = new Promise(function(resolve, reject) {
  addStandalone(webpackConfig, resolve);
});

module.exports = configPromise;
