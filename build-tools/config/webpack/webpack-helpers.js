const path = require("path");
const webpack = require('webpack');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const projectRoot = path.resolve(__dirname, '../../../');

function getBabelLoaderConfig() {
	return {
		loader :'babel-loader',
		options: {
			presets: [
				["env", {
					"targets": {
						"browsers": ['last 3 iOS versions', 'last 3 versions', 'ie >= 9'],
						"uglify": true,
					},
					"modules": false,
					"useBuiltIns": true,
					"exclude": [
						// we don't use generators or async/await by default
						"transform-regenerator",

						// we don't use typed arrays by default
						"es6.typed.data-view",
						"es6.typed.int8-array",
						"es6.typed.uint8-array",
						"es6.typed.uint8-clamped-array",
						"es6.typed.int16-array",
						"es6.typed.uint16-array",
						"es6.typed.int32-array",
						"es6.typed.uint32-array",
						"es6.typed.float32-array",
						"es6.typed.float64-array",

						// we don't use reflect by default
						"es6.reflect.apply",
						"es6.reflect.construct",
						"es6.reflect.define-property",
						"es6.reflect.delete-property",
						"es6.reflect.get",
						"es6.reflect.get-own-property-descriptor",
						"es6.reflect.get-prototype-of",
						"es6.reflect.has",
						"es6.reflect.is-extensible",
						"es6.reflect.own-keys",
						"es6.reflect.prevent-extensions",
						"es6.reflect.set",
						"es6.reflect.set-prototype-of",

						// we don't use symbols by default
						"es6.symbol",
						"transform-es2015-typeof-symbol",

						// we don't use advanced math by default
						"es6.math.acosh",
						"es6.math.asinh",
						"es6.math.atanh",
						"es6.math.cbrt",
						"es6.math.clz32",
						"es6.math.cosh",
						"es6.math.expm1",
						"es6.math.fround",
						"es6.math.hypot",
						"es6.math.imul",
						"es6.math.log1p",
						"es6.math.log10",
						"es6.math.log2",
						"es6.math.sign",
						"es6.math.sinh",
						"es6.math.tanh",
						"es6.math.trunc",

						// we don't use maps and sets by default
						"es6.map",
						"es6.set",
						"es6.weak-map",
						"es6.weak-set",
					]
				}]
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
				/src[\/\\]app/,
			],
			use: [
				getBabelLoaderConfig()
			]
		},
		{
			test: /\.ts$/,
			include: [
				/src[\/\\]app/,
			],
			use: [
				getBabelLoaderConfig(),
				{
					loader: 'awesome-typescript-loader',
					options: {
						silent: true
					}
				}
			]
		},
		{
			test: /\.modernizrrc$/,
			use: [
				{ loader: "modernizr-loader" },
				{ loader: "json-loader" }
			]
		},
	]
}

function getStyleRules(development) {
	// used in both dev and dist
	var cssRules = [
		{
			loader: 'css-loader',
			options: {
				sourceMap: true,
				minimize: !development
			}
		},
		{
			loader: 'postcss-loader'
		},
		{
			loader: 'sass-loader',
			options: {
				sourceMap: true,
				data: '@import "~seng-scss"; @import "src/app/style/global";'
			}
		}
	];

	// only in dev
	if (development) {
		cssRules.unshift({
			loader: 'style-loader',
			options: {
				sourceMap: true
			}
		});
	}

	// used in both dev and dist
	const styleRules = [
		{
			test: /.(eot|svg|ttf|woff2?)$/,
			loader: 'file-loader?name=asset/font/[name].[hash].[ext]',
			include: path.resolve(projectRoot, 'src/app/font')
		},
		{
			test: /\.(png|svg|jpg|gif)$/,
			loader: 'url-loader?limit=10000&name=image/[name].[hash].[ext]'
		},
	];

	if (development) {
		// dev uses 'use'
		styleRules.unshift({
			test: /\.scss$/,
			use: cssRules,
		});
	} else {
		// dust uses single ExtractTextPlugin loader
		styleRules.unshift({
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract(cssRules),
		});
	}

	return styleRules;
}

function getHandlebarsRules(development, buildType) {
	return [
		{
			test: /\.hbs/,
			use: [
				{
					loader: path.resolve(__dirname, '../../hbs-build-loader'),
					options: {
						removeScript: development ? false : buildType !== 'code',
						removeStyle: development ? false :  buildType !== 'code',
						removeTemplate: development ? false : buildType === 'code',
						hot: development,
					}
				},
				{
					loader: 'handlebars-loader',
					options: {
						extensions: ['.hbs', ''],
						partialDirs: [
							path.resolve(projectRoot, 'src/app/component'),
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
			return !webpackResolveRequest.path.includes(path.join('app', 'component'));

			// custom logic to decide whether request should be ignored
			// return true if request should be ignored, false otherwise
			// return false; // default
		},
	})
}

module.exports = {
	getCodeRules,
	getStyleRules,
	getHandlebarsRules,
	getDirectoryNamedWebpackPlugin,
};
