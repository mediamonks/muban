const path = require('path');

const projectRoot = path.resolve(__dirname, '../../../');

/**
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
        options.development
          ? {
              loader: 'cache-loader',
            }
          : null,
        {
          loader: 'hbs-build-loader',
          options: {
            removeScript: options.development ? false : options.buildType !== 'code',
            removeStyle: options.development ? false : options.buildType !== 'code',
            removeTemplate: options.development ? false : options.buildType === 'code',
            hot: options.development,
          },
        },
        {
          loader: 'handlebars-loader',
          options: {
            extensions: ['.hbs', ''],
            partialDirs: [path.resolve(projectRoot, 'src/app/component')],
            debug: false,
          },
        },
        {
          loader: 'partial-comment-loader',
        },
      ].filter(_ => _),
    },
  ];
}

module.exports = {
  getHandlebarsRules,
};
