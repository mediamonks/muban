const path = require("path");
const StyleLintPlugin = require('stylelint-webpack-plugin');

const projectRoot = path.resolve(__dirname, '../../../');

function getESLintLoader(enabled) {
  return enabled ? {
    test: /\.js$/,
    enforce: 'pre',
    use: [
      {
        loader: 'eslint-loader'
      },
    ],
    include: [
      path.join(projectRoot, 'src'),
    ],
  } : {};
};

function getTSLintLoader(enabled) {
  return enabled ? {
    test: /\.ts$/,
    enforce: 'pre',
    use: [
      {
        loader: 'tslint-loader',
        options: {
          tsConfigFile: path.resolve(projectRoot, 'tsconfig.json'),
          configFile: path.resolve(projectRoot, '.tslintrc.js'),
          emitErrors: true,
          failOnHint: false,
          typeCheck: true,
        },
      },
    ],
    include: [
      path.join(projectRoot, 'src'),
    ],
    exclude: /node_modules|vendor/
  } : {};
};

function getStyleLintPlugin(enabled) {
  return enabled ? new StyleLintPlugin({
    syntax: 'scss'
  }) : null;
}

module.exports = {
  getESLintLoader,
  getTSLintLoader,
  getStyleLintPlugin,
};
