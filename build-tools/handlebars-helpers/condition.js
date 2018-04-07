/**
 * Helper function for more expressive conditions.
 *
 * Can be used anywhere a boolean is expected.
 * Compares two values with an operator.
 *
 * Usage:
 *   ```
 *   {{#if (condition variable1 '!==' value) }}
 *     foo
 *   {{else if (condition variable2 '>=' 10) }}
 *     bar
 *   {{/if}}
 *   ```
 *
 * @param v1
 * @param operator
 * @param v2
 * @return {*}
 */
module.exports = function (v1, operator, v2) {
  switch (operator) {
    case '==': return v1 == v2;
    case '===': return v1 === v2;
    case '!=': return v1 != v2;
    case '!==': return v1 !== v2;
    case '<': return v1 < v2;
    case '<=': return v1 <= v2;
    case '>': return v1 > v2;
    case '>=': return v1 >= v2;
    case '&&': return v1 && v2;
    case '||': return v1 || v2;
    default: throw new Error('No valid operator ' + operator);
  }
};
