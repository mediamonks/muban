// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['@mediamonks'],
  settings: {
    // webpack integration
    'import/resolver': {
      webpack: {
        config: 'build-tools/config/webpack/webpack.conf.base.js',
      },
    },
  },
};
