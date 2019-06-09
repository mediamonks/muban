module.exports = function(api) {
  api.cache(!api.env("production"));

  return {
    presets: [
      ["@babel/preset-env", {
        "targets": {
          "browsers": ['last 3 iOS versions', 'last 3 versions', 'ie >= 10'],
        },
        "modules": false,
        "useBuiltIns": 'entry',

        "exclude": [
          // we don't use generators or async/await by default
          "transform-regenerator",

          // we don't use typed arrays by default
          "es6.typed.*",

          // we don't use reflect by default
          "es6.reflect.*",

          // we don't use symbols by default
          "es6.symbol",

          // we don't use advanced regexps by default
          "es6.regexp.*",

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

          // Funky unused HTML string methods
          "es6.string.anchor",
          "es6.string.big",
          "es6.string.blink",
          "es6.string.bold",
          "es6.string.code-point-at",
          "es6.string.fixed",
          "es6.string.fontcolor",
          "es6.string.fontsize",
          "es6.string.from-code-point",
          "es6.string.italics",
          "es6.string.iterator",
          "es6.string.link",
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

      // ['@babel/plugin-transform-runtime', {
      //   "helpers": true,
      //   "corejs": 2,
      //   "regenerator": false
      // }],

      "lodash",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-syntax-import-meta",
      ["@babel/plugin-proposal-class-properties", { "loose": false }],
      "@babel/plugin-proposal-json-strings",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      "@babel/plugin-proposal-function-sent",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-throw-expressions",

      // needed to register muban-components
      "@babel/plugin-transform-react-display-name"
    ]
  };
};
