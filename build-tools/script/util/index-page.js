const fs = require('fs-extra');
const path = require('path');
const config = require('../../config/config');

// store json info to render overview page later
let dirIndex;

function startNewIndex() {
  dirIndex = [];
}

/**
 * Store the page into the index page
 * @param page
 * @param data
 */
function addToIndex({ page, data }) {
  dirIndex.push({
    page,
    data,
    link: `${page}.html`,
  });
}

/**
 * Render the index page
 * @param indexTemplate
 * @param htmlTemplate
 */
function renderIndex(indexTemplate, htmlTemplate) {
  // skip index rendering if there is already an index page
  if (dirIndex.some(p => p.page === 'index')) {
    return;
  }

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
    pages: categoryMap[key],
  }));

  // render list overview page
  const date = new Date();
  const content = indexTemplate({
    pages,
    categories,
    showCategories: categories.length > 1,
    date: `${getLeadingZero(date.getDate())}-${getLeadingZero(
      date.getMonth() + 1,
    )}-${date.getFullYear()} ${getLeadingZero(date.getHours())}:${getLeadingZero(
      date.getMinutes(),
    )}`,
  });
  let indexResult = htmlTemplate({
    content,
    page: 'Index',
  });

  indexResult = indexResult
    .replace(
      '<link rel="stylesheet" href="asset/bundle.css">',
      '<link rel="stylesheet" href="asset/bundle.css">\n\t<link rel="stylesheet" href="asset/preview.css">',
    )
    .replace(
      '<script src="asset/bundle.js"></script>',
      '<script src="asset/bundle.js"></script>\n\t<script src="asset/preview.js"></script>',
    );

  fs.writeFileSync(path.resolve(config.buildPath, 'index.html'), indexResult, 'utf-8');
}

function getLeadingZero(nr) {
  return nr < 10 ? `0${nr}` : nr;
}

module.exports = {
  addToIndex: addToIndex,
  renderIndex: renderIndex,
  startNewIndex: startNewIndex,
}
