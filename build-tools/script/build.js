const config = require('../config');
const path = require('path');
const ora = require('ora');
const webpack = require('webpack');
const archiver = require('archiver');
const webpackConfigCode = require('../config/webpack/webpack.config.code.dist');
const webpackConfigPartials = require('../config/webpack/webpack.config.partials');
const webpackConfigStorybook = require('../config/storybook/webpack.config.dist');
const buildHtml = require('./build-html');
const fs = require('fs-extra');
const chalk = require('chalk');
const shell = require('shelljs');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(['$0', 'all'], 'Only build code bundle', () => {}, (argv) => {
    buildAll();
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
  .command('storybook', 'Build the storybook', () => {}, (argv) => {
    buildStorybook();
  })
  .command('clean', 'Cleans the dist folder', () => {}, (argv) => {
    cleanDist();
  })
  .command(
    'zip [type]',
    'Zip dist folder',
    yargs => yargs.option('type', { default: 'dist' }),
    ({ type }) => {
      switch(type) {
        case 'project':{
          zipProject();
          break;
        }
        case 'dist': {
          zipDist();
          break;
        }
        default: {
          zipDist();
        }
      }
  })
  .example('$0 zip', 'Creates an archive of the dist folder')
  .example('$0 zip --type=project', 'Creates an archive that can be used to setup a new project')
  .example('$0 --publicPath=/m/muban-site/', 'Build with a different publicPath')
  .example('$0 -p /m/muban-site/', 'Build with a different publicPath')
  .alias('p', 'publicPath')
  .nargs('p', 1)
  .describe('p', 'Custom publicPath (default / )')
  .help('h')
  .alias('h', 'help')
  .argv;

function callWebpack(config, callback) {
  if (config && typeof config.then === 'function') {
    config
      .then(result => webpack(result, callback))
      .catch(e => callback(e));
  } else if (typeof config === 'function') {
    webpack(config(), callback);
  } else {
    webpack(config, callback);
  }
}

function displayWebpackStats(stats) {
  if (stats.hasErrors()) {
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
  })
}

function zipProject(cb) {
  const spinner = ora('Archiving muban...');
  spinner.start();

  const output = fs.createWriteStream(path.join(config.projectRoot, 'muban.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', function() {
    spinner.succeed(`muban.zip created (${archive.pointer()} bytes)`);
  });

  archive.pipe(output);

  const ignore = [
    '.DS_Store',
    '.npm/**',
    '.git/**',
    '.idea/**',
    '.eslintcache',
    '.stylelintcache',
    '.cache-loader',
    '.node_repl_history',
    '.yarn-integrity',
    '.env',
    '.nyc_output',
    'coverage/**',
    'lib-cov/**',
    '*.log',
    'dist/**',
    'muban*.zip',
    'node_modules/**',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
  ];

  archive.glob(`**/*`, {
    ignore,
    dot: true,
    cwd: config.projectRoot
  });

  archive.finalize();

  cb && cb(null);
}

function zipDist(cb) {
  const spinner = ora('Archiving dist...');
  spinner.start();

  const outputFile = `muban-dist-${new Date().getTime()}.zip`;
  const output = fs.createWriteStream(path.join(config.projectRoot, outputFile));
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', function() {
    spinner.succeed(`${outputFile} created (${archive.pointer()} bytes)`);
  });

  archive.glob(`**/*`, {
    dot: true,
    cwd: config.distPath
  });

  archive.pipe(output);

  archive.finalize();

  cb && cb(null);
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
