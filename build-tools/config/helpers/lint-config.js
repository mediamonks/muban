const path = require("path");
const StyleLintPlugin = require('stylelint-webpack-plugin');

const projectRoot = path.resolve(__dirname, '../../../');

function getStyleLintPlugin(enabled) {
  return enabled ? new StyleLintPlugin({
    syntax: 'scss'
  }) : null;
}

module.exports = {
  getStyleLintPlugin,
};
