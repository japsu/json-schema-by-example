const _ = require('lodash');


module.exports = schemaByExample;


const rules = [
  [_.isNull, () => ({type: 'null'})],
  [_.isNumber, () => ({type: 'number'})],
  [_.isBoolean, () => ({type: 'boolean'})],
  [_.isString, () => ({type: 'string'})],
  [_.isRegExp, pattern => ({type: 'string', pattern})],

  // Empty array -> array of any items
  [(example) => _.isArray(example) && !example.length, () => ({type: 'array'})],

  [_.isArray, items => ({type: 'array', items: schemaByExample(items[0])})],
  [_.isPlainObject, object => ({
    type: 'object',
    required: _.keys(object),
    properties: _.mapValues(object, schemaByExample),
  })],
];


function schemaByExample(example) {
  for (const [isMatch, makeSchema] of rules) {
    if (isMatch(example)) {
      return makeSchema(example);
    }
  }

  throw new TypeError(example);
}
