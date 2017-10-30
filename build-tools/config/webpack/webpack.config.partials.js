/**
 * Webpack config to compile partials (for node build script)
 */
const path = require("path");
const merge = require('webpack-merge');
const { getHandlebarsRules } = require('./webpack-helpers');
const config = require('../index');

const projectRoot = path.resolve(__dirname, '../../../');

module.exports = merge(require('./webpack.config.base'), {
  entry: {
    partials: [
      './src/app/partials.js',
    ]
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  resolve: {
    extensions: ['.hbs', '.js', '.json'],
  },
  module: {
    rules: [
      ...getHandlebarsRules(false, 'partials'),
      {
        test: /\.scss$/,
        use: [{
          loader: 'null-loader',
        }],
      }
    ]
  },
});
