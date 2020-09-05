exports.config = ({ config, isDevelopment }) => webpackConfig => ({
  ...webpackConfig,
  node: {
    fs: 'empty',
  },
});
