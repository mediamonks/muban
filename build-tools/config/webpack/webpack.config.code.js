/**
 * Webpack config to compile production code bundle
 */
const path = require("path");
const webpack = require('webpack');
const { getCodeRules } = require('./webpack-helpers');

module.exports = {
	entry: {
		bundle: [
			'babel-polyfill',
			'./src/app/code.js',
		]
	},
	output: {
		path: path.resolve(__dirname, '../../../build'),
		filename: "[name].js",
		publicPath: '/',
	},
	resolve: {
		extensions: [".ts", ".js", ".json"]
	},
	module: {
		rules: [
			...getCodeRules(),
		]
	},
	plugins: [
	]
};
