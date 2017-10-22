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

// eslint-disable-next-line import/no-unresolved
const { indexTemplate, appTemplate } = require('../build/asset/partials');

const htmlTemplate = Handlebars.compile(
  fs.readFileSync(path.resolve(__dirname, './template.hbs'), 'utf-8')
);
const htmlTemplateStandalone = Handlebars.compile(
  fs.readFileSync(path.resolve(__dirname, './template-standalone.hbs'), 'utf-8')
);

// store json info to render overview page later
const dirIndex = [];

if (!fs.existsSync(path.resolve(__dirname, '../build/standalone'))) {
  fs.mkdirSync(path.resolve(__dirname, '../build/standalone'));
}

// read json files and generate a page for each json
recursive(
  path.resolve(__dirname, '../src/data'),
  [file => path.extname(file) !== '.json'],
  (err, files) => {
    files
      .map(f => path.basename(f, '.json'))
      .sort()
      .forEach(file => {
        const page = file;
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const data = require(`../src/data/${file}.json`);
        const content = appTemplate(data);

        const templateResult = htmlTemplate({
          content,
          page,
        });

        let html = beautifyHtml(templateResult, { indent_size: 2 });

        fs.writeFileSync(path.resolve(__dirname, `../build/${page}.html`), html, 'utf-8');

        console.log(`Generating... ${page}.html`);

        dirIndex.push({
          page,
          link: `${page}.html`,
          data,
        });

        const templateStandaloneResult = htmlTemplateStandalone({
          content,
          page,
        });

        html = beautifyHtml(templateStandaloneResult, { indent_size: 2 });

        fs.writeFileSync(
          path.resolve(__dirname, `../build/standalone/${page}.html`),
          html,
          'utf-8'
        );
      });

    // render list overview page
    const content = indexTemplate({
      pages: dirIndex,
    });
    const indexResult = htmlTemplate({
      content,
      page: 'Index',
    });
    fs.writeFileSync(path.resolve(__dirname, '../build/index.html'), indexResult, 'utf-8');

    // cleanup, doesn't belong in the build folder
    fs.unlink(path.resolve(__dirname, '../build/asset/partials.js'));
  }
);
