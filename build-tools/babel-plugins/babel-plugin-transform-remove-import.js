module.exports = function() {
  return {
    name: 'transform-remove-import',
    visitor: {
      ImportDeclaration(path) {
        path.remove()
      },
    },
  }
};
