const path = require('path');
const argv = require('yargs').argv;
const chalk = require('chalk');

const projectRoot = path.resolve(__dirname, '../../');

/*
Change the publicPath if site is running in a subfolder on the server.

It's also possible to override this publicPath by using:
yarn build --publicPath=/m/muban-site/

When you don't know the publicPath at build time, you can set `window['webpackPublicPath']` before
loading any script in your HTML.
*/
let publicPath = '/';
let clientLibRoot = '/';
let clientLibName = '';

if(argv.publicPath){
  publicPath = argv.publicPath;
}

if (argv.clientLibRoot) {
  clientLibRoot = argv.clientLibRoot;
}

if (argv.clientLibName) {
  clientLibName = argv.clientLibName;
}


// force leading /
if (!publicPath.startsWith('/')) {
  publicPath = `/${publicPath}`;
}
// force trailing /
if (!publicPath.endsWith('/')) {
  publicPath = `${publicPath}/`;
}

// force trailing /
if (!clientLibRoot.endsWith('/')) {
  clientLibRoot = `${clientLibRoot}/`;
}



if (publicPath !== '/') {
  console.log('');
  console.log(`${chalk.yellow('Note:')} publicPath set to "${chalk.blue(publicPath)}"`);
  console.log('');
}

if (clientLibRoot !== '/') {
  console.log('');
  console.log(`${chalk.yellow('Note:')} clientLibRoot set to "${chalk.blue(clientLibRoot)}"`);
  console.log('');
}

if (clientLibName !== '') {
  console.log('');
  console.log(`${chalk.yellow('Note:')} clientLibName set to "${chalk.blue(clientLibName)}"`);
  console.log('');
}


// set language to be set as process.env
let language = 'en';

if(argv.language){
  language = argv.language;
}


const buildTypes = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

const versionPath = 'version/' + new Date().getTime() + '/'; // TODO
const staticPath = path.join(projectRoot, 'src/static');
const distPath = path.join(projectRoot, 'dist');
const buildPath = path.join(distPath, 'site');

let storyBookConfig = {};
try {
  storyBookConfig = require('../../src/storybook/config');
} catch (e) {}

module.exports = Object.assign({},
  storyBookConfig,
  {
    buildTypes,

    /* paths */
    projectRoot,
    staticPath,
    distPath,
    buildPath,

    /* AEM */
    clientLibRoot,
    clientLibName,

    /* EXPERIMENTAL: enable to generate per-page bundles. For each json file a .js and .css file are generated */
    standaloneOutput: false,

    devServer: {
      port: process.env.PORT || 9000,
      proxyTable: {},
      autoOpenBrowser: false,
      useHttps: false,
    },

    /* non-development builds */
    dist: {
      /* paths */
      publicPath,

      /* optimization */
      enableImageOptimization: true,
      enablePNGQuant: true,  // Best PNG optimizer, but PNGQuant crashes on some images so use with caution.
    },

    /* custom storybook build */
    storybook: {
      env: {
        NODE_ENV: JSON.stringify('development'),
      },
      port: 9002,
      publicPath,
      staticPath: path.join(projectRoot, 'src/storybook/static'),
      buildPath: path.join(distPath, 'storybook'),
    },

    /* environment variables (set using DefinePlugin) */
    //
    // These variables can also be used in _variables.yaml by using `process.env.SOMETHING`
    // example:
    // publicPath: process.env.PUBLIC_PATH
    //
    // These variables are also available in SCSS as `$something`
    env: {
      [buildTypes.PRODUCTION]: {
        NODE_ENV: JSON.stringify('production'),
        PUBLIC_PATH: JSON.stringify(publicPath),
        LANGUAGE: language,
      },
      [buildTypes.DEVELOPMENT]: {
        NODE_ENV: JSON.stringify('development'),
        PUBLIC_PATH: JSON.stringify('/'),
        LANGUAGE: language,
      }
    },
  }
);
