const path = require('path');

exports.compose = function(funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

exports.cleanupTemplate = function(template) {
  // remove script/style includes
  template = template.replace(/<script src=["']([^"']+)["']><\/script>[\r\n]*/ig, '');
  template = template.replace(/<link rel=["']stylesheet["'] href=["'][^"']+["']>[\r\n]*/ig, '');

  // fix partial imports by adding additional folder that is not needed for webpack
  template = template.replace(/{{> ([\w-/]+)\/([\w-]+)/gi, '{{> $1/$2/$2');

  return template;
}

const projectRoot = path.resolve(__dirname, '../../../');

exports.addStandalone = function(webpackConfig, resolve) {
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
};
