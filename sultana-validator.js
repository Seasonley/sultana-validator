/*sultana-validator v0.0.3
A library for validating as same as validator.py
MIT License Copyright (c) 2018 seasonley
https://github.com/Seasonley/validator.js*/
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _templateObject3() {
    var data = babelHelpers.taggedTemplateLiteral(["must", "be between ", " and ", " elements in length"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    var data = babelHelpers.taggedTemplateLiteral(["must be at least ", " elements in length"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = babelHelpers.taggedTemplateLiteral(["must be at most ", " elements in length"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function template(strings) {
    for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    return function templ() {
      for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        values[_key2] = arguments[_key2];
      }

      var dict = values[values.length - 1] || {};
      var result = [strings[0]];
      keys.forEach(function (key, i) {
        var value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    };
  }

  function ValidationResult(valid, errors) {
    return [valid, errors];
  }

  var errMsg = '',
      notMsg = '';

  function Validator() {
    errMsg = 'failed validation';
    notMsg = 'failed validation';
  }

  function Blank(value) {
    Validator.call(this);
    errMsg = 'must be an empty string';
    notMsg = 'must not be an empty string';
    return value === '';
  }

  function Truthy(value) {
    Validator.call(this);
    errMsg = 'must be True-equivalent value';
    notMsg = 'must be False-equivalent value';
    return !!value;
  }

  function Required(field, dictionary) {
    return field in dictionary;
  }

  function Equals(obj) {
    var objJson = JSON.stringify(obj);
    errMsg = "must be equal to ".concat(objJson);
    notMsg = "must not be equal to ".concat(objJson);
    return function Equals(value) {
      return value === obj;
    };
  }

  function Not(validator) {
    return function Not(value) {
      Validator.call(this);
      errMsg = errMsg || 'failed validation';
      notMsg = notMsg || 'failed validation';
      return !validator(value);
    };
  }

  function In(collection) {
    return function In(value) {
      Validator.call(this);
      errMsg = "must be one of ".concat(JSON.stringify(collection));
      notMsg = "must not be one of ".concat(JSON.stringify(collection));
      return collection.includes(value);
    };
  }

  function InstanceOf(baseClass) {
    return function InstanceOf(value) {
      Validator.call(this);
      errMsg = "must be an instance of ".concat(baseClass.name, " or its subclasses");
      notMsg = "must not be an instance of ".concat(baseClass.name, " or its subclasses");
      return value instanceof baseClass;
    };
  }

  function SubclassOf(baseClass) {
    return function SubclassOf(subClass) {
      Validator.call(this);
      errMsg = "must be a subclass of ".concat(baseClass.name);
      notMsg = "must not be a subclass of ".concat(baseClass.name);
      return subClass.prototype instanceof baseClass;
    };
  }

  function Pattern(reg) {
    return function Pattern(value) {
      errMsg = "must match regex ".concat(reg.toString());
      notMsg = "must not match regex ".concat(reg.toString());
      return reg.test(value);
    };
  }

  function Range(start, end) {
    var inclusive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return function Range(value) {
      Validator.call(this);
      errMsg = "must fall between ".concat(start, " and ").concat(end);
      notMsg = "must not fall between ".concat(start, " and ").concat(end);

      if (inclusive === true) {
        return start <= value && value <= end;
      }

      return start < value && value < end;
    };
  }

  function GreaterThan(lowerBound) {
    var inclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function Range(value) {
      Validator.call(this);
      errMsg = "must be greater than ".concat(lowerBound);
      notMsg = "must not be greater than ".concat(lowerBound);

      if (inclusive === true) {
        return lowerBound <= value;
      }

      return lowerBound < value;
    };
  }

  function LessThan(upperBound) {
    var inclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function Range(value) {
      Validator.call(this);
      errMsg = "must be less than ".concat(upperBound);
      notMsg = "must not be less than ".concat(upperBound);

      if (inclusive === true) {
        return value <= upperBound;
      }

      return value < upperBound;
    };
  }

  function Length(minimum) {
    var maximum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var messageTemplate = {
      maximum: template(_templateObject(), 0),
      minimum: template(_templateObject2(), 0),
      range: template(_templateObject3(), 0, 1, 2)
    },
        errMessage,
        notMessage;

    if (!minimum && !maximum) {
      throw new Error('Length must have a non-zero minimum or maximum parameter.');
    }

    if (minimum < 0 || maximum < 0) {
      throw new Error('Length cannot have negative parameters.');
    }

    if (minimum && maximum) {
      errMessage = messageTemplate.range(' ', minimum, maximum);
      notMessage = messageTemplate.range(' not ', minimum, maximum);
    } else if (minimum) {
      errMessage = messageTemplate.minimum(minimum);
      notMessage = messageTemplate.maximum(minimum - 1);
    } else if (maximum) {
      errMessage = messageTemplate.maximum(maximum);
      notMessage = messageTemplate.minimum(maximum + 1);
    }

    return function Length(value) {
      Validator.call(this);
      errMsg = errMessage;
      notMsg = notMessage;

      if (maximum) {
        return minimum <= value.length <= maximum;
      }

      return minimum <= value.length;
    };
  }

  function Contains(contained) {
    return function Contains(container) {
      Validator.call(this);
      errMsg = "must contain ".concat(contained);
      notMsg = "must not contain ".concat(contained);

      if (container instanceof Array || typeof container === 'string') {
        return container.includes(contained);
      }

      return contained in container;
    };
  }

  function Then(validation) {
    return function Then(dictionary) {
      return validate(validation, dictionary);
    };
  }

  function If(validator, thenClause) {
    function If(value, dictionary) {
      var conditional = false,
          dependent = function dependent() {};

      Validator.call(this);

      if (validator(value)) {
        conditional = true;
        dependent = thenClause(dictionary);
      }

      return [conditional, dependent];
    }

    If.prototype.isIf = true;
    return If;
  }

  function Each(validations) {
    return function Each(container) {
      var errors = [],
          valid,
          err;

      if (validations instanceof Array) {
        container.forEach(function (item) {
          validations.forEach(function (v) {
            valid = v(item);

            if (!valid) {
              errors.push("all values ".concat(errMsg));
            }
          });
        });
      } else if (Object.prototype.toString.call(validations) === '[object Object]') {
        var _arr = Object.entries(container);

        for (var _i = 0; _i < _arr.length; _i++) {
          var _arr$_i = babelHelpers.slicedToArray(_arr[_i], 2),
              index = _arr$_i[0],
              item = _arr$_i[1];

          var _validate = validate(validations, item);

          var _validate2 = babelHelpers.slicedToArray(_validate, 2);

          valid = _validate2[0];
          err = _validate2[1];

          if (!valid) {
            errors[index] = err;
          }
        }
      }

      return [errors.length === 0, errors];
    };
  }

  function _validateListHelper(validation, dictionary, key, errors) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = validation[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (key in dictionary) {
          if (v instanceof Array) {
            var _validate3 = validate(v, dictionary[key]),
                _validate4 = babelHelpers.slicedToArray(_validate3, 2),
                nestedErrors = _validate4[1];

            if (nestedErrors) {
              errors[key].append(nestedErrors);
            }

            continue;
          }

          if (v !== Required) {
            if ('isIf' in v.prototype) {
              var _v = v(dictionary[key], dictionary),
                  _v2 = babelHelpers.slicedToArray(_v, 2),
                  conditional = _v2[0],
                  dependent = _v2[1];

              if (conditional && Object.keys(dependent[1]).length > 0) {
                errors[key].push(dependent[1]);
              }
            } else {
              _validateAndStoreErrs(v, dictionary, key, errors);
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function _validateAndStoreErrs(validator, dictionary, key, errors) {
    var valid, errs;

    try {
      valid = validator(dictionary[key]);
    } catch (error) {
      valid = [false, errMsg];
    }

    if (valid instanceof Array) {
      var _valid = valid;

      var _valid2 = babelHelpers.slicedToArray(_valid, 2);

      errs = _valid2[1];

      if (errs && errs instanceof Array) {
        var _errors$key;

        (_errors$key = errors[key]).push.apply(_errors$key, babelHelpers.toConsumableArray(errs));
      } else if (errs) {
        errors[key].push(errs);
      }
    } else if (!valid) {
      errors[key].push(errMsg || 'failed validation');
    }
  }

  function validate(validation, dictionary) {
    var errors = {};

    for (var key in validation) {
      errors[key] = [];

      if (validation[key] instanceof Array) {
        if (validation[key].includes(Required)) {
          if (!Required(key, dictionary)) {
            errors[key] = ['must be present'];
            continue;
          }
        }

        _validateListHelper(validation, dictionary, key, errors);
      } else {
        var v = validation[key];

        if (v === Required) {
          if (!Required(key, dictionary)) {
            errors[key] = ['must be present'];
          }
        } else {
          _validateAndStoreErrs(v, dictionary, key, errors);
        }
      }

      if (errors[key].length === 0) {
        delete errors[key];
      }
    }

    return ValidationResult(Object.keys(errors).length === 0, errors);
  }

  module.exports = {
    Validator: Validator,
    In: In,
    Not: Not,
    Range: Range,
    GreaterThan: GreaterThan,
    LessThan: LessThan,
    Equals: Equals,
    Blank: Blank,
    Truthy: Truthy,
    Required: Required,
    InstanceOf: InstanceOf,
    SubclassOf: SubclassOf,
    Then: Then,
    If: If,
    Length: Length,
    Contains: Contains,
    Each: Each,
    validate: validate,
    Pattern: Pattern
  };

}));
