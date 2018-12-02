const { compose } = require('./webpack.helpers');
const config = require('../config');

const { DEVELOPMENT, PRODUCTION } = config.buildTypes;

/*
 * We have multiple ways of defining which configuration to use, based on the following parameters:
 *
 * - buildType
 * This is defined by an enum, currently either DEVELOPMENT or PRODUCTION
 * This type sets specific process.env fields, and makes a distinction for some configuration:
 * With PRODUCTION, all minification-like stuff is turned on.
 * Some configs that you expect to use `isDevelopment` are actually checking the DEVELOPMENT type.
 *
 * - isDevelopment
 * This is mainly for the webpack-dev-server mode, where all funky features like HMR are turned in.
 *
 * - options.isPartials
 * Tweak settings for the partials output type. These include only the precompiled hbs templates,
 * no other code, styles or assets are needed here.
 *
 * - options.isCode
 * This is for the code build, where everything except the hbs templates are needed.
 */

// note: we pass a default buildType here so this file can be loaded directly from .eslintrc.js
module.exports = (buildType = DEVELOPMENT, isDevelopment, options = {}) => {
  const generator = compose(
    [
      require('./webpack.partial.conf.devServer'),
      require('./webpack.partial.conf.entry'),
      require('./webpack.partial.conf.module'),
      require('./webpack.partial.conf.node'),
      require('./webpack.partial.conf.optimization'),
      require('./webpack.partial.conf.output'),
      require('./webpack.partial.conf.plugins'),
      require('./webpack.partial.conf.resolve'),
    ].map(module =>
      module({
        isDevelopment:
          typeof isDevelopment === 'undefined' ? buildType === DEVELOPMENT : isDevelopment,
        buildType,
        config,
        ...options,
      }),
    ),
  );

  return generator({
    // single configuration properties go here
    // objects go into a separate file (e.g. webpack.partial.conf.entry.js)
    mode: buildType === PRODUCTION ? 'production' : 'development',
    devtool: isDevelopment ? 'cheap-module-eval-source-map' : false,
    target: options.isPartials ? 'node' : undefined,
  });
};
