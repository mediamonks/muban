// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import', 'prettier'],
  settings: {
    // webpack integration
    'import/resolver': {
      webpack: {
        config: 'build-tools/config/webpack/webpack.conf.base.js',
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'always',
      // hide known extensions that are resolved by webpack
      {
        js: 'never',
        ts: 'never',
        hbs: 'never',
      },
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    // prettier compatibility
    'max-len': ['error', 100],
    'prettier/prettier': [
      'error',
      { singleQuote: true, trailingComma: 'all', printWidth: 100, tabWidth: 2 },
    ],
    // only for use with getter-setters
    'no-underscore-dangle': 0,
    // to correctly work on windows with some tools that create windows line-endings
    // this will be correct by git when committed
    'linebreak-style': 0
  },
};
