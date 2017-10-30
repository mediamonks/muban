const webpack = require('webpack');
const merge = require('webpack-merge');
const { addStandalone } = require('./webpack-helpers');
const config = require('../index');

const {
  getESLintLoader,
  getTSLintLoader,
  getStyleLintPlugin,
} = require('./webpack-helpers');

/**
 * Webpack config to compile production bundle
 */
webpackConfig = merge(require('./webpack.config.code.base'), {
  module: {
    rules: [
      getESLintLoader(config.dev.enableESLintLoader),
      getTSLintLoader(config.dev.enableTSLintLoader),
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
  if (config.standaloneOutput) {
    addStandalone(webpackConfig, resolve);
  } else {
    resolve(webpackConfig);
  }
});

module.exports = configPromise;
