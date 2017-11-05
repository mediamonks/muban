/**
 * Webpack config to compile production bundle
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const config = require('../index');
const { addStandalone } = require('./webpack-helpers');

const {
  getESLintLoader,
  getTSLintLoader,
  getStyleLintPlugin,
} = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

const webpackConfig = merge(require('./webpack.config.code.base'), {
  module: {
    rules: [
      getESLintLoader(config.dist.enableESLintLoader),
      getTSLintLoader(config.dist.enableTSLintLoader),
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dist.env,
    }),
    new UglifyJSPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsFilename: path.resolve(config.distPath, 'bundlesize-profile.json'),
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
    getStyleLintPlugin(config.dist.enableStyleLintPlugin),
  ].filter(_ => _),
});

const configPromise = new Promise(function(resolve, reject) {
  if (config.standaloneOutput) {
    addStandalone(webpackConfig, resolve);
  } else {
    resolve(webpackConfig);
  }
});

module.exports = configPromise;
