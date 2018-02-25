/**
 * Webpack config used during development
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

const config = require('../index');

const { getStyleRules } = require('../helpers/style-rules');
const { getCodeRules } = require('../helpers/code-rules');
const { getHandlebarsRules } = require('../helpers/handlebars-rules');

const projectRoot = path.resolve(__dirname, '../../../');
const port = process.env.PORT || config.storybook.port;

module.exports = merge(require('./webpack.config.base'), {
  output: {
    path: config.storybook.buildPath,
    publicPath: config.storybook.publicPath,
  },
  module: {
    rules: [
      ...getHandlebarsRules({ development: true }),
      ...getCodeRules(),
      ...getStyleRules({ development: false }),
    ]
  },
  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      'process.env': config.dist.env,
    }),

    new CopyWebpackPlugin([
      {
        // copy files to public root (not versioned)
        context: config.storybook.staticPath,
        from: '**/*',
        to: config.storybook.buildPath,
      },
    ]),

    new ExtractTextPlugin({
      filename: 'asset/[name].css',
      allChunks : true,
    }),

    new ImageminPlugin({
      disable: !config.dist.enableImageOptimization,
      svgo: null,
      gifsicle: null,
      jpegtran: null,
      optipng: !config.dist.enablePNGQuant ? { optimizationLevel: 3 } : null,
      pngquant: config.dist.enablePNGQuant ? { quality: '65' } : null,
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true
        })
      ],
    }),
  ].filter(_ => _),
});
