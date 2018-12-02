const chalk = require('chalk');
const shell = require('shelljs');

const { createTaskSpinner } = require('./util/spinner');
const { compileWebpack, handleWebpackComplete } = require('./util/webpack');
const buildHtml = require('./build-html');

const config = require('../config/config');
const webpackConfigCode = require('../config/webpack/webpack.conf.code.dist');
const webpackConfigPartials = require('../config/webpack/webpack.conf.partials');
let webpackConfigStorybook;
try {
  webpackConfigStorybook = require('../config/storybook/webpack.config.dist');
} catch (e) {}

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 --publicPath=/m/muban-site/', 'Build with a different publicPath')
  .example('$0 -p /m/muban-site/', 'Build with a different publicPath')
  .command(['$0', 'all'], 'Only build code bundle', () => {}, buildAll)
  .command('code', 'Only build code bundle', () => {}, buildCode)
  .command('partials', 'Only build partials bundle', () => {}, buildPartials)
  .command('html', 'Only generate html files', () => {}, buildHTML)
  .command('storybook', 'Build the storybook', () => {}, buildStorybook)
  .command('clean', 'Cleans the dist folder', () => {}, cleanDist)
  .option('p', {
    alias: 'publicPath',
    default: undefined,
    describe: 'Custom publicPath (default / )',
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
  const spinner = createTaskSpinner('html generation');
  return buildHtml(options)
    .then(spinner.succeed)
    .catch(err => {
      spinner.fail();
      throw err;
    });
}

function buildAll() {
  cleanDist();

  buildCode()
    .then(buildPartials)
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
    });
}
