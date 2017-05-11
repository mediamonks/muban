/**
 * Webpack config used to compile partials (for node build script) and css (required from partials)
 */
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {
	getStyleRules,
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
		filename: "asset/[name].js",
		libraryTarget: 'commonjs2',
		publicPath: '/'
	},
	target: 'node',
	resolve: {
		extensions: [".hbs", ".js", ".json"],
		plugins: [
			getDirectoryNamedWebpackPlugin()
		]
	// fallback: path.join(__dirname, "helpers")
	},
	module: {
		rules: [
			...getHandlebarsRules(),
			...getStyleRules(false),
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'asset/screen.css',
			allChunks : true,
		})
	]
};
