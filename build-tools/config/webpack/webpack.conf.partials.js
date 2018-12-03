/**
 * Webpack config to compile partials (for node build script)
 */

const { buildTypes } = require('../config');

module.exports = require('./webpack.conf.base')(buildTypes.PRODUCTION, undefined, { isPartials: true });
