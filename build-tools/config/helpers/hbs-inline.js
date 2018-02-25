const path = require("path");

const projectRoot = path.resolve(__dirname, '../../../');

function getHbsInlineLoaderConfig() {
  return {
    loader :'hbs-inline-loader',
    options: {
      hbsBuildOptions: {
        removeScript: false,
        removeStyle: false,
        removeTemplate: false,
        hot: true,
      },
      hbsOptions: {
        extensions: ['.hbs', ''],
        partialDirs: [
          path.resolve(projectRoot, 'src/app/component'),
        ],
        ignoreHelpers: true,
        debug: false,
      },
    },
  }
}

module.exports = {
  getHbsInlineLoaderConfig,
};
