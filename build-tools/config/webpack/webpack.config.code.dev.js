const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('../index');

const { addStandalone } = require('../helpers/standalone');

const {
  getESLintLoader,
  getTSLintLoader,
  getStyleLintPlugin,
} = require('../helpers/lint-config');

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
  optimization: {
    concatenateModules: true,
    minimize: false,
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    getStyleLintPlugin(config.dev.enableStyleLintPlugin),

    // Friendly webpack errors
    new FriendlyErrorsWebpackPlugin(),
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
