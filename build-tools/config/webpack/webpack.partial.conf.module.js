const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const jsonImporter = require('node-sass-json-importer');

const { getReplaceLoader, getImportLoader, getCacheLoader } = require('./webpack.helpers');

const isProd = (config, buildType) => buildType === config.buildTypes.PRODUCTION;

/*
 * ------------------------------------------------
 * Handlebars
 * ------------------------------------------------
 */
exports.getHbsRules = ({ config, isDevelopment, buildType, isPartials, isCode }) => [
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
];

/*
 * ------------------------------------------------
 * JavaScript and TypeScript
 * ------------------------------------------------
 */
exports.getDataRules = ({ config, buildType }) => [
  {
    // Allow support for JS as data files
    test: /\.js$/,
    include: [/src[\/\\]data/, /src[\/\\]app[\/\\]component[\/\\].*data(-.*)\.js/],
    use: [getImportLoader(config, buildType)],
  },
  {
    test: /\.json$/,
    type: 'javascript/auto',
    use: [getImportLoader(config, buildType), { loader: 'json-loader' }],
  },
  {
    test: /\.yaml$/,
    use: [
      getReplaceLoader(config, buildType),
      getImportLoader(config, buildType),
      { loader: 'js-yaml-loader' },
    ],
  },
];

exports.getScriptRules = ({ config, isDevelopment, buildType }) => {
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
      include: [/src[\/\\]app/],
      use: [getCacheLoader(config, buildType, isDevelopment), babelLoaderConfig].filter(Boolean),
    },
    {
      test: /\.ts$/,
      include: [/src[\/\\]app/],
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
};

exports.getSvgRules = () => [
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
];

/*
 * ------------------------------------------------
 * Styling (scss and css)
 * ------------------------------------------------
 */
exports.getStyleRules = ({ config, isDevelopment, buildType, isPartials }) => {
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
      const extraVars = Object.keys(config.env[buildType]).reduce(
        (acc, envName) =>
          `${acc} $${envName}: "${config.env[buildType][envName].replace(/"/gi, '')}";`,
        '',
      );

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
            additionalData: `@import "~seng-scss"; ${extraVars} @import "src/app/style/global";`,
            sourceMap: true,
            sassOptions: {
              importer: jsonImporter(),
            },
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
};

exports.config = configOptions => webpackConfig => {
  const { config, isDevelopment, buildType, isPartials } = configOptions;
  return {
    ...webpackConfig,
    module: {
      rules: [
        ...exports.getHbsRules(configOptions),
        ...exports.getDataRules(configOptions),
        ...exports.getScriptRules(configOptions),
        ...exports.getStyleRules(configOptions),
        /*
         * ------------------------------------------------
         * Images
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
        ...exports.getSvgRules(configOptions),
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
      ],
    },
  };
};
