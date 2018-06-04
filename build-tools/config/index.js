const path = require('path');
const argv = require('yargs').argv;

const projectRoot = path.resolve(__dirname, '../../');

/*
Change the publicPath if site is running in a subfolder on the server.

It's also possible to override this publicPath by using:
yarn build --publicPath=/m/muban-site/

When you don't know the publicPath at build time, you can set `window['webpackPublicPath']` before
loading any script in your HTML.
*/
let publicPath = '/';

if(argv.publicPath){
  publicPath = argv.publicPath;
}

// force leading /
if (!publicPath.startsWith('/')) {
  publicPath = `/${publicPath}`;
}
// force trailing /
if (!publicPath.endsWith('/')) {
  publicPath = `${publicPath}/`;
}

const versionPath = 'version/' + new Date().getTime() + '/'; // TODO
const staticPath = path.join(projectRoot, 'src/static');
const distPath = path.join(projectRoot, 'dist');

module.exports = Object.assign({},
  require('../../src/storybook/config'),
  {
    dist: {
      env: {
        NODE_ENV: JSON.stringify('production'),
      },
      port: 9001, // preview only
      publicPath,
      staticPath,
      // enables specific linters during webpack compilation, which will error your compile
      enableESLintLoader: false,
      enableTSLintLoader: false,
      enableStyleLintPlugin: false,
      // adviced to turn this on for production
      enableImageOptimization: true,
      enablePNGQuant: true,  // Best PNG optimizer, but PNGQuant crashes on some images so use with caution.
    },
    dev: {
      env: {
        NODE_ENV: JSON.stringify('development'),
      },
      port: 9000,
      publicPath: '/',
      staticPath,
      // enables specific linters during webpack compilation, which will error your compile
      enableESLintLoader: false,
      enableTSLintLoader: false,
      enableStyleLintPlugin: false,
    },
    storybook: {
      env: {
        NODE_ENV: JSON.stringify('development'),
      },
      port: 9002,
      publicPath,
      staticPath: path.join(projectRoot, 'src/storybook/static'),
      buildPath: path.join(distPath, 'storybook'),
      // enables specific linters during webpack compilation, which will error your compile
      enableESLintLoader: false,
      enableTSLintLoader: false,
      enableStyleLintPlugin: false,
    },
    projectRoot,
    distPath,
    buildPath: path.join(distPath, 'site'),
    // enable for local HTTPS dev-server
    useHttps: false,
    // enable to generate per-page bundles. For each json file a .js and .css file are generated
    standaloneOutput: false,
  }
);
