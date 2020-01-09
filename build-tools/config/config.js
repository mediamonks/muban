const pipeline = require('yargs').pkgConf('pipeline').argv.use;
const config = require(`../pipeline/${pipeline}/config`);

module.exports = config;
