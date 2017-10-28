/**
 * Webpack config to compile production bundle
 */
const path = require('path');
const recursive = require('recursive-readdir');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
  getStyleRules,
  getCodeRules,
  getHandlebarsRules,
  getDirectoryNamedWebpackPlugin,
} = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

const config = {
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
  output: {
    path: path.resolve(projectRoot, 'build'),
    filename: 'asset/[name].js',
    chunkFilename: 'asset/[id].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.hbs', '.ts', '.js', '.json'],
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
        context: path.join(projectRoot, 'src/static/'),
        from: '**/*',
        to: path.resolve(projectRoot, `build/`),
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
};

const configPromise = new Promise(function(resolve, reject) {
  // read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [(file, stats) => path.extname(file) !== '.json'],
    function (err, files) {
      // files is an array of filename
      files
        .map(f => path.basename(f, '.json'))
        .sort()
        .forEach(file => {
          let page = file;
          let content = require(path.resolve(projectRoot, 'src/data/' + file + '.json'));
          const blockNames = content.blocks.map(b => b.name);

          config.entry[page.replace(/\./, '-')] = blockNames
            .map(name => './src/app/component/blocks/' + name + '/' + name + '.hbs')
            .concat(['./src/app/dist.js'])
            .filter((value, index, list) => list.indexOf(value) === index);
        });

      resolve(config);
    }
  );
});

module.exports = configPromise;
