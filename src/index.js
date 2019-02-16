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

function Blank(value) {
  Validator.call(this)
  errMsg = 'must be an empty string'
  notMsg = 'must not be an empty string'
  return value === ''
}

function Truthy(value) {
  Validator.call(this)
  errMsg = 'must be True-equivalent value'
  notMsg = 'must be False-equivalent value'
  return !!value
}

function Required(field, dictionary) {
  return field in dictionary
}

function Equals(obj) {
  const objJson = JSON.stringify(obj)
  errMsg = `must be equal to ${objJson}`
  notMsg = `must not be equal to ${objJson}`
  return function Equals(value) {
    return value === obj
  }
}

function Not(validator) {
  return function Not(value) {
    Validator.call(this)
    errMsg = errMsg || 'failed validation'
    notMsg = notMsg || 'failed validation'
    return !validator(value)
  }
}

function In(collection) {
  return function In(value) {
    Validator.call(this)
    errMsg = `must be one of ${JSON.stringify(collection)}`
    notMsg = `must not be one of ${JSON.stringify(collection)}`
    return collection.includes(value)
  }
}

function InstanceOf(baseClass) {
  return function InstanceOf(value) {
    Validator.call(this)
    errMsg = `must be an instance of ${baseClass.name} or its subclasses`
    notMsg = `must not be an instance of ${baseClass.name} or its subclasses`
    return (value instanceof baseClass)
  }
}

function SubclassOf(baseClass) {
  return function SubclassOf(subClass) {
    Validator.call(this)
    errMsg = `must be a subclass of ${baseClass.name}`
    notMsg = `must not be a subclass of ${baseClass.name}`
    return (subClass.prototype instanceof baseClass)
  }
}

function Pattern(reg) {
  return function Pattern(value) {
    errMsg = `must match regex ${reg.toString()}`
    notMsg = `must not match regex ${reg.toString()}`
    return reg.test(value)
  }
}


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

function Then(validation) {
  return function Then(dictionary) {
    return validate(validation, dictionary)
  }
}

function If(validator, thenClause) {
  function If(value, dictionary) {
    var conditional = false,
      dependent = function dependent() {}
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
      if (v instanceof Array) {
        let [, nestedErrors] = validate(v, dictionary[key])
        if (nestedErrors) {
          errors[key].append(nestedErrors)
        }
        continue
      }
      if (v !== Required) {
        if ('isIf' in v.prototype) {
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

export {
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
