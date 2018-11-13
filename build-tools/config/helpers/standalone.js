const fs = require('fs');
const path = require("path");
const yaml = require('js-yaml');
const recursive = require('recursive-readdir');
const loadData = require('json-import-loader').loadData;

const projectRoot = path.resolve(__dirname, '../../../');

function addStandalone(webpackConfig, resolve) {
  // read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [file => path.extname(file) !== '.json' && path.extname(file) !== '.yaml'],
    function (err, files) {
      // files is an array of filename
      files
        .map(f => path.basename(f))
        .sort()
        .forEach(file => {
          const ext = file.split('.').pop();
          const page = path.basename(file, `.${ext}`);
          const content = loadData(path.resolve(projectRoot, `src/data/${file}`), {
            resolvers: {
              yaml: path => yaml.safeLoad(fs.readFileSync(path, 'utf8')),
            },
          });
          const blockNames = content.blocks.map(b => b.name);

          webpackConfig.entry[page.replace(/\./, '-')] = blockNames
            .map(name => './src/app/component/block/' + name + '/' + name + '.hbs')
            .filter((value, index, list) => list.indexOf(value) === index);
        });

      resolve(webpackConfig);
    }
  );
}


module.exports = {
  addStandalone,
};
