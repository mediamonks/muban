module.exports = function(api) {
  api.cache(!api.env('production'));

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['last 3 iOS versions', 'last 3 versions', 'ie >= 11'],
          },
          modules: false,
          useBuiltIns: 'entry',
          corejs: { version: 3, proposals: true },

          exclude: [
            // we don't use generators or async/await by default
            // but now we do
            // 'transform-regenerator',

            // we don't use maps and sets by default
            // but now we do
            // 'es.map',
            // 'es.set',
            // 'esnext.map.*',
            // 'esnext.set.*',
            // // weak versions
            // 'es.weak.*',
            // 'esnext.weak-map.*',
            // 'esnext.weak-set.*',

            // exclude all symbol stuff, except the basic symbol definition
            'es.symbol.async-iterator',
            'es.symbol.description',
            'es.symbol.has-instance',
            'es.symbol.is-concat-spreadable',
            'es.symbol.iterator',
            // 'es.symbol',
            'es.symbol.match',
            'es.symbol.match-all',
            'es.symbol.replace',
            'es.symbol.search',
            'es.symbol.species',
            'es.symbol.split',
            'es.symbol.to-primitive',
            'es.symbol.to-string-tag',
            'es.symbol.unscopables',

            'esnext.symbol.*',
            'esnext.composite-symbol',

            'es.typed.*',

            'es.reflect.*',
            'esnext.reflect.*',

            'es.math.*',
            'esnext.math.*',

            'es.array-buffer.*',
            'es.data-view',

            'esnext.observable',

            // Funky unused HTML string methods
            'es.string.anchor',
            'es.string.big',
            'es.string.blink',
            'es.string.bold',
            'es.string.code-point-at',
            'es.string.fixed',
            'es.string.fontcolor',
            'es.string.fontsize',
            'es.string.from-code-point',
            'es.string.italics',
            'es.string.iterator',
            'es.string.link',
          ],
        },
      ],
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

      'lodash',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      '@babel/plugin-proposal-json-strings',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',

      // needed to register muban-components
      '@babel/plugin-transform-react-display-name',
    ],
  };
};
