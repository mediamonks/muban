const path = require('path');
const projectRoot = path.resolve(__dirname, '../../../');

const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

module.exports = ({ config, isDevelopment }) => webpackConfig => ({
  ...webpackConfig,
  resolve: {
    extensions: ['.hbs', '.ts', '.js', '.yaml', '.json'],
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

});
