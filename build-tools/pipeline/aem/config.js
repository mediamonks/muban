const baseConfig = require('../base/config');
const path = require('path');

const assetPath = path.join(baseConfig.projectRoot, 'src/asset');
const aemSharedPath = 'aem/clientlibs/clientlibs-shared/bundle/clientlibs/';
const rawAssetPath = 'aem/clientlibs/clientlibs-site/resources/';
const proxyAssetPath = 'etc.clientlibs/project-name/clientlibs/clientlibs-site/resources/';
const buildAssetPath = path.join(baseConfig.buildPath, rawAssetPath);
const buildProxyAssetPath = path.join(baseConfig.buildPath, proxyAssetPath);

module.exports = Object.assign(
  baseConfig,
  {
    buildAssetPath,
    proxyAssetPath,
    buildProxyAssetPath,
    assetPath,
    rawAssetPath,
    aemSharedPath,
  },
  {
    dist: {
      ...baseConfig.dist,
      /* settings for component building */
      componentRootPath: path.join(baseConfig.projectRoot, 'src/app/component'),
      componentGlobPath: '/**/*.+(ts|scss)',
      componentGlobIgnore: ['**/Abstract*', '**/layout/**/*', '**/_*', '**/icon/**/*']
    }
  }
);
