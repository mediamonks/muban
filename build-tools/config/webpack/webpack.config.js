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

const {
  getESLintLoader,
  getTSLintLoader,
  getStyleLintPlugin,
} = require('../helpers/lint-config');

const projectRoot = path.resolve(__dirname, '../../../');
const port = process.env.PORT || config.dev.port;

module.exports = merge(require('./webpack.config.base'), {
  mode: 'development',
  entry: {
    main: [
      './src/app/polyfills.js',
      './src/app/bootstrap.dev.ts',
    ],
  },
  output: {
    publicPath: config.dev.publicPath,
  },
  resolve: {
    extensions: ['.hbs', '.ts', '.js', '.yaml', '.json'],
  },
  optimization: {
    noEmitOnErrors: true,
  },
  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    // Friendly webpack errors
    new FriendlyErrorsWebpackPlugin(),

    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),

    getStyleLintPlugin(config.dev.enableStyleLintPlugin),
  ].filter(_ => _),
  module: {
    rules: [
      ...getHandlebarsRules({ development: true }),
      ...getCodeRules(),
      ...getStyleRules({ development: true }),
      getESLintLoader(config.dev.enableESLintLoader),
      getTSLintLoader(config.dev.enableTSLintLoader),
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
    ]
  },
  devServer: {
    hotOnly: true,
    publicPath: config.dev.publicPath,
    contentBase: config.dev.staticPath,
    compress: true,
    host: '0.0.0.0',
    port,
    disableHostCheck: true,
    overlay: true,
    noInfo: true,
    before(app) {
      // render basic default index.html for all html files (path will be picked by JS)
      app.use((req, res, next) => {
        if (req.path.includes('.html')) {
          res.send(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
        } else {
          next();
        }
      });

      // also render index.html on /
      app.get('/', function(req, res) {
        res.send(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
      });
    },
    https: (config.useHttps ? {
      key: fs.readFileSync(path.resolve(projectRoot, 'build-tools/ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(projectRoot, 'build-tools/ssl/cert.pem')),
      // ca: fs.readFileSync(path.resolve(projectRoot, 'build-tools/ssl/cert.crt')),
    } : false),
  },
  devtool: 'eval-source-map'
});
