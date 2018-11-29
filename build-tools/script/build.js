const path = require('path');
const config = require('../config');
const ora = require('ora');
const webpack = require('webpack');
const webpackConfigCode = require('../config/webpack/webpack.config.code.dist');
const webpackConfigCodeDev = require('../config/webpack/webpack.config.code.dev');
const webpackConfigPartials = require('../config/webpack/webpack.config.partials');
const webpackConfigStorybook = require('../config/storybook/webpack.config.dist');
const buildHtml = require('./build-html');
const buildFtl = require('./build-ftl');
const fs = require('fs-extra');
const chalk = require('chalk');
const shell = require('shelljs');
const chokidar = require('chokidar');
const previewServer = require('./preview-server');

const projectRoot = path.resolve(__dirname, '../../');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(
    ['$0', 'all'],
    'Only build code bundle',
    () => {},
    argv => {
      buildAll();
    },
  )
  .command(
    'code',
    'Only build code bundle',
    () => {},
    argv => {
      buildCode();
    },
  )
  .command(
    'partials',
    'Only build partials bundle',
    () => {},
    argv => {
      buildPartials();
    },
  )
  .command(
    'html',
    'Only generate html files',
    () => {},
    argv => {
      buildHTML();
    },
  )
  .command(
    'ftl',
    'Only generate html files',
    () => {},
    argv => {
      buildFTL();
    },
  )
  .command(
    'ftl-dev',
    'Only generate html files',
    () => {},
    argv => {
      buildFTLDev();
    },
  )
  .command(
    'storybook',
    'Build the storybook',
    () => {},
    argv => {
      buildStorybook();
    },
  )
  .command(
    'clean',
    'Cleans the dist folder',
    () => {},
    argv => {
      cleanDist();
    },
  )
  .example('$0 --publicPath=/m/muban-site/', 'Build with a different publicPath')
  .example('$0 -p /m/muban-site/', 'Build with a different publicPath')
  .alias('p', 'publicPath')
  .nargs('p', 1)
  .describe('p', 'Custom publicPath (default / )')
  .help('h')
  .alias('h', 'help').argv;

function getWebpackConfig(config) {
  return new Promise(resolve => {
    if (config && typeof config.then === 'function') {
      config.then(result => resolve(result));
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
    })
    .catch(e => callback(e));
}

function callWebpackWatch(config, callback) {
  getWebpackCompiler(config)
    .then(compiler => {
      compiler.watch({}, callback);
    })
    .catch(e => callback(e));
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
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
    }) + '\n',
  );
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
  });
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
  });
}

function buildStorybook(cb) {
  const spinner = ora('Starting storybook build...');
  spinner.start();
  callWebpack(webpackConfigStorybook, (err, stats) => {
    if (err) {
      spinner.fail('Storybook build failed');
      throw err;
    }
    displayWebpackStats(stats);

    console.log();
    spinner.succeed('Storybook build done!');
    console.log();

    cb && cb(null);
  });
}

function buildHTML(cb) {
  htmlSpinner = ora('Starting html generation...');
  htmlSpinner.start();
  buildHtml(err => {
    if (err) {
      htmlSpinner.fail('html generation failed!');
      throw err;
    }
    console.log();
    htmlSpinner.succeed('html generation done!');

    cb && cb(null);
  });
}

function buildFTL() {
  htmlSpinner = ora('Starting html generation...');
  htmlSpinner.start();
  buildFtl(err => {
    if (err) {
      htmlSpinner.fail('html generation failed!');
      throw err;
    }
    console.log();
    htmlSpinner.succeed('html generation done!');
  });
}

function buildFTLDev() {
  // cleanDist();

  const serverConfig = previewServer();

  var livereload = require('livereload');
  lrserver = livereload.createServer({
    // exts: ['html'],
  });
  lrserver.watch(projectRoot + '/dist/site');

  getWebpackConfig(webpackConfigCodeDev).then(configs => {
    webpack(configs).watch({
      ignored: ['**/*.ftl', 'node_modules']
    }, (err, stats) => {
      if (err) {
        return console.log(err);
      }
      displayWebpackStats(stats, true);

      console.log('webpack code done!');
      console.log();

    });
  });

  buildFtl((err) => {
    if (err) {
      console.log(err);
      console.log();
      console.log('Templates error');
    } else {
      console.log();
      console.log('templates done!');
    }
  });

  chokidar
    .watch(
      [projectRoot + '/src/app/**/*.{ftl,yaml,json}', projectRoot + '/src/data/**/*.{yaml,json}'],
      { ignoreInitial: true },
    )
    .on('all', (event, path) => {
      buildFtl((err) => {
        if (err) {
          console.log(err);
          console.log();
          console.log('Templates error');
        } else {
          console.log();
          console.log('templates done!');
        }
      });
    });
}

function buildAll() {
  cleanDist();

  buildCode(() => {
    buildPartials(() => {
      buildHTML(() => {
        console.log();
        console.log(
          chalk.blue('You can preview your build by running:'),
          chalk.blue.bold('yarn preview'),
        );
        console.log(
          chalk.blue('You can analyze your build by running:'),
          chalk.blue.bold('yarn analyze'),
        );
        console.log();
      });
    });
  });
}
