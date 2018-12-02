const path = require('path');

module.exports = ({ config, isDevelopment, buildType, isPartials }) => webpackConfig => {
  let optimization = {
    concatenateModules: true,
    minimize: buildType === config.buildTypes.PRODUCTION,
    // splitChunks: {
    //   chunks: 'all',
    //   cacheGroups: {
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "common",
    //       enforce: true,
    //     },
    //   },
    // },
    runtimeChunk: false
  };

  if (isDevelopment || isPartials) {
    optimization = {
      noEmitOnErrors: true,
    }
  }

  return ({
    ...webpackConfig,
    optimization,
  });
};
