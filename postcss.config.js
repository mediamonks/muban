// eslint-disable-next-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({ overrideBrowserslist: ['last 3 iOS versions', 'last 3 versions', 'ie >= 9'] }),
  ],
};
