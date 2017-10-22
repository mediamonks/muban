/**
 * Webpack config to compile partials (for node build script)
 */
const path = require("path");
const {
  getHandlebarsRules,
  getDirectoryNamedWebpackPlugin,
} = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

module.exports = {
  entry: {
    partials: [
      './src/app/partials.js',
    ]
  },
  output: {
    path: path.resolve(projectRoot, 'build'),
    filename: 'asset/[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/',
  },
  target: 'node',
  resolve: {
    extensions: ['.hbs', '.js', '.json'],
    plugins: [
      getDirectoryNamedWebpackPlugin()
    ],
  // fallback: path.join(__dirname, "helpers")
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
};
