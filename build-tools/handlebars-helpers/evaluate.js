module.exports = function(v1, operator, v2) {
  switch (operator) {
    case '==':
      return (v1 == v2);
      break;
    case '===':
      return (v1 === v2);
      break;
    case '!=':
      return (v1 != v2);
      break;
    case '!==':
      return (v1 !== v2);
      break;
    case '<':
      return (v1 < v2);
      break;
    case '<=':
      return (v1 <= v2);
      break;
    case '>':
      return (v1 > v2);
      break;
    case '>=':
      return (v1 >= v2);
      break;
    case '&&':
      return (v1 && v2);
      break;
    case '||':
      return (v1 || v2);
      break;
    default:
      throw new Error('No valid operator')
  }
};
