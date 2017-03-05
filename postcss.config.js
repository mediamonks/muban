/* eslint-disable */
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer( {browsers: ['last 3 iOS versions', 'last 3 versions', 'ie >= 9']} )
  ]
};
