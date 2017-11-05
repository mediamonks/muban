const path = require("path");
const webpack = require('webpack');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const projectRoot = path.resolve(__dirname, '../../../');

function getHbsInlineLoaderConfig() {
  return {
    loader :'hbs-inline-loader',
    options: {
      hbsBuildOptions: {
        removeScript: false,
        removeStyle: false,
        removeTemplate: false,
        hot: true,
      },
      hbsOptions: {
        extensions: ['.hbs', ''],
        partialDirs: [
          path.resolve(projectRoot, 'src/app/component'),
        ],
        ignoreHelpers: true,
        debug: false,
      },
    },
  }
}

function getBabelLoaderConfig() {
  return {
    loader :'babel-loader',
    options: {
      presets: [
        ["env", {
          "targets": {
            "browsers": ['last 3 iOS versions', 'last 3 versions', 'ie >= 10'],
            "uglify": true,
          },
          "modules": false,
          "useBuiltIns": 'entry',
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
        // NOTE: adding helpers will reduce the filesize if you have a lot off classes,
        // but it will increase the main bundle size due to core-js/library/module imports
        // where babel-preset-env includes core-js/modules
        // The ../library/.. versions don't pollute the global scope, this is why babel-runtime
        // uses those for their helpers. But since we already have the global ones loaded,
        // we don't need both.
        // Until there is a fix for this (related: https://github.com/babel/babel/issues/5699)
        // you need to analyze your bundle to see if enabling this gives you an advantage
        // 25kb parsed / 5.9kb (gzip)

        // ['transform-runtime', {
        //   "helpers": true,
        //   "polyfill": false,
        //   "regenerator": false,
        //   "moduleName": "babel-runtime"
        // }],

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
        /src[\/\\]storybook/,
      ],
      use: [
        getBabelLoaderConfig()
      ]
    },
    {
      test: /\.ts$/,
      include: [
        /src[\/\\]app/,
        /src[\/\\]storybook/,
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
  ]
}

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
      use: cssRules,
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

/**
 *
 * @param options
 * @param options.development
 * @param options.buildType
 * @return {*[]}
 */
function getHandlebarsRules(options) {
  return [
    {
      test: /\.hbs/,
      use: [
        {
          loader: 'hbs-build-loader',
          options: {
            removeScript: options.development ? false : options.buildType !== 'code',
            removeStyle: options.development ? false :  options.buildType !== 'code',
            removeTemplate: options.development ? false : options.buildType === 'code',
            hot: options.development,
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
          loader: 'partial-comment-loader',
        },
      ]
    }
  ];
}

function getDirectoryNamedWebpackPlugin() {
  return new DirectoryNamedWebpackPlugin({
    honorIndex: false, // defaults to false

    ignoreFn: function(webpackResolveRequest) {
      return !(webpackResolveRequest.path.includes(path.join('app', 'component')) ||
        webpackResolveRequest.path.includes(path.join('storybook')));

      // custom logic to decide whether request should be ignored
      // return true if request should be ignored, false otherwise
      // return false; // default
    },
  })
}

function addStandalone(webpackConfig, resolve) {
  // read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [(file, stats) => path.extname(file) !== '.json'],
    function (err, files) {
      // files is an array of filename
      files
        .map(f => path.basename(f, '.json'))
        .sort()
        .forEach(file => {
          let page = file;
          let content = require(path.resolve(projectRoot, 'src/data/' + file + '.json'));
          const blockNames = content.blocks.map(b => b.name);

          webpackConfig.entry[page.replace(/\./, '-')] = blockNames
            .map(name => './src/app/component/blocks/' + name + '/' + name + '.hbs')
            .concat(['./src/app/dist.js'])
            .filter((value, index, list) => list.indexOf(value) === index);
        });

      resolve(webpackConfig);
    }
  );
}

function getESLintLoader(enabled) {
  return enabled ? {
    test: /\.js$/,
    enforce: 'pre',
    use: [
      {
        loader: 'eslint-loader'
      },
    ],
    include: [
      path.join(projectRoot, 'src'),
    ],
  } : {};
};

function getTSLintLoader(enabled) {
  return enabled ? {
    test: /\.ts$/,
    enforce: 'pre',
    use: [
      {
        loader: 'tslint-loader',
        options: {
          tsConfigFile: path.resolve(projectRoot, 'tsconfig.json'),
          configFile: path.resolve(projectRoot, '.tslintrc.js'),
          emitErrors: true,
          failOnHint: false,
          typeCheck: true,
        },
      },
    ],
    include: [
      path.join(projectRoot, 'src'),
    ],
    exclude: /node_modules|vendor/
  } : {};
};

function getStyleLintPlugin(enabled) {
  return enabled ? new StyleLintPlugin({
    syntax: 'scss'
  }) : null;
}

module.exports = {
  getBabelLoaderConfig,
  getHbsInlineLoaderConfig,
  getCodeRules,
  getStyleRules,
  getHandlebarsRules,
  getDirectoryNamedWebpackPlugin,
  addStandalone,
  getESLintLoader,
  getTSLintLoader,
  getStyleLintPlugin,
};
