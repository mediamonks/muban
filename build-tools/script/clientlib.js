const chalk = require('chalk');
const fs = require('fs-extra');
const clientlib = require("aem-clientlib-generator");


module.exports = function (config) {
  const assetsFolder = `${config.distPath}/site/asset/`;
  const clientLibRoot = config.clientLibRoot;
  let clientLibName = config.clientLibName;

  if (clientLibRoot == "/") {
    return;
  }
  if (clientLibRoot == "") {
    clientLibName = "clientlib-site";
  }

  console.log(
    `${chalk.blue('Creating clientlibs for AEM...')}`
  );

  fs.readdir(assetsFolder, function (err, items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].search(/^preview\.(js|css)$/g) > -1) {
        fs.removeSync(`${assetsFolder}${items[i]}`);
        continue;
      }
    }
    clientlib([
        {
          name: `${clientLibName}`,
          serializationFormat: 'xml',
          cssProcessor: ["default:none", "min:none"],
          jsProcessor: ["default:none", "min:gcc;compilationLevel=whitespace"],
          allowProxy: true,
          longCacheKey: "${project.version}-${buildNumber}",
          assets: {
            js: {
              cwd: `${assetsFolder}`,
              files: ['**/*.js'],
              flatten: false
            },
            css: {
              cwd: `${assetsFolder}`,
              files: ['**/*.css'],
              flatten: false
            },
            resources: {
              base: '.',
              cwd: `${assetsFolder}`,
              files: ['**/*.*'],
              flatten: false,
              ignore: ['**/*.js', '**/*.css']
            }
          }
        }
      ],
      {
        cwd: __dirname, // using folder of the file as current working directory
        clientLibRoot: `${clientLibRoot}`,
        verbose: true,
      },
      function () {
        console.log(
          `${chalk.green('clientlibs created....')}`
        );
      });
  });
}
