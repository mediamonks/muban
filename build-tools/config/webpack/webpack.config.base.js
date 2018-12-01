/**
 * Webpack config to compile production bundle
 */
const path = require('path');
const webpack = require('webpack');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const config = require('../index');

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
      new DirectoryNamedWebpackPlugin({
        honorIndex: false, // defaults to false

        ignoreFn: function(webpackResolveRequest) {
          return !(webpackResolveRequest.path.includes(path.join('app', 'component')) ||
            webpackResolveRequest.path.includes(path.join('storybook')));

          // custom logic to decide whether request should be ignored
          // return true if request should be ignored, false otherwise
          // return false; // default
        },
      })
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
      path.resolve(projectRoot, 'node_modules/muban-core/loaders'),
    ],
  },
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.modernizrrc$/,
        use: [
          { loader: "modernizr-loader" },
          { loader: "json-loader" }
        ]
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: [
          { loader: "json-import-loader" },
          { loader: "json-loader" }
        ]
      },
      {
        test: /\.yaml$/,
        use: [
          { loader: "json-import-loader" },
          { loader: "json-loader" },
          { loader: "yaml-loader" }
        ]
      },
    ]
  },
  plugins: [
    // prints more readable module names in the browser console on HMR updates
    // new webpack.NamedModulesPlugin(),
  ],
  node: {
    fs: 'empty'
  }
};

module.exports = webpackConfig;
