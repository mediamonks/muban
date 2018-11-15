/**
 * Webpack config to compile production bundle
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../index');
const convert = require('muban-convert-hbs').default;


const { getStyleRules } = require('../helpers/style-rules');
const { getHandlebarsRules } = require('../helpers/handlebars-rules');

const projectRoot = path.resolve(__dirname, '../../../');

function cleanupTemplate(template) {
  // remove script/style includes
  template = template.replace(/<script src=["']([^"']+)["']><\/script>[\r\n]*/ig, '');
  template = template.replace(/<link rel=["']stylesheet["'] href=["'][^"']+["']>[\r\n]*/ig, '');

  // fix partial imports by adding additional folder that is not needed for webpack
  template = template.replace(/{{> ([\w-/]+)\/([\w-]+)/gi, '{{> $1/$2/$2');

  return template;
}

module.exports = merge(require('./webpack.config.base'), {
  entry: {
    common: [
      './src/app/component/layout/app/app.hbs',
    ],
    preview: [
      './src/app/component/layout/index/index.hbs',
    ],
  },
  resolve: {
    extensions: ['.hbs', '.yaml', '.json', '.js'],
  },
  module: {
    rules: [
      ...getHandlebarsRules({ development: false, buildType: 'code'}),
      ...getStyleRules({ development: false }),
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
      {
        // copy over hbs templates and remove muban-specific imports and partial paths
        context: path.resolve(projectRoot, 'src/app/component'),
        from: '**/*.hbs',
        to: path.resolve(config.distPath, 'templates') + '/[path]/[name].hbs',
        toType: 'template',
        transform (content) {
          return cleanupTemplate(content.toString('utf8'))
        },
      },
      // {
      //   // add support for TWIG/HBS drupal integration, generates a twig file that includes a hbs partial
      //   context: path.resolve(projectRoot, 'src/app/component'),
      //   from: '**/*.hbs',
      //   to: path.resolve(config.distPath, 'templates') + '/[path]/[name].html.twig',
      //   toType: 'template',
      //   transform (content, path) {
      //     return `{{ handlebars('${path.split(/[/\\]/gi).pop()}', data) }}`;
      //   },
      // },
      {
        // copy over component json
        context: path.resolve(projectRoot, 'src/app/component'),
        from: '**/*.{yaml,json}',
        to: path.resolve(config.distPath, 'templates'),
      },
      {
        // copy over data json
        context: path.resolve(projectRoot, 'src/data'),
        from: '**/*.{yaml,json}',
        to: path.resolve(config.distPath, 'data'),
      },
      {
        // copy over readme
        context: path.resolve(projectRoot, 'docs'),
        from: 'dist-implementation-guide.md',
        to: path.resolve(config.distPath),
      },
    ].filter(_ => _)),
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
