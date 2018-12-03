const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '../../');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(['$0', 'boilerplate'], 'Clean boilerplate files', () => {}, (argv) => {
      clean();
      if (argv.storybook) {
        cleanStorybook();
      }
  })
  .command(['storybook'], 'Clean storybook files', () => {}, (argv) => {
      cleanStorybook();
  })
  .example('$0', 'Only remove boilerplate files')
  .example('$0 storybook', 'Only remove storybook files')
  .example('$0 --storybook', 'Remove everything')
  .example('$0 -s', 'Remove everything')
  .option('s', {
    alias: 'storybook',
    default: false,
    describe: 'Also remove storybook',
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .argv;

function clean() {
  shell.rm('-rf', [
    // assets
    path.join(projectRoot, 'src/static/demo.*'),
    path.join(projectRoot, 'src/app/svg/icon/*.svg'),

    // pages
    path.join(projectRoot, 'src/data/*'),

    // blocks
    path.join(projectRoot, 'src/app/component/block/paragraph'),
    path.join(projectRoot, 'src/app/component/block/two-col'),
    path.join(projectRoot, 'src/app/component/block/header'),
    path.join(projectRoot, 'src/app/component/block/footer'),

    // components
    path.join(projectRoot, 'src/app/component/general/button'),
  ]);
}

function cleanStorybook() {
  shell.rm('-rf', [
    // webpack
    path.join(projectRoot, 'build-tools/config/storybook'),

    // loaders
    path.join(projectRoot, 'build-tools/loaders/hbs-source-loader.js'),
    path.join(projectRoot, 'build-tools/loaders/hbs-inline-loader.js'),
    path.join(projectRoot, 'build-tools/loaders/preset-loader.js'),
    path.join(projectRoot, 'build-tools/loaders/extract-template-loader.js'),

    // generator
    path.join(projectRoot, 'build-tools/template/**/preset.js'),

    // preset files
    path.join(projectRoot, 'src/app/component/**/preset.js'),

    // storybook
    path.join(projectRoot, 'src/storybook'),
  ]);

  const packagePath = path.resolve(projectRoot, 'package.json');
  fs.writeFileSync(
    packagePath,
    fs.readFileSync(packagePath, { encoding: 'utf8' }).replace(/(^.*storybook.*[\r\n]*)/gim, ''),
    { encoding: 'utf8' },
  );
}
