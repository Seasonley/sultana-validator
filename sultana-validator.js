/*sultana-validator v0.1.0
A library for validating as same as validator.py
MIT License Copyright (c) 2018 seasonley
https://github.com/Seasonley/sultana-validator*/
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

  function Validator() {
    this.errMsg = 'failed validation';
    this.notMsg = 'failed validation';
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
    Validator.call(this);
    this.errMsg = 'must be an empty string';
    this.notMsg = 'must not be an empty string';
    return !value;
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
    Validator.call(this);
    this.errMsg = 'must be True-equivalent value';
    this.notMsg = 'must be False-equivalent value';
    return !!value;
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
    return field in dictionary;
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
    var objJson = JSON.stringify(obj);
    this.errMsg = "must be equal to ".concat(objJson);
    this.notMsg = "must not be equal to ".concat(objJson);
    return function Equals(value) {
      return value === obj;
    };
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
      Validator.call(this);
      return !validator(value);
    };
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
      Validator.call(this);
      this.errMsg = "must be one of ".concat(JSON.stringify(collection));
      this.notMsg = "must not be one of ".concat(JSON.stringify(collection));
      return collection.includes(value);
    };
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
      Validator.call(this);
      this.errMsg = "must be an instance of ".concat(baseClass.name, " or its subclasses");
      this.notMsg = "must not be an instance of ".concat(baseClass.name, " or its subclasses");
      return value instanceof baseClass;
    };
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
      Validator.call(this);
      this.errMsg = "must be a subclass of ".concat(baseClass.name);
      this.notMsg = "must not be a subclass of ".concat(baseClass.name);
      return subClass.prototype instanceof baseClass;
    };
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
      this.errMsg = "must match regex ".concat(reg.toString());
      this.notMsg = "must not match regex ".concat(reg.toString());
      return reg.test(value);
    };
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


  function Range(start, end) {
    var inclusive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return function Range(value) {
      Validator.call(this);
      this.errMsg = "must fall between ".concat(start, " and ").concat(end);
      this.notMsg = "must not fall between ".concat(start, " and ").concat(end);

      if (inclusive === true) {
        return start <= value && value <= end;
      }

      return start < value && value < end;
    };
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


  function GreaterThan(lowerBound) {
    var inclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function Range(value) {
      Validator.call(this);
      this.errMsg = "must be greater than ".concat(lowerBound);
      this.notMsg = "must not be greater than ".concat(lowerBound);

      if (inclusive === true) {
        return lowerBound <= value;
      }

      return lowerBound < value;
    };
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


  function LessThan(upperBound) {
    var inclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function Range(value) {
      Validator.call(this);
      this.errMsg = "must be less than ".concat(upperBound);
      this.notMsg = "must not be less than ".concat(upperBound);

      if (inclusive === true) {
        return value <= upperBound;
      }

      return value < upperBound;
    };
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
      this.errMsg = errMessage;
      this.notMsg = notMessage;

      if (maximum) {
        return minimum <= value.length <= maximum;
      }

      return minimum <= value.length;
    };
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
      Validator.call(this);
      this.errMsg = "must contain ".concat(contained);
      this.notMsg = "must not contain ".concat(contained);

      if (container instanceof Array || typeof container === 'string') {
        return container.includes(contained);
      }

      return contained in container;
    };
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
      return validate(validation, dictionary);
    };
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
  */


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
      var _this = this;

      var errors = [],
          valid,
          err;

      if (validations instanceof Array) {
        container.forEach(function (item) {
          validations.forEach(function (v) {
            valid = v(item);

            if (!valid) {
              errors.push("all values ".concat(_this.errMsg));
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
          if (Object.prototype.toString.call(v) === '[object Object]') {
            var _validate3 = validate(v, dictionary[key]),
                _validate4 = babelHelpers.slicedToArray(_validate3, 2),
                valid = _validate4[0],
                nestedErrors = _validate4[1];

            if (!valid) {
              errors[key].push(nestedErrors);
            }

            continue;
          }

          if (v !== Required) {
            if (v instanceof Function && 'isIf' in v.prototype) {
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
    /*
     Validations shouldn't throw exceptions because of
     type mismatches and the like. If the rule is 'Length(5)' and
     the value in the field is 5, that should be a validation failure,
     not a TypeError because you can't call len() on an int.
     It's not ideal to have to hide exceptions like this because
     there could be actual problems with a validator, but we're just going
     to have to rely on tests preventing broken things.
     */
    var valid, errs;

    try {
      valid = validator(dictionary[key]);
    } catch (error) {
      valid = [false, validator.errMsg];
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
      errors[key].push(this.errMsg);
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
