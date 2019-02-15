const assert = require('assert')
const {
  Validator, In, Not, Range, GreaterThan, LessThan, Equals,
  Blank, Truthy, Required, InstanceOf, SubclassOf, Then, If,
  Length, Contains, Each, validate,
} = require('../src/index.js')

describe('TestValidator', () => {
  it('test_truthy_validator', () => {
    const validator = {
      truthiness: [Truthy],
      falsiness: [Not(Truthy)],
    }
    const strValue = {
      truthiness: 'test',
      falsiness: '',
    }
    const intValue = {
      truthiness: 1,
      falsiness: 0,
    }
    const boolValue = {
      truthiness: true,
      falsiness: false,
    }
    assert(validate(validator, strValue)[0])
    assert(validate(validator, intValue)[0])
    assert(validate(validator, boolValue)[0])
  })
  it('test_required_validator', () => {
    const validator = {
      truthiness: [Required],
      falsiness: [],
    }
    const strValue = {
      truthiness: 'test',
    }
    const intValue = {
      truthiness: 1,
    }
    const boolValue = {
      truthiness: true,
    }
    const missingValue = {}
    assert(validate(validator, strValue)[0])
    assert(validate(validator, intValue)[0])
    assert(validate(validator, boolValue)[0])
    const [, errors] = validate(validator, missingValue)
    assert.deepEqual(errors.truthiness, ['must be present'], JSON.stringify(errors))
  })
  it('test_blank_validator', () => {
    const validator = {
      truthiness: [Blank],
      falsiness: [Not(Blank)],
    }
    const strValue = {
      truthiness: '',
      falsiness: 'not_blank',
    }
    const intValue = {
      truthiness: 1,
      falsiness: 0,
    }
    const boolValue = {
      truthiness: true,
      falsiness: false,
    }
    assert(validate(validator, strValue)[0])
    assert(!validate(validator, intValue)[0])
    assert(!validate(validator, boolValue)[0])
  })
  // it('test_required_validator', () => {
  // })
})
