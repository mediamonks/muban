/**
 * Webpack config to compile production code bundle
 */
const path = require("path");
const webpack = require('webpack');
const { getCodeRules } = require('./webpack-helpers');

module.exports = {
	entry: {
		bundle: [
			'./src/app/polyfills.js',
			'./src/app/code.js',
		]
	},
	output: {
		path: path.resolve(__dirname, '../../../build'),
		filename: "[name].js",
		publicPath: '/',
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
		alias: {
			modernizr$: path.resolve(__dirname, "../../../.modernizrrc")
		}
	},
	module: {
		rules: [
			...getCodeRules(),
		]
	},
	plugins: [
	]
};
