
function ValidationResult(valid, errors) {
  return [valid, errors]
}

function Validator() {
  this.err_message = 'failed validation'
  this.not_message = 'failed validation'
}

function Blank(value) {
  Validator.call(this)
  this.err_message = 'must be an empty string'
  this.not_message = 'must not be an empty string'
  return value === ''
}

function Truthy(value) {
  Validator.call(this)
  this.err_message = 'must be True-equivalent value'
  this.not_message = 'must be False-equivalent value'
  return !!value
}

function Required(field, dictionary) {
  return field in dictionary
}

function Equals(obj) {
  const objJson = JSON.stringify(obj)
  return function Equals(value) {
    Validator.call(this)
    this.err_message = `must be equal to ${objJson}`
    this.not_message = `must not be equal to ${objJson}`
    return value === obj
  }
}

function Not(validator) {
  return function Not(value) {
    Validator.call(this)
    this.err_message = this.err_message || 'failed validation'
    this.not_message = this.not_message || 'failed validation'
    return !validator(value)
  }
}

function Range(start, end, inclusive = true) {
  return function Range(value) {
    Validator.call(this)
    this.err_message = `must fall between ${start} and ${end}`
    this.not_message = `must not fall between ${start} and ${end}`
    if (inclusive === true) {
      return start <= value && value <= end
    }
    return start < value && value < end
  }
}
function InstanceOf(baseClass) {
  return function InstanceOf(value) {
    Validator.call(this)
    this.err_message = `must be an instance of ${baseClass.name} or its subclasses`
    this.not_message = `must not be an instance of ${baseClass.name} or its subclasses`
    return (value instanceof baseClass)
  }
}

function In(collection) {
  return function In(value) {
    Validator.call(this)
    this.err_message = 'must be one of' % collection
    this.not_message = 'must not be one of' % collection
    return collection.includes(value)
  }
}

function GreaterThan() {}

function LessThan() {}

function SubclassOf() {}

function Then() {}

function If() {}

function Length() {}

function Contains() {}

function Each() {}

function Pattern(reg) {
  return function Pattern(value) {
    this.err_message = `must match regex ${reg.toString()}`
    this.not_message = `must not match regex ${reg.toString()}`
    return reg.test(value)
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
        if (v instanceof If) {
          let [conditional, dependent] = v(dictionary[key], dictionary)
          if (conditional && dependent[1]) {
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
    valid = [false, validator.err_message]
  }

  if (valid instanceof Array) {
    [, errs] = valid
    if (errs && (errs instanceof Array)) {
      errors[key].push(...errs)
    } else if (errs) {
      errors[key].push(errs)
    }
  } else if (!valid) {
    errors[key].push(validator.err_message || 'failed validation')
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
