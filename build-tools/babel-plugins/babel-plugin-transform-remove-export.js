module.exports = function() {
  return {
    name: 'transform-remove-export',
    visitor: {
      ExportDeclaration(path) {
        path.remove()
      },
    },
  }
};
