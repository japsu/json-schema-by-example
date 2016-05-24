const _ = require('lodash');


module.exports = schemaByExample;


const rules = [
  [_.isNumber, () => ({type: 'number'})],
  [_.isBoolean, () => ({type: 'boolean'})],
  [_.isString, () => ({type: 'string'})],
  [_.isRegExp, pattern => ({type: 'string', pattern})],
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
