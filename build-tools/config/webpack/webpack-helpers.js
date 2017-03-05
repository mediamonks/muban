const path = require("path");
const webpack = require('webpack');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

function getBabelLoaderConfig() {
	return {
		loader :'babel-loader',
		options: {
			presets: [
				['es2015', { "modules": false }]
			],
			plugins: [
				'transform-runtime',
				'transform-class-display-name',
				'transform-class-properties',
				'transform-flow-strip-types',
				'transform-object-rest-spread',
				'transform-strict-mode',
				["babel-plugin-transform-builtin-extend", {
					globals: ["Error", "Array"]
				}]
			],
			cacheDirectory: ''
		}
	};
}

function getCodeRules() {
	return [
		{
			test: /\.js$/,
			include: [
				/src\/app/,
			],
			use: [
				getBabelLoaderConfig()
			]
		},
		{
			test: /\.ts$/,
			include: [
				/src\/app/,
			],
			use: [
				getBabelLoaderConfig(),
				{
					loader: 'awesome-typescript-loader'
				}
			]
		}
	]
}

function getHandlebarsRules() {
	return [
		{
			test: /\.hbs/,
			use: [
				{
					loader: path.resolve(__dirname, '../../hbs-style-loader'),
				},
				{
					loader: 'handlebars-loader',
					options: {
						extensions: ['.hbs', ''],
						partialDirs: [
							path.resolve(__dirname, '../../../src/app/component'),
						],
						debug: false
					}
				},
				{
					loader: path.resolve(__dirname, '../../partial-comment-loader'),
				}
			]
		}
	];
}

function getDirectoryNamedWebpackPlugin() {
	return new DirectoryNamedWebpackPlugin({
		honorIndex: false, // defaults to false

		ignoreFn: function(webpackResolveRequest) {
			return !webpackResolveRequest.path.includes('app/component');

			// custom logic to decide whether request should be ignored
			// return true if request should be ignored, false otherwise
			// return false; // default
		},
	})
}

module.exports = {
	getCodeRules,
	getHandlebarsRules,
	getDirectoryNamedWebpackPlugin,
};
