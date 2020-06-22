const fs = require('fs-extra');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const recursive = require('recursive-readdir');
const yaml = require('js-yaml');
const loadData = require('json-import-loader').loadData;

const getVariables = require('./getVariables');
const config = require('../../config/config.js');

const projectRoot = path.resolve(__dirname, '../../../');

const resolvers = {
  yaml: path => yaml.safeLoad(fs.readFileSync(path, 'utf8')),
};

let replaceVariables = getVariables(projectRoot, config.buildTypes.PRODUCTION);

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
              processPath: path =>
                Object.keys(replaceVariables).reduce(
                  (data, varName) =>
                    // replace ${foo} occurrences in the import path
                    data.replace(
                      new RegExp(`\\$\{${varName}}`, 'g'),
                      () => replaceVariables[varName],
                    ),
                  path,
                ),
            });

            // replace ${foo} occurrences in the data to be rendered.
            const replacedData = {
              ...replaceVariables,
              ...JSON.parse(
                Object.keys(config.env[config.buildTypes.PRODUCTION]).reduce(
                  (data, envName) =>
                    data.replace(
                      new RegExp('process\\.env\\.' + envName, 'g'),
                      config.env[config.buildTypes.PRODUCTION][envName].replace(/"/gi, ''),
                    ),
                  Object.keys(replaceVariables).reduce(
                    (data, varName) =>
                      data.replace(
                        new RegExp('\\${' + varName + '}', 'g'),
                        () => replaceVariables[varName],
                      ),
                    JSON.stringify(data),
                  ),
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
