const { buildTypes } = require('../config');

module.exports = require('./webpack.conf.base')(buildTypes.PRODUCTION, undefined, { isCode: true });

// TODO: add standalone support
// const { addStandalone } = require('../helpers/standalone');
// const configPromise = new Promise(function(resolve, reject) {
//   // if (config.standaloneOutput) {
//   //   addStandalone(webpackConfigs, resolve);
//   // } else {
//   resolve([webpackConfig, require('./webpack.config.code.base')[1]]);
//   // }
// });
