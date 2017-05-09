/**
 * Generation the production pages from the compiled partials and json files
 */
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const recursive = require('recursive-readdir');
var beautify_html = require('js-beautify').html;

const { indexTemplate, appTemplate } = require('../build/asset/partials');

const htmlTemplate = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, './template.hbs'), 'utf-8'));

// store json info to render overview page later
const dirIndex = [];

// read json files and generate a page for each json
recursive(
	path.resolve(__dirname, '../src/data'),
	[(file, stats) => path.extname(file) !== '.json'],
	function (err, files) {
		// files is an array of filename
		files
			.map(f => path.basename(f, '.json'))
			.sort()
			.forEach(file => {
				let page = file;
				let content = appTemplate(require('../src/data/' + file + '.json'));

				const result = htmlTemplate({
					content,
					page,
				});

				// make nice indenting
				const html = beautify_html(result, { indent_size: 2 });

				fs.writeFileSync(path.resolve(__dirname, '../build/' + page + '.html'), html, 'utf-8');

				console.log('Generating... ' + page + '.html');

				dirIndex.push({
					page,
					link: page + '.html',
				});
			});
	}
);

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

