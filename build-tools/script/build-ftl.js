/**
 * Generation the production pages from the compiled partials and json files
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const loadData = require('json-import-loader').loadData;
// eslint-disable-next-line import/no-extraneous-dependencies
const recursive = require('recursive-readdir');
// eslint-disable-next-line import/no-extraneous-dependencies
const beautifyHtml = require('js-beautify').html;
const Freemarker = require('freemarker.js');
const config = require('../config');

const projectRoot = path.resolve(__dirname, '../../');

var fmIndex = new Freemarker({
  viewRoot: __dirname,
  options: {
    /** for fmpp */
  },
});

var fm = new Freemarker({
  viewRoot: path.resolve(projectRoot, 'src/app/component'),
  options: {
    /** for fmpp */
  },
});

function renderFTL(template, data, fmi) {
  return new Promise((resolve, reject) => {
    (fmi || fm).render(
      template,
      data,
      function(err, html, output) {
        if (err) {
          reject(output);
        } else {
          resolve(html);
        }
      },
    );

  })
}

module.exports = function(cb) {
  console.log(); // spacer

  // read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [file => path.extname(file) !== '.json' && path.extname(file) !== '.yaml'],
    (err, files) => {
      Promise.all(
        files
          .map(f => path.basename(f))
          .sort()
          .map(file => {
            const page = path.basename(file, `.${file.split('.').pop()}`);
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const data = loadData(path.resolve(__dirname, `../../src/data/${file}`), {
              resolvers: {
                yaml: path => yaml.safeLoad(fs.readFileSync(path, 'utf8')),
              },
            });

            return renderFTL('/layout/app/app.ftl', data)
              .then(content => {
                return renderFTL('/template.ftl', {
                  content,
                  page,
                  publicPath: config.dist.publicPath,
                }, fmIndex);
              })
              .then(templateResult => {
                let html = beautifyHtml(templateResult, { indent_size: 2 });

                fs.writeFileSync(path.resolve(config.buildPath, `${page}-ftl.html`), html, 'utf-8');

                console.log(`Generating... ${page}-ftl.html`);
              });
          })
      ).then(() => {
        cb(null);
      }).catch((err) => {
        cb(err);
      })
    }
  );
};
