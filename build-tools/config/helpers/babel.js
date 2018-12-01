const path = require("path");

function getBabelLoaderConfig() {
  return {
    loader: 'babel-loader',
    options: {
      // cacheDirectory: isDevelopment,
    },
  };
}

module.exports = {
  getBabelLoaderConfig,
};
