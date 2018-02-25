const path = require("path");

const projectRoot = path.resolve(__dirname, '../../../');

function addStandalone(webpackConfig, resolve) {
  // read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [(file, stats) => path.extname(file) !== '.json'],
    function (err, files) {
      // files is an array of filename
      files
        .map(f => path.basename(f, '.json'))
        .sort()
        .forEach(file => {
          let page = file;
          let content = require(path.resolve(projectRoot, 'src/data/' + file + '.json'));
          const blockNames = content.blocks.map(b => b.name);

          webpackConfig.entry[page.replace(/\./, '-')] = blockNames
            .map(name => './src/app/component/block/' + name + '/' + name + '.hbs')
            .concat(['./src/app/dist.js'])
            .filter((value, index, list) => list.indexOf(value) === index);
        });

      resolve(webpackConfig);
    }
  );
}


module.exports = {
  addStandalone,
};
