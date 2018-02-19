/**
 * Webpack config to compile production bundle
 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const config = require('../index');

const {
  getDirectoryNamedWebpackPlugin,
} = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

const webpackConfig = {
  output: {
    path: config.buildPath,
    filename: 'asset/[name].js',
    chunkFilename: 'asset/[id].js',
    publicPath: config.dist.publicPath,
  },
  resolve: {
    modules: [
      path.resolve(projectRoot, 'src'),
      'node_modules',
    ],
    plugins: [
      getDirectoryNamedWebpackPlugin()
    ],
    alias: {
      modernizr$: path.resolve(projectRoot, '.modernizrrc'),
      TweenLite: path.resolve(projectRoot, 'node_modules/gsap/src/uncompressed/TweenLite'),
    },
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../../loaders'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.modernizrrc$/,
        use: [
          { loader: "modernizr-loader" },
          { loader: "json-loader" }
        ]
      },
      {
        test: /\.json$/,
        use: [
          { loader: "json-partial-loader" },
          { loader: "json-loader" }
        ]
      },
    ]
  },
  plugins: [
    // Friendly webpack errors
    new FriendlyErrorsWebpackPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
  ],
  node: {
    fs: 'empty'
  }
};

module.exports = webpackConfig;
