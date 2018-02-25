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
const { getCodeRules } = require('../helpers/code-rules');
const { getHandlebarsRules } = require('../helpers/handlebars-rules');

const projectRoot = path.resolve(__dirname, '../../../');

module.exports = merge(require('./webpack.config.base'), {
  entry: {
    common: [
      './src/app/polyfills.js',
      'modernizr',
      './src/app/component/layout/app/app.hbs',
    ],
    bundle: [
      './src/app/bootstrap.dist.ts',
    ],
  },
  resolve: {
    extensions: ['.hbs', '.ts', '.js', '.yaml', '.json'],
  },
  module: {
    rules: [
      ...getHandlebarsRules({ development: false, buildType: 'code'}),
      ...getCodeRules(),
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
        // copy over hbs templates
        context: path.resolve(projectRoot, 'src/app/component'),
        from: '**/*.hbs',
        to: path.resolve(config.distPath, 'templates'),
      },
      (config.convertTemplates.convertTo ? {
        // convert hbs to htl templates
        context: path.resolve(projectRoot, 'src/app/component'),
        from: '**/*.hbs',
        to: path.resolve(config.distPath, 'templates') + '/[path]/[name].' + config.convertTemplates.extension,
        toType: 'template',
        transform (content) {
          // convert to target template
          let template = convert(content.toString('utf8'), config.convertTemplates.convertTo);

          // remove script/style includes

          template = template.replace(/<script src=["']([^"']+)["']><\/script>[\r\n]*/ig, '');
          template = template.replace(/<link rel=["']stylesheet["'] href=["']([^"']+)["']>[\r\n]*/ig, '');

          // fix partial imports by adding additional folder that is not needed for webpack
          template = template.replace(/\/([\w-]+)(\.html(:?\.twig)?)"/gi, '/$1/$1$2"');

          return template;

        },
      } : null),
      {
        // copy over component json
        context: path.resolve(projectRoot, 'src/app/component'),
        from: '**/*.json',
        to: path.resolve(config.distPath, 'data/component'),
      },
      {
        // copy over data json
        context: path.resolve(projectRoot, 'src/data'),
        from: '**/*.json',
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
