const path = require('path');
const fs = require('fs');
const loadData = require('json-import-loader').loadData;
const yaml = require('js-yaml');
const config = require('../../config/config.js');

module.exports = function(projectRoot, buildType) {
  const resolvers = {
    yaml: path => yaml.safeLoad(fs.readFileSync(path, 'utf8')),
  };

  const env = config.env[buildType];

  let replaceVariables =
    (varPath =>
      fs.existsSync(varPath) &&
      loadData(varPath, {
        resolvers,
      }))(path.resolve(projectRoot, 'src/data/_variables.yaml')) || {};

  replaceVariables = JSON.parse(
    Object.keys(env).reduce(
      (data, envName) =>
        data.replace(
          new RegExp('process\\.env\\.' + envName, 'g'),
          env[envName].replace(/"/gi, ''),
        ),
      JSON.stringify(replaceVariables),
    ),
  );

  return replaceVariables;
};
