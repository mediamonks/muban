module.exports = ({ config, isDevelopment }) => webpackConfig => ({
  ...webpackConfig,
  node: {
    fs: 'empty'
  }
});
