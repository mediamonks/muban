/**
 * Generation the production pages from the compiled partials and json files
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const loadData = require('json-import-loader').loadData;
// eslint-disable-next-line import/no-extraneous-dependencies
const Handlebars = require('handlebars');
// eslint-disable-next-line import/no-extraneous-dependencies
const recursive = require('recursive-readdir');
// eslint-disable-next-line import/no-extraneous-dependencies
const beautifyHtml = require('js-beautify').html;
const config = require('../config');

const projectRoot = path.resolve(__dirname, '../../');

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
  const htmlTemplateStandalone = config.standaloneOutput
    ? Handlebars.compile(
        fs.readFileSync(path.resolve(__dirname, './template-standalone.hbs'), 'utf-8')
      )
    : null;

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
    [file => path.extname(file) !== '.json' && path.extname(file) !== '.yaml'],
    (err, files) => {
      files
        .map(f => path.basename(f))
        .sort()
        .forEach(file => {
          const page = path.basename(file, `.${file.split('.').pop()}`);
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const data = loadData(path.resolve(__dirname, `../../src/data/${file}`), {
            resolvers: {
              yaml: path => yaml.safeLoad(fs.readFileSync(path, 'utf8')),
            },
          });
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
            data,
            link: `${page}.html`,
          });

          if (config.standaloneOutput) {
            const templateStandaloneResult = htmlTemplateStandalone({
              content,
              page,
              publicPath: config.dist.publicPath,
            });

            html = beautifyHtml(templateStandaloneResult, { indent_size: 2 });

            fs.writeFileSync(path.resolve(standalonePath, `${page}.html`), html, 'utf-8');
          }
        });

      const pages = dirIndex
        .map(item => {
          if (!item.data.meta) {
            item.data.meta = {};
          }
          if (item.page.includes('.')) {
            item.data.meta.alt = true;
          }
          return item;
        })
        .sort((a, b) => {
          if (a.data.meta.alt || b.data.meta.alt) {
            // sort on alt
            if (a.page.startsWith(b.page)) return 1;
            if (b.page.startsWith(a.page)) return -1;
            // return String(a.page).localeCompare(String(b.page));
          }
          return String(a.data.meta.id || a.page).localeCompare(String(b.data.meta.id || b.page));
        })
        .map(({ page, data }) => ({
          page,
          data,
          link: `${page}.html`,
        }));

      const categoryMap = pages.reduce((cats, page) => {
        const category = page.data.meta.category || 'default';
        if (!cats[category]) {
          cats[category] = [];
        }
        cats[category].push(page);
        return cats;
      }, {});

      const categories = Object.keys(categoryMap).map(key => ({
        name: key,
        pages: categoryMap[key]
      }));

      // render list overview page
      const date = new Date();
      const content = indexTemplate({
        pages,
        categories,
        showCategories: categories.length > 1,
        date: `${getLeadingZero(date.getDate())}-${getLeadingZero(date.getMonth() + 1)}-${date.getFullYear()} ${getLeadingZero(date.getHours())}:${getLeadingZero(date.getMinutes())}`
      });
      let indexResult = htmlTemplate({
        content,
        page: 'Index',
      });

      indexResult = indexResult
        .replace('<link rel="stylesheet" href="asset/bundle.css">', '<link rel="stylesheet" href="asset/preview.css">\n\t<link rel="stylesheet" href="asset/bundle.css">')
        .replace('<script src="asset/bundle.js"></script>', '<script src="asset/preview.js"></script>\n\t<script src="asset/bundle.js"></script>');

      fs.writeFileSync(path.resolve(config.buildPath, 'index.html'), indexResult, 'utf-8');

      // cleanup, doesn't belong in the build folder
      fs.unlink(partialsPath);

      cb(null);
    }
  );
};

function getLeadingZero(nr) {
  return nr < 10 ? `0${nr}` : nr;
}
