const shell = require('shelljs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(['$0', 'boilerplate'], 'Clean boilerplate files', () => {}, (argv) => {
      clean();
  })
  .example('$0', 'Only remove boilerplate files')
  .help('h')
  .alias('h', 'help')
  .argv;

function clean() {
  shell.rm('-rf', [
    // assets
    path.join(projectRoot, 'src/static/demo.*'),
    path.join(projectRoot, 'src/app/svg/icon/*.svg'),

    // pages
    path.join(projectRoot, 'src/data/home.yaml'),
    path.join(projectRoot, 'src/data/about.yaml'),
    path.join(projectRoot, 'src/data/test.js'),

    // blocks
    path.join(projectRoot, 'src/app/component/block/paragraph'),
    path.join(projectRoot, 'src/app/component/block/two-col'),
    path.join(projectRoot, 'src/app/component/block/header'),
    path.join(projectRoot, 'src/app/component/block/footer'),

    // components
    path.join(projectRoot, 'src/app/component/general/button'),
  ]);
}
