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

module.exports = {
  entry: {
	  partials: [
		  './src/app/partials.js',
	  ]
  },
  output: {
    path: path.resolve(__dirname, '../../../build'),
    filename: "[name].js",
	  libraryTarget: 'commonjs2'
  },
  target: 'node',
  resolve: {
    extensions: [".hbs", ".js", ".json"],
	  plugins: [
		  getDirectoryNamedWebpackPlugin()
	  ]
  //   fallback: path.join(__dirname, "helpers")
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
					    sourceMap: true
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
