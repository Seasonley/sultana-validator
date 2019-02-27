function template(strings, ...keys) {
  return (function templ(...values) {
    var dict = values[values.length - 1] || {}
    var result = [strings[0]]
    keys.forEach((key, i) => {
      var value = Number.isInteger(key) ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  })
}

function ValidationResult(valid, errors) {
  return [valid, errors]
}

let errMsg = '', notMsg = ''

function Validator() {
  errMsg = 'failed validation'
  notMsg = 'failed validation'
}

/**
 @function Blank
 @param {*} value
 @description Use to specify that the
  value of the key being
  validated must be equal to
  the empty string.

  This is a shortcut for saying
  Equals("").
 @example
  var validations = {
    field: [Blank]
  }
  var passes = {field:''}
  var fails  = {field:'four'}
 */
function Blank(value) {
  Validator.call(this)
  errMsg = 'must be an empty string'
  notMsg = 'must not be an empty string'
  return value === ''
}

/**
 @function Truthy
 @param {*} value
 @description Use to specify that the
    value of the key being
    validated must be truthy,
    i.e. would cause an if statement
    to evaluate to True.
 @example
 var validations = {
    field: [Truthy]
  }
  var passes = {field: 1}
  var fails  = {field: 0}
*/
function Truthy(value) {
  Validator.call(this)
  errMsg = 'must be True-equivalent value'
  notMsg = 'must be False-equivalent value'
  return !!value
}

/**
 @function Required
 @description  When added to a list of validations
    for a dictionary key indicates that
    the key must be present. This
    should not be called, just inserted
    into the list of validations.
 @example
 var validations = {
    "field": [Required, Equals(2)]
  }
*/
function Required(field, dictionary) {
  return field in dictionary
}

/**
 @function Equals
 @param {*} obj
 @description  Use to specify that the
    value of the key being
    validated must be equal to
    the value that was passed
    to this validator.
 @example
 var validations = {
    "field": [Equals(1)]
  }
  var passes = {field:1}
  var fails  = {field:4}
}
*/
function Equals(obj) {
  const objJson = JSON.stringify(obj)
  errMsg = `must be equal to ${objJson}`
  notMsg = `must not be equal to ${objJson}`
  return function Equals(value) {
    return value === obj
  }
}

/**
 @function Not
 @param {*} validator
 @description  Use to negate the requirement
    of another validator. Does not
    work with Required.
*/
function Not(validator) {
  return function Not(value) {
    Validator.call(this)
    errMsg = errMsg || 'failed validation'
    notMsg = notMsg || 'failed validation'
    return !validator(value)
  }
}


/**
 @function In
 @param {*} collection
 @description  Use to specify that the
    value of the key being
    validated must exist
    within the collection
    passed to this validator.
 @example
  var validations = {
    "field": [In([1, 2, 3])]
  }
  var passes = {field:1}
  var fails  = {field:4}
}
*/
function In(collection) {
  return function In(value) {
    Validator.call(this)
    errMsg = `must be one of ${JSON.stringify(collection)}`
    notMsg = `must not be one of ${JSON.stringify(collection)}`
    return collection.includes(value)
  }
}


/**
 @function InstanceOf
 @param {*} baseClass
 @description  Use to specify that the
    value of the key being
    validated must be an instance
    of the passed in base class
    or its subclasses.
 @example
  class BaseClass {}
  class SubClass extends BaseClass {}
  var validator = {
    classy: [Required, InstanceOf(SubClass)],
    subclassy: [Required, InstanceOf(BaseClass)],
    not_classy: [Required, Not(InstanceOf(SubClass))],
    not_subclassy: [Required, Not(InstanceOf(BaseClass))],
  }
  var testCase = {
    classy: new SubClass(),
    subclassy: new BaseClass(),
    not_classy: Object(),
    not_subclassy: 3,
  }
*/
function InstanceOf(baseClass) {
  return function InstanceOf(value) {
    Validator.call(this)
    errMsg = `must be an instance of ${baseClass.name} or its subclasses`
    notMsg = `must not be an instance of ${baseClass.name} or its subclasses`
    return (value instanceof baseClass)
  }
}

/**
 @function SubclassOf
 @param {*} baseClass
 @description  Use to specify that the
    value of the key being
    validated must be a subclass
    of the passed in base class.
 @example
 class BaseClass {}
 class SubClass extends BaseClass {}
 var validator = {
    is_subclass: [Required, SubclassOf(BaseClass)],
    not_subclass: [Required, Not(SubclassOf(BaseClass))],
  }
 var testCase = {
    is_subclass: SubClass,
    not_subclass: Number,
  }
*/
function SubclassOf(baseClass) {
  return function SubclassOf(subClass) {
    Validator.call(this)
    errMsg = `must be a subclass of ${baseClass.name}`
    notMsg = `must not be a subclass of ${baseClass.name}`
    return (subClass.prototype instanceof baseClass)
  }
}

/**
 @function Pattern
 @param {RegExp} reg
 @description  Use to specify that the
    value of the key being
    validated must match the
    pattern provided to the
    validator.
 @example
 var validator = {
    test_pattern: [Not(Pattern(/\d\d%/))],
  }
  var passes = {field: "30%"}
  var fails  = {field: "30"}
*/
function Pattern(reg) {
  return function Pattern(value) {
    errMsg = `must match regex ${reg.toString()}`
    notMsg = `must not match regex ${reg.toString()}`
    return reg.test(value)
  }
}


/**
 @function Range
 @param {Number} start
 @param {Number} end
 @param {Boolean} [inclusive=true]
 @description  Use to specify that the value of the
    key being validated must fall between
    the start and end values. By default
    the range is inclusive, though the
    range can be made excusive by setting
    inclusive to false.
 @example
  var validations = {
    field: [Range(0, 10)]
  }
  var passes = {field: 10}
  var fails = {field : 11}
*/
function Range(start, end, inclusive = true) {
  return function Range(value) {
    Validator.call(this)
    errMsg = `must fall between ${start} and ${end}`
    notMsg = `must not fall between ${start} and ${end}`
    if (inclusive === true) {
      return start <= value && value <= end
    }
    return start < value && value < end
  }
}

/**
 @function GreaterThan
 @param {Number} lowerBound
 @param {Boolean} [inclusive=false]
 @description Use to specify that the value of the
    key being validated must be greater
    than a given value. By default the
    bound is exclusive, though the bound
    can be made inclusive by setting
    inclusive to true.
 @example
  var validations = {
    field: [GreaterThan(10)]
  }
  var passes = {field: 11}
  var fails = {field : 10}
*/
function GreaterThan(lowerBound, inclusive = false) {
  return function Range(value) {
    Validator.call(this)
    errMsg = `must be greater than ${lowerBound}`
    notMsg = `must not be greater than ${lowerBound}`
    if (inclusive === true) {
      return lowerBound <= value
    }
    return lowerBound < value
  }
}

/**
 @function LessThan
 @param {Number} upperBound
 @param {Boolean} [inclusive=false]
 @description Use to specify that the value of the
    key being validated must be less
    than a given value. By default the
    bound is exclusive, though the bound
    can be made inclusive by setting
    inclusive to true.
 @example
  var validations = {
    field: [LessThan(10)]
  }
  var passes = {field: 9}
  var fails = {field : 10}
*/
function LessThan(upperBound, inclusive = false) {
  return function Range(value) {
    Validator.call(this)
    errMsg = `must be less than ${upperBound}`
    notMsg = `must not be less than ${upperBound}`
    if (inclusive === true) {
      return value <= upperBound
    }
    return value < upperBound
  }
}


/**
 @function Length
 @param {Number} minimum
 @param {Number} [maximum=0]
 @description Use to specify that the
    value of the key being
    validated must have at least
    `minimum` elements and optionally
    at most `maximum` elements.
    At least one of the parameters
    to this validator must be non-zero,
    and neither may be negative.
 @example
  var validations = {
    field: [Length(0,5)]
  }
  var passes = {field: 'hello'}
  var fails  = {field: 'hello world'}
*/
function Length(minimum, maximum = 0) {
  var messageTemplate = {
      maximum: template`must be at most ${0} elements in length`,
      minimum: template`must be at least ${0} elements in length`,
      range: template`must${0}be between ${1} and ${2} elements in length`,
    }, errMessage, notMessage

  if (!minimum && !maximum) { throw new Error('Length must have a non-zero minimum or maximum parameter.') }
  if (minimum < 0 || maximum < 0) { throw new Error('Length cannot have negative parameters.') }

  if (minimum && maximum) {
    errMessage = messageTemplate.range(' ', minimum, maximum)
    notMessage = messageTemplate.range(' not ', minimum, maximum)
  } else if (minimum) {
    errMessage = messageTemplate.minimum(minimum)
    notMessage = messageTemplate.maximum(minimum - 1)
  } else if (maximum) {
    errMessage = messageTemplate.maximum(maximum)
    notMessage = messageTemplate.minimum(maximum + 1)
  }
  return function Length(value) {
    Validator.call(this)
    errMsg = errMessage
    notMsg = notMessage
    if (maximum) {
      return minimum <= value.length <= maximum
    }
    return minimum <= value.length
  }
}

/**
 @function Contains
 @param {*} contained
 @description Use to ensure that the value of the key
    being validated contains the value passed
    into the Contains validator. Works with
    any type that supports the 'in' syntax.
 @example
  var validations = {
    field: [Contains(3)]
  }
  var passes = {field: [1, 2, 3]}
  var fails  = {field: [4, 5, 6]}
*/
function Contains(contained) {
  return function Contains(container) {
    Validator.call(this)
    errMsg = `must contain ${contained}`
    notMsg = `must not contain ${contained}`
    if (container instanceof Array || typeof container === 'string') {
      return container.includes(contained)
    }
    return contained in container
  }
}

/**
 @function Then
 @param {*} validation
 @description Special validator for use as
    part of the If rule.
    If the conditional part of the validation
    passes, then this is used to apply another
    set of dependent rules.
 @example
 var validations = {
   foo: [If(Equals(1), Then({bar: [Equals(2)]}))]
  }
  var passes = {foo: 1, bar: 2}
  var also_passes = {foo: 2, bar: 3}
  var fails = {foo: 1, bar: 3}
*/
function Then(validation) {
  return function Then(dictionary) {
    return validate(validation, dictionary)
  }
}

/**
 @function If
 @param {*} validator
 @param {*} thenClause
 @description Special conditional validator.
    If the validator passed as the first
    parameter to this function passes,
    then a second set of rules will be
    applied to the dictionary.
 @example
 var validations = {
  foo: [If(Equals(1), Then({bar: [Equals(2)]}))]
  }
  passes = {foo: 1, bar: 2}
  also_passes = {foo: 2, bar: 3}
  fails = {foo: 1, bar: 3}
*/
function If(validator, thenClause) {
  function If(value, dictionary) {
    var conditional = false,
      dependent = function dependent() { }
    Validator.call(this)
    if (validator(value)) {
      conditional = true
      dependent = thenClause(dictionary)
    }
    return [conditional, dependent]
  }
  If.prototype.isIf = true
  return If
}

/**
 @function Each
 @param {*} validations
 @description Each applies a set of validations to each
    element in a collection individually.
    If Each is specified with a list of validators,
    then it will apply each of the validators
    to each element in the collection to be validated.
 @example
  var dictionary = {
    list_of_length_1: [1],
    list_of_lists_of_length_1: [[1], [1], [1]]
  }
  var validation = {
    list_of_length_1: [Length(1)],
    list_of_lists_of_length_1: [Each([Length(1)])]
  }
*/
/**
  @description If Each is instead specified with a dictionary,
  Each treats it as a full validation to be applied
  to each element in the collection to be validated.
  @example
  var dictionary = {
    list_of_dictionaries: [
          {name: 'spam', meal: 'lunch'}
          {name: 'eggs', meal: 'breakfast'},
          {name: 'steak', meal: 'dinner'}
      ]
  }
  var validation = {
    list_of_dictionaries: [
        Each({
          name: [Required, Length(4)],
          meal: [Required, In(['breakfast', 'lunch', 'dinner'])]
        })]
  }
*/
function Each(validations) {
  return function Each(container) {
    let errors = [], valid, err
    if (validations instanceof Array) {
      container.forEach((item) => {
        validations.forEach((v) => {
          valid = v(item)
          if (!valid) {
            errors.push(`all values ${errMsg}`)
          }
        })
      })
    } else if (Object.prototype.toString.call(validations) === '[object Object]') {
      for (let [index, item] of Object.entries(container)) {
        [valid, err] = validate(validations, item)
        if (!valid) {
          errors[index] = err
        }
      }
    }
    return [errors.length === 0, errors]
  }
}

function _validateListHelper(validation, dictionary, key, errors) {
  for (let v of validation[key]) {
    if (key in dictionary) {
      if (Object.prototype.toString.call(v) === '[object Object]') {
        let [valid, nestedErrors] = validate(v, dictionary[key])
        if (!valid) {
          errors[key].push(nestedErrors)
        }
        continue
      }
      if (v !== Required) {
        if (v instanceof Function && 'isIf' in v.prototype) {
          let [conditional, dependent] = v(dictionary[key], dictionary)
          if (conditional && Object.keys(dependent[1]).length > 0) {
            errors[key].push(dependent[1])
          }
        } else {
          _validateAndStoreErrs(v, dictionary, key, errors)
        }
      }
    }
  }
}

function _validateAndStoreErrs(validator, dictionary, key, errors) {
  /*
   Validations shouldn't throw exceptions because of
   type mismatches and the like. If the rule is 'Length(5)' and
   the value in the field is 5, that should be a validation failure,
   not a TypeError because you can't call len() on an int.
   It's not ideal to have to hide exceptions like this because
   there could be actual problems with a validator, but we're just going
   to have to rely on tests preventing broken things.
   */
  var valid, errs
  try {
    valid = validator(dictionary[key])
  } catch (error) {
    valid = [false, errMsg]
  }

  if (valid instanceof Array) {
    [, errs] = valid
    if (errs && (errs instanceof Array)) {
      errors[key].push(...errs)
    } else if (errs) {
      errors[key].push(errs)
    }
  } else if (!valid) {
    errors[key].push(errMsg || 'failed validation')
  }
}

/**
 * @function  validate
 * @param {*} validation
 * @param {*} dictionary
 * @description Validate that a dictionary passes a set of
    key-based validators. If all of the keys
    in the dictionary are within the parameters
    specified by the validation mapping, then
    the validation passes.
    :param validation: a mapping of keys to validators
    :type validation: dict
    :param dictionary: dictionary to be validated
    :type dictionary: dict
    :return: a tuple containing a bool indicating
    success or failure and a mapping of fields
    to error messages.
 */
function validate(validation, dictionary) {
  var errors = {}
  for (let key in validation) {
    errors[key] = []
    if (validation[key] instanceof Array) {
      if (validation[key].includes(Required)) {
        if (!Required(key, dictionary)) {
          errors[key] = ['must be present']
          continue
        }
      }
      _validateListHelper(validation, dictionary, key, errors)
    } else {
      let v = validation[key]
      if (v === Required) {
        if (!Required(key, dictionary)) {
          errors[key] = ['must be present']
        }
      } else {
        _validateAndStoreErrs(v, dictionary, key, errors)
      }
    }
    if (errors[key].length === 0) {
      delete errors[key]
    }
  }
  return ValidationResult(Object.keys(errors).length === 0, errors)
}

module.exports = {
  Validator,
  In,
  Not,
  Range,
  GreaterThan,
  LessThan,
  Equals,
  Blank,
  Truthy,
  Required,
  InstanceOf,
  SubclassOf,
  Then,
  If,
  Length,
  Contains,
  Each,
  validate,
  Pattern,
}
