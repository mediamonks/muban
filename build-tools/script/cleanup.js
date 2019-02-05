const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '../../');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(['$0', 'boilerplate'], 'Clean boilerplate files', () => {}, (argv) => {
      clean();
  })
  .example('$0', 'Only remove boilerplate files')
  .example('$0 -s', 'Remove everything')
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
