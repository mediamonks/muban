/**
 * Webpack config used to compile partials (for node build script) and css (required from partials)
 */
const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
		filename: "[name].js",
		libraryTarget: 'commonjs2'
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
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract([
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							data: '@import "~seng-scss"; @import "src/app/style/global";'
						}
					}
				])
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'screen.css',
			allChunks : true,
		})
	]
};
