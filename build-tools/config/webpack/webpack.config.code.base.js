/**
 * Webpack config to compile production bundle
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../index');

const {
  getStyleRules,
  getCodeRules,
  getHandlebarsRules,
} = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

module.exports = merge(require('./webpack.config.base'), {
  entry: {
    common: [
      './src/app/polyfills.js',
      'modernizr',
      './src/app/component/layout/app/app.hbs',
    ],
    bundle: [
      './src/app/bundle.js',
      './src/app/dist.js',
    ],
  },
  resolve: {
    extensions: ['.hbs', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      ...getHandlebarsRules(false, 'code'),
      ...getCodeRules(),
      ...getStyleRules(false),
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        // copy files to public root (not versioned)
        context: config.dist.staticPath,
        from: '**/*',
        to: config.buildPath,
      },
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',

      minChunks: function(module){
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new ExtractTextPlugin({
      filename: 'asset/[name].css',
      allChunks : true,
    }),
  ]
});
