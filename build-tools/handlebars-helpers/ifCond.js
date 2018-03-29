module.exports = function (v1, operator, v2, options) {
  const operatorMap = {
    '==': (v1, v2) => v1 == v2,
    '===': (v1, v2) => v1 === v2,
    '!=': (v1, v2) => v1 != v2,
    '!==': (v1, v2) => v1 !== v2,
    '<': (v1, v2) => v1 < v2,
    '<=': (v1, v2) => v1 <= v2,
    '>': (v1, v2) => v1 > v2,
    '>=': (v1, v2) => v1 >= v2,
    '&&': (v1, v2) => v1 && v2,
    '||': (v1, v2) => v1 || v2,
  };
  if (operatorMap[operator]) {
    return operatorMap[operator](v1, v2) ? options.fn(this) : options.inverse(this);
  } else {
    return options.inverse(this);
  }
};
