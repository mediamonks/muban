/**
 * Webpack config used during development
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
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
  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      'process.env': config.dist.env,
    }),
  ].filter(_ => _),
  module: {
    rules: [
      ...getHandlebarsRules({ development: true }),
      ...getCodeRules(),
      ...getStyleRules({ development: true }),
    ]
  },
  devServer: {
    hotOnly: true,
    publicPath: config.storybook.publicPath,
    contentBase: config.storybook.staticPath,
    compress: true,
    host: '0.0.0.0',
    port,
    disableHostCheck: true,
    overlay: true,
    noInfo: true,
    before(app) {
      // render basic default index.html for all html files (path will be picked by JS)
      app.use((req, res, next) => {
        if (req.path.includes('storybook.html')) {
          res.send(fs.readFileSync(path.resolve(projectRoot, 'src/storybook/storybook.html'), 'utf-8'));
        } else if (req.path.includes('story.html')) {
          res.send(fs.readFileSync(path.resolve(projectRoot, 'src/storybook/story.html'), 'utf-8'));
        } else {
          next();
        }
      });

      // also render index.html on /
      app.get('/', function(req, res) {
        res.send(fs.readFileSync(path.resolve(projectRoot, 'src/storybook/storybook.html'), 'utf-8'));
      });
    },
    https: (config.useHttps ? {
      key: fs.readFileSync(path.resolve(projectRoot, 'build-tools/ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(projectRoot, 'build-tools/ssl/cert.pem')),
    } : false),
  },
  devtool: 'eval-source-map'
});
