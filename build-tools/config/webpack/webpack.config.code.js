/**
 * Webpack config to compile production code bundle
 */
const path = require("path");
const webpack = require('webpack');
const { getCodeRules } = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

module.exports = {
	entry: {
		bundle: [
			'./src/app/polyfills.js',
			'./src/app/code.js',
		]
	},
	output: {
		path: path.resolve(projectRoot, 'build'),
		filename: "[name].js",
		publicPath: '/',
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
		alias: {
			modernizr$: path.resolve(projectRoot, '.modernizrrc')
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
