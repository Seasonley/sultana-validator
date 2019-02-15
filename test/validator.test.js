const assert = require('assert')
const {
  In, Not, Range, Equals, Blank, Truthy, Required,
  InstanceOf, SubclassOf, GreaterThan, LessThan,
  Length, Pattern, Then, If, Contains, Each, validate,
} = require('../src/index.js')

class BaseClass {}
class SubClass extends BaseClass {}

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
  it('test_in_validator', () => {
    const validator = {
      field: [In([1, 2, 3])],
    }
    const passes = { field: 1 }
    const fails = { field: 4 }

    assert(validate(validator, passes)[0])
    assert(!validate(validator, fails)[0])
  })
  it('test_equals_validator', () => {
    const validator = {
      truthiness: [Equals('bar')],
      falsiness: [Not(Equals('True'))],
    }
    const testCase = {
      truthiness: 'bar',
      falsiness: true,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_not_validator', () => {
    const validator = {
      test_truthy: [Not(Truthy)],
      test_equals: [Not(Equals('one'))],
      test_not_not: [Not(Not(Truthy))],
      test_in: [Not(In(['one', 'two']))],
      test_range: [Not(Range(1, 10))],
      test_pattern: [Not(Pattern(/\d{3}/))],
    }
    const testCase = {
      test_truthy: false,
      test_equals: 'two',
      test_not_not: true,
      test_in: 'three',
      test_range: 11,
      test_pattern: 'abc',
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_range_validator', () => {
    const validator = {
      in_range: [Range(1, 10)],
      out_of_range: [Not(Range(1, 10))],
      exclusive_in_range: [Range(1, 10, false)],
      exclusive_out_of_range: [Not(Range(1, 10, false))],
    }
    const testCase = {
      in_range: 1,
      out_of_range: 11,
      exclusive_in_range: 2,
      exclusive_out_of_range: 1,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_greaterthan_validator', () => {
    const validator = {
      greater_than: [GreaterThan(0)],
      lower_than: [Not(GreaterThan(0))],
      equal_exclusive: [Not(GreaterThan(0))],
      equal_inclusive: [GreaterThan(0, true)],
    }
    const testCase = {
      greater_than: 1,
      lower_than: -1,
      equal_exclusive: 0,
      equal_inclusive: 0,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_lessthan_validator', () => {
    const validator = {
      less_than: [LessThan(0)],
      greater_than: [Not(LessThan(0))],
      equal_exclusive: [Not(LessThan(0))],
      equal_inclusive: [LessThan(0, true)],
    }
    const testCase = {
      less_than: -1,
      greater_than: 1,
      equal_exclusive: 0,
      equal_inclusive: 0,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_instanceof_validator', () => {
    const validator = {
      classy: [Required, InstanceOf(SubClass)],
      subclassy: [Required, InstanceOf(BaseClass)],
      not_classy: [Required, Not(InstanceOf(SubClass))],
      not_subclassy: [Required, Not(InstanceOf(BaseClass))],
    }
    const testCase = {
      classy: new SubClass(),
      subclassy: new BaseClass(),
      not_classy: Object(),
      not_subclassy: 3,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_subclassof_validator', () => {
    const validator = {
      is_subclass: [Required, SubclassOf(BaseClass)],
      not_subclass: [Required, Not(SubclassOf(BaseClass))],
    }
    const testCase = {
      is_subclass: SubClass,
      not_subclass: Number,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_greaterthan_validator', () => {
    const validator = {
      greater_than: [GreaterThan(0)],
      lower_than: [Not(GreaterThan(0))],
      equal_exclusive: [Not(GreaterThan(0))],
      equal_inclusive: [GreaterThan(0, true)],
    }
    const testCase = {
      greater_than: 1,
      lower_than: -1,
      equal_exclusive: 0,
      equal_inclusive: 0,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_lessthan_validator', () => {
    const validator = {
      less_than: [LessThan(0)],
      greater_than: [Not(LessThan(0))],
      equal_exclusive: [Not(LessThan(0))],
      equal_inclusive: [LessThan(0, true)],
    }
    const testCase = {
      less_than: -1,
      greater_than: 1,
      equal_exclusive: 0,
      equal_inclusive: 0,
    }
    assert(validate(validator, testCase)[0])
  })
  it('test_length_validator', () => {
    const passes = {
      foo: [Required, Length(5), Length(1, 5)],
      bar: [Required, Length(0, 10)],
    }
    const fails = {
      foo: [Required, Length(8), Length(1, 11)],
      bar: [Required, Length(0, 3)],
    }
    const testCase = {
      foo: '12345',
      bar: [1, 2, 3, 4, 5],
    }
    assert(validate(passes, testCase)[0])
    assert(!validate(fails, testCase)[0])
  })
})
