const path = require('path');

exports.config = ({ config, isDevelopment, isPartials }) => webpackConfig => {
  const output = {
    path: config.buildPath,
    filename: 'asset/[name].js',
    chunkFilename: 'asset/[id].js',
    publicPath: isDevelopment ? '/' : config.dist.publicPath,
  };

  if (isPartials) {
    output.libraryTarget = 'commonjs2';
  }

  return {
    ...webpackConfig,
    output,
  };
};
