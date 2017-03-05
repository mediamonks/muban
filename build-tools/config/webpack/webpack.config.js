/**
 * Webpack config used during development
 */
const fs = require("fs");
const path = require("path");
const webpack = require('webpack');

const {
	getCodeRules,
	getHandlebarsRules,
	getDirectoryNamedWebpackPlugin,
} = require('./webpack-helpers');

module.exports = {
  entry: {
  	main: [
	    // bundle the client for webpack-dev-server
	    // and connect to the provided endpoint
	    'webpack-dev-server/client?http://localhost:9000',
	    // bundle the client for hot reloading
	    // only- means to only hot reload for successful updates
	    'webpack/hot/only-dev-server',
	    'babel-polyfill',
	    './src/app/index.js',
	  ],
  },
  output: {
    path: path.resolve(__dirname, '../../../build'),
    filename: "[name].js",
    publicPath: '/',
  },
  resolve: {
    extensions: [".hbs", ".ts", ".js", ".json"],
    plugins: [
	    getDirectoryNamedWebpackPlugin()
    ]
  //   fallback: path.join(__dirname, "helpers")
  },
  module: {
    rules: [
	    ...getHandlebarsRules(),
	    ...getCodeRules(),
      {
        test: /\.js$/,
	      enforce: "pre",
        loader: "source-map-loader"
      },
	    {
		    test: /\.scss$/,
		    use: [
			    {
				    loader: 'style-loader',
				    options: {
					    sourceMap: true
				    }
			    },
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
		    ]
	    }
    ]
  },
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, "../../../build"),
    publicPath: '/',
    compress: true,
    port: 9000,
    overlay: true,
	  setup(app) {
    	app.use((req, res, next) => {
    		if (req.path.includes('.html')) {
			    res.send(fs.readFileSync(path.resolve(__dirname, "../../../index.html"), 'utf-8'));
		    } else {
    			next();
		    }
	    });
		  app.get('/', function(req, res) {
			  res.send(fs.readFileSync(path.resolve(__dirname, "../../../index.html"), 'utf-8'));
		  });
	  }
  },
  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
  ],
  devtool: 'inline-source-map'
};
