/**
 * Generation the production pages from the compiled partials and json files
 */
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const Handlebars = require('handlebars');
// eslint-disable-next-line import/no-extraneous-dependencies
const recursive = require('recursive-readdir');
// eslint-disable-next-line import/no-extraneous-dependencies
const beautifyHtml = require('js-beautify').html;
const config = require('../config');

const projectRoot = path.resolve(__dirname, '../../');

console.log(config.buildPath);

module.exports = function(cb) {
  const partialsPath = path.join(config.buildPath, 'asset/partials.js');
  if (!fs.existsSync(partialsPath)) {
    throw new Error('Partials file not present, run `yarn build partials` first.');
  }
  // eslint-disable-next-line import/no-unresolved
  const { indexTemplate, appTemplate } = require(partialsPath);

  const htmlTemplate = Handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, './template.hbs'), 'utf-8')
  );
  const htmlTemplateStandalone = config.standaloneOutput ? Handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, './template-standalone.hbs'), 'utf-8')
  ) : null;

// store json info to render overview page later
  const dirIndex = [];

  const standalonePath = path.resolve(config.buildPath, 'standalone');
  if (config.standaloneOutput) {
    if (!fs.existsSync(standalonePath)) {
      fs.mkdirSync(standalonePath);
    }
  }

  console.log();
  console.log();

// read json files and generate a page for each json
  recursive(
    path.resolve(projectRoot, 'src/data'),
    [file => path.extname(file) !== '.json'],
    (err, files) => {
      files
        .map(f => path.basename(f, '.json'))
        .sort()
        .forEach(file => {
          const page = file;
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const data = require(`../../src/data/${file}.json`);
          const content = appTemplate(data);

          const templateResult = htmlTemplate({
            content,
            page,
            publicPath: config.dist.publicPath,
          });

          let html = beautifyHtml(templateResult, { indent_size: 2 });

          fs.writeFileSync(path.resolve(config.buildPath, `${page}.html`), html, 'utf-8');

          console.log(`Generating... ${page}.html`);

          dirIndex.push({
            page,
            link: `${page}.html`,
            data,
          });

          if (config.standaloneOutput) {
            const templateStandaloneResult = htmlTemplateStandalone({
              content,
              page,
              publicPath: config.dist.publicPath,
            });

            html = beautifyHtml(templateStandaloneResult, { indent_size: 2 });

            fs.writeFileSync(
              path.resolve(standalonePath, `${page}.html`),
              html,
              'utf-8'
            );
          }
        });

      // render list overview page
      const content = indexTemplate({
        pages: dirIndex,
      });
      const indexResult = htmlTemplate({
        content,
        page: 'Index',
      });
      fs.writeFileSync(path.resolve(config.buildPath, 'index.html'), indexResult, 'utf-8');

      // cleanup, doesn't belong in the build folder
      fs.unlink(partialsPath);

      cb(null);
    }
  );
}
