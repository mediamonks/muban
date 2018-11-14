const path = require('path');
const config = require('../config');
const ora = require('ora');
const webpack = require('webpack');
const webpackConfigCode = require('../config/webpack/webpack.config.code.dist');
const webpackConfigPartials = require('../config/webpack/webpack.config.partials');
const buildHtml = require('./build-html');
const fs = require('fs-extra');
const chalk = require('chalk');
const shell = require('shelljs');
const debounce = require('lodash/debounce');
const previewServer = require('./preview-server');

const projectRoot = path.resolve(__dirname, '../../');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(['$0', 'all'], 'Only build code bundle', () => {}, (argv) => {
    buildAll();
  })
  .command('dev', 'Build code in dev mode', () => {}, (argv) => {
    buildDev();
  })
  .command('code', 'Only build code bundle', () => {}, (argv) => {
    buildCode();
  })
  .command('partials', 'Only build partials bundle', () => {}, (argv) => {
    buildPartials();
  })
  .command('html', 'Only generate html files', () => {}, (argv) => {
    buildHTML();
  })
  .command('clean', 'Cleans the dist folder', () => {}, (argv) => {
    cleanDist();
  })
  .example('$0 --publicPath=/m/muban-site/', 'Build with a different publicPath')
  .example('$0 -p /m/muban-site/', 'Build with a different publicPath')
  .alias('p', 'publicPath')
  .nargs('p', 1)
  .describe('p', 'Custom publicPath (default / )')
  .help('h')
  .alias('h', 'help')
  .argv;

function getWebpackConfig(config) {
  return new Promise((resolve) => {
    if (config && typeof config.then === 'function') {
      config
        .then(result => resolve(result))
    } else if (typeof config === 'function') {
      resolve(config());
    } else {
      resolve(config);
    }
  });
}

function getWebpackCompiler(config) {
  return getWebpackConfig(config).then(config => {
    return webpack(config);
  });
}

function callWebpack(config, callback) {
  getWebpackCompiler(config)
    .then(compiler => {
      compiler.run(callback);
    }).catch(e => callback(e));
}

function callWebpackWatch(config, callback) {
  getWebpackCompiler(config)
    .then(compiler => {
      compiler.watch({

      }, callback);
    }).catch(e => callback(e));
}

function displayWebpackStats(stats, dev) {
  if (Array.isArray(stats.stats)) {
    stats.stats.forEach(s => displayWebpackStats(s, dev));
    return;
  }
  if (dev) {
    return;
  }

  if (stats.hasErrors() && !dev) {
    throw stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
    }) + '\n';
  }
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    reasons: false
  }) + '\n');
}

function cleanDist() {
  shell.rm('-rf', config.distPath);
}

function buildCode(cb) {
  const spinner = ora('Starting webpack code...');
  spinner.start();
  callWebpack(webpackConfigCode, (err, stats) => {
    if (err) {
      spinner.fail('webpack code failed');
      throw err;
    }
    displayWebpackStats(stats);

    console.log();
    spinner.succeed('webpack code done!');
    console.log();

    cb && cb(null);
  })
}

function buildPartials(cb) {
  const spinner = ora('Starting webpack partials...');
  spinner.start();
  callWebpack(webpackConfigPartials, (err, stats) => {
    if (err) {
      spinner.fail('webpack partials failed');
      throw err;
    }
    displayWebpackStats(stats);

    console.log();
    spinner.succeed('webpack partials done!');
    console.log();

    cb && cb(null);
  })
}

function buildHTML(cb) {
  htmlSpinner = ora('Starting html generation...');
  htmlSpinner.start();
  buildHtml((err) => {
    if (err) {
      htmlSpinner.fail('html generation failed!');
      throw err;
    }
    console.log();
    htmlSpinner.succeed('html generation done!');

    cb && cb(null);
  });
}

function buildAll() {
  cleanDist();

  buildCode(() => {
    buildPartials(() => {
      buildHTML(() => {
        console.log();
        console.log(chalk.blue('You can preview your build by running:'), chalk.blue.bold('yarn preview'));
        console.log(chalk.blue('You can analyze your build by running:'), chalk.blue.bold('yarn analyze'));
        console.log();
      })
    })
  })
}

let count = 1;

function buildDev() {
  cleanDist();


  Promise.all([
    getWebpackConfig(webpackConfigCode),
    getWebpackConfig(webpackConfigPartials),
  ]).then((configs) => {
    webpack(configs).watch({}, (err, stats) => {
      if (err) {
        return console.log(err);
      }
      displayWebpackStats(stats, true);

      if (++count % 2 === 0) {
        console.log();
        console.log('webpack code & partials done!');
        console.log();

        buildHtmlDev();
      }
    });
  });
}
let lrserver;
const buildHtmlDev = () => {
  try {
    buildHtml(() => {
      console.log('html done!');
      const serverConfig = previewServer();

      if (!lrserver) {
        var livereload = require('livereload');
        lrserver = livereload.createServer({
          exts: ['html'],
        });
        lrserver.watch(projectRoot + "/dist/site");
      }

    }, false);
  } catch (e) {
    console.log('errrorrr');
  }
};
