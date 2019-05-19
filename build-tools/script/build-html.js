/**
 * Generation the production pages from the compiled partials and json files
 */
const fs = require('fs-extra');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const Handlebars = require('handlebars');
// eslint-disable-next-line import/no-extraneous-dependencies
const beautifyHtml = require('js-beautify').html;
const config = require('../config/config');
const { addToIndex, renderIndex, startNewIndex } = require('./util/index-page');
const getPages = require('./util/getPages');

const templatePath = path.resolve(__dirname, '../templates');

module.exports = function(options) {
  // load partials
  const partialsPath = path.join(config.buildPath, config.aemSharedPath, 'js/partials.js');
  if (!fs.existsSync(partialsPath)) {
    throw new Error('Partials file not present, run `yarn build partials` first.');
  }
  // eslint-disable-next-line import/no-unresolved
  const { indexTemplate, appTemplate } = require(partialsPath);

  // compile normal and standalone page templates
  const htmlTemplate = Handlebars.compile(
    fs.readFileSync(path.join(templatePath, 'build-html-template.hbs'), 'utf-8'),
  );
  const htmlTemplateStandalone = config.standaloneOutput
    ? Handlebars.compile(
        fs.readFileSync(path.join(templatePath, 'build-html-template-standalone.hbs'), 'utf-8'),
      )
    : null;

  // prepare standalone output
  const standalonePath = path.resolve(config.buildPath, 'standalone');
  if (config.standaloneOutput) {
    if (!fs.existsSync(standalonePath)) {
      fs.mkdirSync(standalonePath);
    }
  }

  const componentScripts = getComponentPaths(options.componentFiles || [], '.js');
  const componentStyles = getComponentPaths(options.componentFiles || [], '.css');

  console.log();
  console.log();

  startNewIndex();

  return getPages().then(pages => {
    return Promise.all(
      pages.map(({ page, file, data }) => {
        addToIndex({
          page,
          data,
        });

        // page content
        const content = appTemplate(data);

        // render normal page
        return renderPage(htmlTemplate, content, page, config.buildPath, componentScripts, componentStyles)
          .then(() => {
            // render standalone page
            if (config.standaloneOutput) {
              return renderPage(htmlTemplateStandalone, content, page, standalonePath, componentScripts, componentStyles);
            }
          })
          .then(() => {
            console.log(`Generating... ${page}.html`);
          });
      }),
    ).then(() => {
      renderIndex(indexTemplate, htmlTemplate);

      if (options && options.cleanPartials) {
        // cleanup, doesn't belong in the build folder
        fs.unlinkSync(partialsPath);
      }
    });
  });
};

/**
 * Render body content into a full html page
 * @param template
 * @param content
 * @param page
 * @param outputPath
 * @returns {Promise}
 */
function renderPage(template, content, page, outputPath, componentScripts = [], componentStyles = []) {
  // render full html page
  const templateStandaloneResult = template({
    content,
    page,
    publicPath: config.dist.publicPath,
    aemSharedPath: config.aemSharedPath,
    componentScripts,
    componentStyles,
  });

  // make it pretty
  const html = beautifyHtml(templateStandaloneResult, { indent_size: 2 });

  // output to disk
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(outputPath, `${page}.html`), html, 'utf-8', (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getComponentPaths(paths, extension) {
  return paths.filter((componentPath) => componentPath.includes(extension)).map((componentPath) => {
    return config.dist.publicPath + path.relative(config.buildPath, componentPath);
  });
}

