const path = require('path');
const getVariables = require('../../script/util/getVariables');

exports.compose = function(funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

exports.cleanupTemplate = function(template) {
  // remove script/style includes
  template = template.replace(/<script src=["']([^"']+)["']><\/script>[\r\n]*/gi, '');
  template = template.replace(/<link rel=["']stylesheet["'] href=["'][^"']+["']>[\r\n]*/gi, '');

  // fix partial imports by adding additional folder that is not needed for webpack
  template = template.replace(/{{> ([\w-/]+)\/([\w-]+)/gi, '{{> $1/$2/$2');

  return template;
};

const projectRoot = path.resolve(__dirname, '../../../');

exports.addStandalone = function(webpackConfig, resolve) {
  // read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [(file, stats) => path.extname(file) !== '.json'],
    function(err, files) {
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
    },
  );
};

exports.getImportLoader = (config, buildType) => {
  let replaceVariables = getVariables(config.projectRoot, buildType);

  return {
    loader: 'json-import-loader',
    options: {
      processPath: path =>
        Object.keys(replaceVariables).reduce(
          (data, varName) =>
            // replace ${foo} occurrences in the data to be rendered.
            data.replace(new RegExp(`\\$\{${varName}}`, 'g'), () => replaceVariables[varName]),
          path,
        ),
    },
  };
};

exports.getReplaceLoader = (config, buildType) => ({
  loader: 'string-replace-loader',
  options: {
    multiple: Object.keys(config.env[buildType]).map(envName => ({
      search: `process.env.${envName}`,
      replace: config.env[buildType][envName].replace(/"/gi, ''),
    })),
  },
});

exports.getCacheLoader = (config, buildType, isDevelopment) =>
  isDevelopment
    ? {
        loader: 'cache-loader',
      }
    : null;
