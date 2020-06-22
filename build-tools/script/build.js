const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');
const webpack = require('webpack');
const chokidar = require('chokidar');
const clientLib = require('./clientlib');


const { createTaskSpinner } = require('./util/spinner');
const { compileWebpack, handleWebpackComplete, displayWebpackStats, getWebpackConfig } = require('./util/webpack');
const buildHtml = require('./build-html');
const previewServer = require('./preview-server');

const config = require('../config/config');
const webpackConfigCode = require('../config/webpack/webpack.conf.code.dist');
const webpackConfigCodeDev = require('../config/webpack/webpack.conf.code.dev.build');
const webpackConfigPartials = require('../config/webpack/webpack.conf.partials');
let webpackConfigStorybook;
try {
  webpackConfigStorybook = require('../config/storybook/webpack.config.dist');
} catch (e) {}

const projectRoot = path.resolve(__dirname, '../../');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 --publicPath=/m/muban-site/', 'Build with a different publicPath')
  .example('$0 -p /m/muban-site/', 'Build with a different publicPath')
  .command(['$0', 'all'], 'Only build code bundle', () => {}, buildAll)
  .command('dev', 'A dev build with live reload', () => {}, buildDev)
  .command('code', 'Only build code bundle', () => {}, buildCode)
  .command('partials', 'Only build partials bundle', () => {}, buildPartials)
  .command('html', 'Only generate html files', () => {}, () => buildHTML({ skipPartials: true }))
  .command('storybook', 'Build the storybook', () => {}, buildStorybook)
  .command('clean', 'Cleans the dist folder', () => {}, cleanDist)
  .option('p', {
    alias: 'publicPath',
    default: undefined,
    describe: 'Custom publicPath (default / )',
    type: 'string',
    nargs: 1,
  })
  .option('l', {
    alias: 'language',
    default: undefined,
    describe: 'Custom language to be used in your yaml files (default "en")',
    type: 'string',
    nargs: 1,
  })
  .help('h')
  .alias('h', 'help').argv;

function cleanDist() {
  shell.rm('-rf', config.distPath);
}

function buildCode() {
  const spinner = createTaskSpinner('webpack code');
  return handleWebpackComplete(spinner, compileWebpack(webpackConfigCode));
}

function buildPartials() {
  const spinner = createTaskSpinner('webpack partials');
  return handleWebpackComplete(spinner, compileWebpack(webpackConfigPartials));
}

function buildStorybook() {
  if (webpackConfigStorybook) {
    const spinner = createTaskSpinner('storybook build');
    return handleWebpackComplete(spinner, compileWebpack(webpackConfigStorybook));
  } else {
    console.log('No storybook present in this project');
    return Promise.resolve();
  }
}

function buildHTML(options) {
  return (() => {
    if (!options || !options.skipPartials) {
      return buildPartials()
    } else {
      return Promise.resolve();
    }
  })()
    .then(() => {
      const spinner = createTaskSpinner('html generation');
      return buildHtml(options)
        .then(spinner.succeed)
        .catch(err => {
          spinner.fail();
          throw err;
        });
    })
}

function buildDev() {
  // cleanDist();

  // start preview server
  const serverConfig = previewServer();

  // reload the page on any file changes in the dist folder
  const livereload = require('livereload');
  const lrserver = livereload.createServer({
    // exts: ['html'],
  });
  lrserver.watch(config.buildPath);

  // build js/css in watch mode
  getWebpackConfig(webpackConfigCodeDev).then(configs => {
    webpack(configs).watch({
      ignored: ['**/*.hbs', 'node_modules']
    }, (err, stats) => {
      if (err) {
        return console.log(err);
      }
      displayWebpackStats(stats, true);

      console.log('webpack code done!');
      console.log();

    });
  });

  // builds partials and html
  const build = () => {
    buildHTML()
      .then(() => {
        console.log();
        console.log('templates done!');
      }).catch((err) => {
      console.log(err);
      console.log();
      console.log('Templates error');
    });
  };

  // initial build
  build();

  // watch partials or data files for rebuild
  chokidar
    .watch(
      [projectRoot + '/src/app/**/*.{hbs,yaml,json}', projectRoot + '/src/data/**/*.{yaml,json}'],
      { ignoreInitial: true },
    )
    .on('all', (event, path) => {
      build();
    });
}

function buildAll() {
  cleanDist();

  buildCode()
    .then(() => buildHTML({ cleanPartials: true}))
    .then(() => {
      console.log();
      console.log(
        `${chalk.blue('You can')} ${chalk.green('preview')} ${chalk.blue(
          'your build by running:',
        )} ${chalk.green('yarn preview')}`,
      );
      console.log(
        `${chalk.blue('You can')} ${chalk.green('analyze')} ${chalk.blue(
          'your build by running:',
        )} ${chalk.green('yarn analyze')}`,
      );
      console.log();
      clientLib(config);
    });
}
