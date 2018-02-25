const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const projectRoot = path.resolve(__dirname, '../../../');

/**
 * @param options
 * @param options.development
 * @return {*[]}
 */
function getStyleRules(options) {
  // used in both dev and dist
  var cssRules = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        minimize: !options.development
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        data: '@import "~seng-scss"; @import "src/app/style/global";'
      }
    }
  ];

  if (options.development) {
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
      include: path.resolve(projectRoot, 'src/app/font'),
      loader: 'file-loader',
      options: {
        name: 'asset/font/[name].' + (options.development ? '' : '[hash:7].') + '[ext]',
      },
    },
    {
      test: /\.(png|jpe?g|gif)$/,
      loaders: [
        {
          loader: 'url-loader',
          options: {
            limit: 2000,
            name: 'asset/image/[name].' + (options.development ? '' : '[hash:7].') + '[ext]',
          },
        },
      ],
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-inline-loader',
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeStyleElement: true },
              { removeComments: true },
              { removeDesc: true },
              { removeUselessDefs: true },
              { removeTitle: true, },
              { removeMetadata: true, },
              { removeComments: true, },
              { cleanupIDs: { remove: true, prefix: '' } },
              { convertColors: { shorthex: false } },
            ],
          },
        },
      ],
    },
  ];

  if (options.development) {
    // dev uses 'use'
    styleRules.unshift({
      test: /\.scss$/,
      use: [
        {
          loader: 'cache-loader'
        },
        ...cssRules
      ],
    });
    styleRules.unshift({
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          minimize: !options.development,
        },
      }],
    });
  } else {
    // dust uses single ExtractTextPlugin loader
    styleRules.unshift({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(cssRules),
    });
    styleRules.unshift({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract([{
        loader: 'css-loader',
        options: {
          sourceMap: true,
          minimize: !options.development,
        },
      }]),
    });
  }

  return styleRules;
}

module.exports = {
  getStyleRules,
};
