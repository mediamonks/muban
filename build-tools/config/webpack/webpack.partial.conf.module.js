const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const jsonImporter = require('node-sass-json-importer');

const isProd = (config, buildType) => buildType === config.buildTypes.PRODUCTION;
const getCacheLoader = (config, buildType, isDevelopment) =>
  isDevelopment
    ? {
        loader: 'cache-loader',
      }
    : null;

module.exports = ({ config, isDevelopment, buildType, isPartials, isCode }) => webpackConfig => ({
  ...webpackConfig,
  module: {
    rules: [
      /*
       * ------------------------------------------------
       * Handlebars
       * ------------------------------------------------
       */
      {
        test: /\.hbs/,
        use: [
          getCacheLoader(config, buildType, isDevelopment),
          {
            loader: 'hbs-build-loader',
            options: {
              removeScript: isDevelopment ? false : isPartials,
              removeStyle: isDevelopment ? false : isPartials,
              removeTemplate: isDevelopment ? false : isCode,
              hot: isDevelopment,
            },
          },
          {
            loader: 'handlebars-loader',
            options: {
              extensions: ['.hbs', ''],
              partialDirs: [path.resolve(config.projectRoot, 'src/app/component')],
              helperDirs: [path.resolve(config.projectRoot, 'build-tools/handlebars-helpers')],
              debug: false,
              // http://handlebarsjs.com/reference.html#base-compile
              precompileOptions: {
                preventIndent: true,
              },
            },
          },
          {
            loader: 'partial-comment-loader',
          },
        ].filter(Boolean),
      },
      /*
       * ------------------------------------------------
       * JavaScript and TypeScript
       * ------------------------------------------------
       */
      {
        // Allow support for JS as data files
        test: /\.js$/,
        include: [
          /src[\/\\]data/,
          /src[\/\\]app[\/\\]component[\/\\].*data(-.*)\.js/,
        ],
        use: [{ loader: 'json-import-loader' }],
      },
      ...(() => {
        const babelLoaderConfig = {
          loader: 'babel-loader',
          options: {
            cacheDirectory: !isProd(config, buildType),
          },
        };

        return [
          {
            test: /\.js$/,
            enforce: 'pre',
            loader: 'source-map-loader',
          },
          {
            test: /\.js$/,
            include: [
              /src[\/\\]app/,
              /src[\/\\]storybook/,
              // include(),
            ],
            use: [
              getCacheLoader(config, buildType, isDevelopment),
              babelLoaderConfig,
            ].filter(Boolean),
          },
          {
            test: /\.ts$/,
            include: [/src[\/\\]app/, /src[\/\\]storybook/],
            use: [
              getCacheLoader(config, buildType, isDevelopment),
              babelLoaderConfig,
              {
                loader: 'awesome-typescript-loader',
                options: {
                  silent: true,
                },
              },
            ].filter(Boolean),
          },
        ];
      })(),
      /*
       * ------------------------------------------------
       * Styling (scss and css)
       * ------------------------------------------------
       */
      ...(() => {
        function getStyleLoaders(isScss) {
          const loaders = [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: isProd(config, buildType),
                importLoaders: isScss ? 2 : 0,
              },
            },
          ];

          if (isScss) {
            loaders.push(
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                  data: '@import "~seng-scss"; @import "src/app/style/global";',
                  importer: jsonImporter(),
                  includePaths: ['src/app/style'],
                },
              },
            );
          }

          if (isDevelopment) {
            loaders.unshift({
              loader: 'style-loader',
              options: {
                sourceMap: !isProd(config, buildType),
              },
            });
          } else {
            loaders.unshift({
              loader: MiniCssExtractPlugin.loader,
              options: {},
            });
          }

          const cacheLoader = getCacheLoader(config, buildType, isDevelopment);
          if (cacheLoader) {
            loaders.unshift(cacheLoader);
          }

          return loaders;
        }

        return [
          {
            test: /\.scss$/,
            use: isPartials ? [{ loader: 'null-loader' }] : getStyleLoaders(true),
          },
          {
            test: /\.css$/,
            use: getStyleLoaders(false),
          },
        ];
      })(),
      /*
       * ------------------------------------------------
       * Images and SVG
       * ------------------------------------------------
       */
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000,
              name: 'asset/image/[name].' + (isDevelopment ? '' : '[hash:7].') + '[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        oneOf: (() => {
          const svgoLoaderConfig = {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeStyleElement: true },
                { removeComments: true },
                { removeDesc: true },
                { removeUselessDefs: true },
                { removeTitle: true },
                { removeMetadata: true },
                { removeComments: true },
                { cleanupIDs: { remove: true, prefix: '' } },
                { convertColors: { shorthex: false } },
              ],
            },
          };

          return [
            {
              resourceQuery: /inline/,
              use: [{ loader: 'svg-inline-loader' }, svgoLoaderConfig],
            },
            {
              use: [{ loader: 'url-loader' }, svgoLoaderConfig],
            },
          ];
        })(),
      },
      /*
       * ------------------------------------------------
       * Fonts
       * ------------------------------------------------
       */
      {
        test: /\.(eot|svg|ttf|woff2?)(\?.*)?$/,
        include: path.resolve(config.projectRoot, 'src/app/font'),
        loader: 'file-loader',
        options: {
          name: 'asset/font/[name].' + (isDevelopment ? '' : '[hash:7].') + '[ext]',
        },
      },
      /*
       * ------------------------------------------------
       * Other
       * ------------------------------------------------
       */
      {
        type: 'javascript/auto',
        test: /\.modernizrrc$/,
        use: [{ loader: 'modernizr-loader' }, { loader: 'json-loader' }],
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: [{ loader: 'json-import-loader' }, { loader: 'json-loader' }],
      },
      {
        test: /\.yaml$/,
        use: [
          { loader: 'json-import-loader' },
          { loader: 'json-loader' },
          { loader: 'yaml-loader' },
        ],
      },
    ],
  },
});
