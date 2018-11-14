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
const config = require('../config');

const projectRoot = path.resolve(__dirname, '../../');

module.exports = function(cb, cleanupAfter = true) {
  const partialsPath = path.join(config.buildPath, 'asset/partials.js');
  if (!fs.existsSync(partialsPath)) {
    throw new Error('Partials file not present, run `yarn build partials` first.');
  }
  delete require.cache[require.resolve(partialsPath)];
  // eslint-disable-next-line import/no-unresolved
  const { indexTemplate, appTemplate } = require(partialsPath);

  // store json info to render overview page later
  const dirIndex = [];

  const htmlTemplate = Handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, './template.hbs'), 'utf-8'),
  );

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

          console.log(`Generating... ${page}.html`);

          dirIndex.push({
            page,
            data,
            link: `${page}.html`,
          });

          let html = htmlTemplate({
            content,
            page,
            publicPath: config.dist.publicPath,
          });

          html = inline(html, page);

          fs.writeFileSync(path.resolve(config.buildPath, `${page}.html`), html, 'utf-8');
        });

      const renderIndex = !dirIndex.some(p => p.page === 'index');

      // INDEX STUFF
      if (renderIndex) {
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
          .replace('<link rel="stylesheet" amp-custom>', '<link rel="stylesheet" href="asset/preview.css">\n\t<link rel="stylesheet" href="asset/common.css">')
          .replace(/<html(.*)>/gi, '<html$1 class="index">');

        fs.writeFileSync(path.resolve(config.buildPath, 'index.html'), indexResult, 'utf-8');
      }

      // cleanup, doesn't belong in the build folder
      if (cleanupAfter) {
        fs.unlink(partialsPath);
      }

      cb(null);
    },
  );
};

function inline(html, page) {
  // TODO
  // if (isProductionBuild) {
  //   // Replace "local" links with production links
  //   html = html.replace(/(href|data-target)="([^"]*)"/gi, (match, attr, value) => {
  //     const [page, anchor] = value.split('#');
  //     const replacement = linkReplacements[page];
  //     if (!replacement) return `${attr}="${value}"`;
  //     const newLink = anchor ? `${attr}="${replacement}#${anchor}"` : `${attr}="${replacement}"`;
  //     return newLink;
  //   });
  // }

  const commonCss = fs.readFileSync(path.resolve(projectRoot, 'dist/site/asset/common.css'), 'utf-8');
  const pageCss = fs.readFileSync(path.resolve(projectRoot, `dist/site/asset/${page}.css`), 'utf-8');

  // CSS needs tbe merged into one custom amp style tag
  html = html.replace(
    '<link rel="stylesheet" amp-custom>',
    `<style amp-custom>
    ${commonCss}${pageCss}
  </style>`,
  );

  return html;
}

function getLeadingZero(nr) {
  return nr < 10 ? `0${nr}` : nr;
}
