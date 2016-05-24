const assert = require('assert');
const validate = require('jsonschema').validate;
const schemaByExample = require('.');


describe('schemaByExample', () => {
  it('supports singular data types', () => {
    const example = {
      foo: 'i am a string',
      bar: 5,
      quux: false,
    };
    const expectedSchema = {
      type: 'object',
      required: ['foo', 'bar', 'quux'],
      properties: {
        foo: {type: 'string'},
        bar: {type: 'number'},
        quux: {type: 'boolean'},
      },
    };
    const generatedSchema = schemaByExample(example);

    assert.deepEqual(generatedSchema, expectedSchema);
    assert(validate(example, expectedSchema).valid);
  });

  it('uses the first item of a list as the example for the items of a list', () => {
    const example = [5];
    const expectedSchema = {
      type: 'array',
      items: {type: 'number'},
    };
    const generatedSchema = schemaByExample(example);

    assert.deepEqual(generatedSchema, expectedSchema);
    assert(validate(example, expectedSchema).valid);
  });

  it('supports complex, nested data structures', () => {
    const example = {foo: [{bar: [5]}]};
    const expectedSchema = {
      type: 'object',
      required: ['foo'],
      properties: {
        foo: {
          type: 'array',
          items: {
            type: 'object',
            required: ['bar'],
            properties: {
              bar: {
                type: 'array',
                items: {type: 'number'},
              },
            },
          },
        },
      },
    };
    const generatedSchema = schemaByExample(example);

    assert.deepEqual(generatedSchema, expectedSchema);
    assert(validate(example, expectedSchema).valid);
  });
});
