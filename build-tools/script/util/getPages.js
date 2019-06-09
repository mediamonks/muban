const fs = require('fs-extra');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const recursive = require('recursive-readdir');
const yaml = require('js-yaml');
const loadData = require('json-import-loader').loadData;

const projectRoot = path.resolve(__dirname, '../../../');

const resolvers = {
  yaml: path => yaml.safeLoad(fs.readFileSync(path, 'utf8')),
};

const replaceVariables = loadData(path.resolve(projectRoot, 'src/data/_variables.yaml'), {
  resolvers,
});

/**
 * Get all data files, and return an array of page/file
 * @returns {Promise}
 */
module.exports = function() {
  return new Promise((resolve, reject) => {
    // read json files and generate a page for each json
    recursive(
      path.resolve(projectRoot, 'src/data'),
      [
        file =>
          (path.extname(file) !== '.json' &&
            path.extname(file) !== '.yaml' &&
            path.extname(file) !== '.js') ||
          path.basename(file).startsWith('_'),
      ],
      (err, files) => {
        const pages = files
          .map(f => path.basename(f))
          .sort()
          .map(file => {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const data = loadData(path.resolve(projectRoot, `src/data/${file}`), {
              resolvers,
            });

            // replace ${foo} occurrences in the data to be rendered.
            const replacedData = {
              ...replaceVariables,
              ...JSON.parse(
                Object.keys(replaceVariables).reduce(
                  (data, varName) =>
                    data.replace(
                      new RegExp('\\${' + varName + '}', 'g'),
                      () => replaceVariables[varName],
                    ),
                  JSON.stringify(data),
                ),
              ),
            };

            return {
              file,
              data: replacedData,
              page: path.basename(file, `.${file.split('.').pop()}`),
            };
          });

        resolve(pages);
      },
    );
  });
};
