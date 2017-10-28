/**
 * This file is the webpack entry for all scripts/styles that must be used in the website.
 */

// require all hbs templates to get reference to all used code
const context = require.context('./component/blocks/', true, /\.hbs$/);
context.keys().forEach(key => {
  context(key);
});
