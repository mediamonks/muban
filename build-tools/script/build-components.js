/**
 * Build the components and copy them to the build folder
 */
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const config = require('../config/config');
const forEach = require('async-foreach').forEach;
const sass = require('node-sass');
const jsonImporter = require('node-sass-json-importer');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const babel = require('@babel/core');
const { createTaskSpinner } = require('./util/spinner');

const pluginTransformRemoveImport = require('../babel-plugins/babel-plugin-transform-remove-import');
const pluginTransformRemoveExport = require('../babel-plugins/babel-plugin-transform-remove-export');

module.exports = function() {
  const spinner = createTaskSpinner('building components');

  return getFiles(config.dist.componentRootPath, config.dist.componentGlobPath, config.dist.componentGlobIgnore).then(processFiles)
  .then((componentPaths) => {
    spinner.succeed();
    return componentPaths;
  })
  .catch(err => {
    spinner.fail();
    throw err;
  });
};

function getFiles(rootDirectory, globPath, globIgnore) {
  return new Promise((resolve) => {
    glob(globPath, {ignore: globIgnore, root: rootDirectory}, (err, files) => {
      resolve(files);
    })
  })
}

/*
source/aem/<project-name>/ui.apps/src/main/content/jcr_root/apps/<project-name>
source/frontend/

<project-name>
  clientlibs
    clientlibs-ui
    clientlibs-site
      resources
        demo.jpg
    clientlibs-shared
      button
        clientlib
          js
            Button.js
          css
            button.css
          js.txt
          css.txt
      bundle
        clientlib
          js
            common.js
          css
            common.css
          js.txt
          css.txt
  components
    content
      paragraph
        v1
          clientlib
            js
              Paragraph.js
            css
              paragraph.css
            js.txt
            css.txt
 */

function createPath(type, file) {
  const componentRoot = config.dist.componentRootPath;
  const extension = '.' + file.split('.').reverse()[0];
  const segmentMatch = path.relative(componentRoot, file).match(/^([^\/\\]+?)[\/\\]([^\/\\]+?)[\/\\](.*$)/i);

  if (segmentMatch) {
    const [, group, component, file] = segmentMatch;
    const targetExtension = `.${type}`;

    let targetPath;
    if (group === 'general') {
      targetPath = path.resolve(config.buildPath, './aem/clientlibs/clientlibs-shared',  component, 'clientlib', type, file.replace(extension, targetExtension));
    } else {
      targetPath = path.resolve(config.buildPath, './aem/components/content',  component, 'v1', 'clientlib', type, file.replace(extension, targetExtension));
    }
    console.log(targetPath);
    return targetPath;
  }
  else {
    throw new Error(`Could not correctly parse path "${path.relative(componentRoot, file)}"`);
  }

}

function processFiles(files) {
  return Promise.all(files.map((file) => {
      return readFile(file).then((fileContent) => {
        const extension = '.' + file.split('.').reverse()[0];

        if(extension === '.scss') {
          return processScss(file, fileContent).then((result) => {
            const targetPath = createPath('css', file);
            return writeFile(targetPath, result);
          });
        } else if (extension === '.ts') {
          return processTs(file, fileContent).then((result) => {
            const targetPath = createPath('js', file);
            return writeFile(targetPath, result);
          });
        }
      });
    }));
}

function readFile(path, encoding = 'utf-8') {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, result) => {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function writeFile(filePath, fileContent, encoding = 'utf-8') {
  return new Promise((resolve, reject) => {
    fs.ensureDir(path.parse(filePath).dir, (err) => {
      if(err) {
        reject(err);
      } else {
        fs.writeFile(filePath, fileContent, encoding, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(filePath);
          }
        });
      }
    });
  });
}

function processScss(file, fileContent) {
  const css = sass.renderSync({
    data: '@import "node_modules/seng-scss/base"; @import "src/app/style/global";' + fileContent,
    importer: jsonImporter(),
    outputStyle: 'compressed',
    includePaths: ['src/app/style', path.parse(file).dir, 'node_modules'],
  }).css.toString('utf-8');

  return postcss([autoprefixer({browsers: ['last 3 iOS versions', 'last 3 versions', 'ie >= 9']})]).process(css).then((result) => {
    return result.css;
  });
}

function processTs(file, fileContent) {
  return babel.transformAsync(fileContent, {filename: file, plugins: [pluginTransformRemoveImport, pluginTransformRemoveExport]}).then((result) => {
    return result.code;
  });
}

