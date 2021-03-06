"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
function template(strings) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    /* istanbul ignore next */
    return (function templ() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var dict = values[values.length - 1] || {};
        var result = [strings[0]];
        keys.forEach(function (key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}
function ValidationResult(valid, errors) {
    /* istanbul ignore next */
    return [valid, errors];
}
// @ts-ignore
var errMsg = 'failed validation';
// @ts-ignore
var notMsg = 'failed validation';
/**
* @function Blank
* @param {*} value
* @description Use to specify that the
*  value of the key being
*  validated must be equal to
*  the empty string.
*
*  This is a shortcut for saying
*  Equals("").
* @example
*  const validations = {
*    field: [Blank]
*  }
*  const passes = {field:''}
*  const fails  = {field:'four'}
*/
function Blank(value) {
    errMsg = 'must be an empty string';
    notMsg = 'must not be an empty string';
    return !value;
}
exports.Blank = Blank;
/**
* @function Truthy
* @param {*} value
* @description Use to specify that the
*    value of the key being
*    validated must be truthy,
*    i.e. would cause an if statement
*    to evaluate to True.
* @example
* const validations = {
*    field: [Truthy]
*  }
*  const passes = {field: 1}
*  const fails  = {field: 0}
*/
function Truthy(value) {
    errMsg = 'must be True-equivalent value';
    notMsg = 'must be False-equivalent value';
    return !!value;
}
exports.Truthy = Truthy;
/**
* @function Required
* @description  When added to a list of validations
*    for a dictionary key indicates that
*    the key must be present. This
*    should not be called, just inserted
*    into the list of validations.
* @example
* const validations = {
*    "field": [Required, Equals(2)]
*  }
*/
function Required(field, dictionary) {
    return field in dictionary;
}
exports.Required = Required;
/**
* @function Equals
* @param {*} obj
* @description  Use to specify that the
*    value of the key being
*    validated must be equal to
*    the value that was passed
*    to this validator.
* @example
* const validations = {
*    "field": [Equals(1)]
*  }
*  const passes = {field:1}
*  const fails  = {field:4}
*
*/
function Equals(obj) {
    var objJson = JSON.stringify(obj);
    errMsg = "must be equal to " + objJson;
    notMsg = "must not be equal to " + objJson;
    return function _Equals(value) {
        return value === obj;
    };
}
exports.Equals = Equals;
/**
* @function Not
* @param {*} validator
* @description  Use to negate the requirement
*    of another validator. Does not
*    work with Required.
*/
function Not(validator) {
    return function _Not(value) {
        return !validator(value);
    };
}
exports.Not = Not;
/**
* @function In
* @param {*} collection
* @description  Use to specify that the
*    value of the key being
*    validated must exist
*    within the collection
*    passed to this validator.
* @example
*  const validations = {
*    "field": [In([1, 2, 3])]
*  }
*  const passes = {field:1}
*  const fails  = {field:4}
*/
function In(collection) {
    return function _In(value) {
        errMsg = "must be one of " + JSON.stringify(collection);
        notMsg = "must not be one of " + JSON.stringify(collection);
        return collection.includes(value);
    };
}
exports.In = In;
/**
* @function InstanceOf
* @param {*} baseClass
* @description  Use to specify that the
*    value of the key being
*    validated must be an instance
*    of the passed in base class
*    or its subclasses.
* @example
*  class BaseClass {}
*  class SubClass extends BaseClass {}
*  const validator = {
*    classy: [Required, InstanceOf(SubClass)],
*    subclassy: [Required, InstanceOf(BaseClass)],
*    not_classy: [Required, Not(InstanceOf(SubClass))],
*    not_subclassy: [Required, Not(InstanceOf(BaseClass))],
*  }
*  const testCase = {
*    classy: new SubClass(),
*    subclassy: new BaseClass(),
*    not_classy: Object(),
*    not_subclassy: 3,
*  }
*/
function InstanceOf(baseClass) {
    return function _InstanceOf(value) {
        errMsg = "must be an instance of " + baseClass.name + " or its subclasses";
        notMsg = "must not be an instance of " + baseClass.name + " or its subclasses";
        return (value instanceof baseClass);
    };
}
exports.InstanceOf = InstanceOf;
/**
* @function SubclassOf
* @param {*} baseClass
* @description  Use to specify that the
*    value of the key being
*    validated must be a subclass
*    of the passed in base class.
* @example
* class BaseClass {}
* class SubClass extends BaseClass {}
* const validator = {
*    is_subclass: [Required, SubclassOf(BaseClass)],
*    not_subclass: [Required, Not(SubclassOf(BaseClass))],
*  }
* const testCase = {
*    is_subclass: SubClass,
*    not_subclass: Number,
*  }
*/
function SubclassOf(baseClass) {
    return function _SubclassOf(subClass) {
        errMsg = "must be a subclass of " + baseClass.name;
        notMsg = "must not be a subclass of " + baseClass.name;
        return (subClass.prototype instanceof baseClass);
    };
}
exports.SubclassOf = SubclassOf;
/**
* @function Pattern
* @param {RegExp} reg
* @description  Use to specify that the
*    value of the key being
*    validated must match the
*    pattern provided to the
*    validator.
* @example
* const validator = {
*    test_pattern: [Not(Pattern(/\d\d%/))],
*  }
*  const passes = {field: "30%"}
*  const fails  = {field: "30"}
*/
function Pattern(reg) {
    return function _Pattern(value) {
        errMsg = "must match regex " + reg.toString();
        notMsg = "must not match regex " + reg.toString();
        return reg.test(value);
    };
}
exports.Pattern = Pattern;
/**
* @function Range
* @param {Number} start
* @param {Number} end
* @param {Boolean} [inclusive=true]
* @description  Use to specify that the value of the
*    key being validated must fall between
*    the start and end values. By default
*    the range is inclusive, though the
*    range can be made excusive by setting
*    inclusive to false.
* @example
*  const validations = {
*    field: [Range(0, 10)]
*  }
*  const passes = {field: 10}
*  const fails = {field : 11}
*/
// @ts-ignore
function Range(start, end, inclusive) {
    if (inclusive === void 0) { inclusive = true; }
    return function _Range(value) {
        errMsg = "must fall between " + start + " and " + end;
        notMsg = "must not fall between " + start + " and " + end;
        if (inclusive === true) {
            return start <= value && value <= end;
        }
        return start < value && value < end;
    };
}
exports.Range = Range;
/**
* @function GreaterThan
* @param {Number} lowerBound
* @param {Boolean} [inclusive=false]
* @description Use to specify that the value of the
*    key being validated must be greater
*    than a given value. By default the
*    bound is exclusive, though the bound
*    can be made inclusive by setting
*    inclusive to true.
* @example
*  const validations = {
*    field: [GreaterThan(10)]
*  }
*  const passes = {field: 11}
*  const fails = {field : 10}
*/
function GreaterThan(lowerBound, inclusive) {
    if (inclusive === void 0) { inclusive = false; }
    return function _GreaterThan(value) {
        errMsg = "must be greater than " + lowerBound;
        notMsg = "must not be greater than " + lowerBound;
        if (inclusive === true) {
            return lowerBound <= value;
        }
        return lowerBound < value;
    };
}
exports.GreaterThan = GreaterThan;
/**
* @function LessThan
* @param {Number} upperBound
* @param {Boolean} [inclusive=false]
* @description Use to specify that the value of the
*    key being validated must be less
*    than a given value. By default the
*    bound is exclusive, though the bound
*    can be made inclusive by setting
*    inclusive to true.
* @example
*  const validations = {
*    field: [LessThan(10)]
*  }
*  const passes = {field: 9}
*  const fails = {field : 10}
*/
function LessThan(upperBound, inclusive) {
    if (inclusive === void 0) { inclusive = false; }
    return function _LessThan(value) {
        errMsg = "must be less than " + upperBound;
        notMsg = "must not be less than " + upperBound;
        if (inclusive === true) {
            return value <= upperBound;
        }
        return value < upperBound;
    };
}
exports.LessThan = LessThan;
/**
* @function Length
* @param {Number} minimum
* @param {Number} [maximum=0]
* @description Use to specify that the
*    value of the key being
*    validated must have at least
*    `minimum` elements and optionally
*    at most `maximum` elements.
*    At least one of the parameters
*    to this validator must be non-zero,
*    and neither may be negative.
* @example
*  const validations = {
*    field: [Length(0,5)]
*  }
*  const passes = {field: 'hello'}
*  const fails  = {field: 'hello world'}
*/
function Length(minimum, maximum) {
    if (maximum === void 0) { maximum = 0; }
    var messageTemplate = {
        maximum: template(templateObject_1 || (templateObject_1 = __makeTemplateObject(["must be at most ", " elements in length"], ["must be at most ", " elements in length"])), 0),
        minimum: template(templateObject_2 || (templateObject_2 = __makeTemplateObject(["must be at least ", " elements in length"], ["must be at least ", " elements in length"])), 0),
        range: template(templateObject_3 || (templateObject_3 = __makeTemplateObject(["must", "be between ", " and ", " elements in length"], ["must", "be between ", " and ", " elements in length"])), 0, 1, 2),
    };
    var errMessage;
    var notMessage;
    if (!minimum && !maximum) {
        throw new Error('Length must have a non-zero minimum or maximum parameter.');
    }
    if (minimum < 0 || maximum < 0) {
        throw new Error('Length cannot have negative parameters.');
    }
    if (minimum && maximum) {
        errMessage = messageTemplate.range(' ', minimum, maximum);
        notMessage = messageTemplate.range(' not ', minimum, maximum);
    }
    else if (minimum) {
        errMessage = messageTemplate.minimum(minimum);
        notMessage = messageTemplate.maximum(minimum - 1);
    }
    else if (maximum) {
        errMessage = messageTemplate.maximum(maximum);
        notMessage = messageTemplate.minimum(maximum + 1);
    }
    return function _Length(value) {
        errMsg = errMessage;
        notMsg = notMessage;
        if (maximum) {
            return minimum <= value.length && value.length <= maximum;
        }
        return minimum <= value.length;
    };
}
exports.Length = Length;
/**
* @function Contains
* @param {*} contained
* @description Use to ensure that the value of the key
*    being validated contains the value passed
*    into the Contains validator. Works with
*    any type that supports the 'in' syntax.
* @example
*  const validations = {
*    field: [Contains(3)]
*  }
*  const passes = {field: [1, 2, 3]}
*  const fails  = {field: [4, 5, 6]}
*/
function Contains(contained) {
    return function _Contains(container) {
        errMsg = "must contain " + contained;
        notMsg = "must not contain " + contained;
        if (container instanceof Array || typeof container === 'string') {
            return container.includes(contained);
        }
        return contained in container;
    };
}
exports.Contains = Contains;
/**
* @function Then
* @param {*} validation
* @description Special validator for use as
*    part of the If rule.
*    If the conditional part of the validation
*    passes, then this is used to apply another
*    set of dependent rules.
* @example
* const validations = {
*  foo: [If(Equals(1), Then({bar: [Equals(2)]}))]
* }
* const passes = {foo: 1, bar: 2}
* const also_passes = {foo: 2, bar: 3}
* const fails = {foo: 1, bar: 3}
*/
function Then(validation) {
    return function _Then(dictionary) {
        return validate(validation, dictionary);
    };
}
exports.Then = Then;
/**
* @function If
* @param {*} validator
* @param {*} thenClause
* @description Special conditional validator.
*    If the validator passed as the first
*    parameter to this function passes,
*    then a second set of rules will be
*    applied to the dictionary.
*/
function If(validator, thenClause) {
    function _If(value, dictionary) {
        var conditional = false;
        var dependent = Function();
        if (validator(value)) {
            conditional = true;
            dependent = thenClause(dictionary);
        }
        return [conditional, dependent];
    }
    _If.prototype.isIf = true;
    return _If;
}
exports.If = If;
/**
* @function Each
* @param {*} validations
* @description Each applies a set of validations to each
*    element in a collection individually.
*    If Each is specified with a list of validators,
*    then it will apply each of the validators
*    to each element in the collection to be validated.
* @example
*  const dictionary = {
*    list_of_length_1: [1],
*    list_of_lists_of_length_1: [[1], [1], [1]]
*  }
*  const validation = {
*    list_of_length_1: [Length(1)],
*    list_of_lists_of_length_1: [Each([Length(1)])]
*  }
*/
/**
*  @description If Each is instead specified with a dictionary,
*  Each treats it as a full validation to be applied
*  to each element in the collection to be validated.
*  @example
*  const dictionary = {
*    list_of_dictionaries: [
*          {name: 'spam', meal: 'lunch'}
*          {name: 'eggs', meal: 'breakfast'},
*          {name: 'steak', meal: 'dinner'}
*      ]
*  }
*  const validation = {
*    list_of_dictionaries: [
*        Each({
*          name: [Required, Length(4)],
*          meal: [Required, In(['breakfast', 'lunch', 'dinner'])]
*        })]
*  }
*/
function Each(validations) {
    return function _Each(container) {
        var _a;
        var errors = [];
        var valid;
        var err;
        if (validations instanceof Array) {
            container.forEach(function (item) {
                validations.forEach(function (v) {
                    valid = v(item);
                    if (!valid) {
                        errors.push("all values " + errMsg);
                    }
                });
            });
        }
        else if (Object.prototype.toString.call(validations) === '[object Object]') {
            for (var _i = 0, _b = Object.entries(container); _i < _b.length; _i++) {
                var _c = _b[_i], index = _c[0], item = _c[1];
                _a = validate(validations, item), valid = _a[0], err = _a[1];
                if (!valid) {
                    errors[+index] = err;
                }
            }
        }
        return [errors.length === 0, errors];
    };
}
exports.Each = Each;
function _validateListHelper(validation, dictionary, key, errors) {
    for (var _i = 0, _a = validation[key]; _i < _a.length; _i++) {
        var v = _a[_i];
        if (key in dictionary) {
            if (Object.prototype.toString.call(v) === '[object Object]') {
                var _b = validate(v, dictionary[key]), valid = _b[0], nestedErrors = _b[1];
                if (!valid) {
                    errors[key].push(nestedErrors);
                }
                continue;
            }
            if (v !== Required) {
                if (v instanceof Function && 'isIf' in v.prototype) {
                    var _c = v(dictionary[key], dictionary), conditional = _c[0], dependent = _c[1];
                    if (conditional && Object.keys(dependent[1]).length > 0) {
                        errors[key].push(dependent[1]);
                    }
                }
                else {
                    _validateAndStoreErrs(v, dictionary, key, errors);
                }
            }
        }
    }
}
function _validateAndStoreErrs(validator, dictionary, key, errors) {
    var _a;
    /*
     Validations shouldn't throw exceptions because of
     type mismatches and the like. If the rule is 'Length(5)' and
     the value in the field is 5, that should be a validation failure,
     not a TypeError because you can't call len() on an int.
     It's not ideal to have to hide exceptions like this because
     there could be actual problems with a validator, but we're just going
     to have to rely on tests preventing broken things.
     */
    var valid;
    var errs;
    try {
        valid = validator(dictionary[key]);
    }
    catch (error) {
        valid = [false, errMsg];
    }
    if (valid instanceof Array) {
        errs = valid[1];
        if (errs && (errs instanceof Array)) {
            (_a = errors[key]).push.apply(_a, errs);
        }
        else if (errs) {
            errors[key].push(errs);
        }
    }
    else if (!valid) {
        errors[key].push(errMsg);
    }
}
/**
* @function  validate
* @param {*} validation
* @param {*} dictionary
* @description Validate that a dictionary passes a set of
*  key-based validators. If all of the keys
*  in the dictionary are within the parameters
*  specified by the validation mapping, then
*  the validation passes.
*  :param validation: a mapping of keys to validators
*  :type validation: dict
*  :param dictionary: dictionary to be validated
*  :type dictionary: dict
*  :return: a tuple containing a bool indicating
*  success or failure and a mapping of fields
*  to error messages.
*/
function validate(validation, dictionary) {
    var errors = {};
    for (var _i = 0, _a = Object.keys(validation); _i < _a.length; _i++) {
        var key = _a[_i];
        errors[key] = [];
        if (validation[key] instanceof Array) {
            if (validation[key].includes(Required)) {
                if (!Required(key, dictionary)) {
                    errors[key] = ['must be present'];
                    continue;
                }
            }
            _validateListHelper(validation, dictionary, key, errors);
        }
        else {
            var v = validation[key];
            if (v === Required) {
                if (!Required(key, dictionary)) {
                    errors[key] = ['must be present'];
                }
            }
            else {
                _validateAndStoreErrs(v, dictionary, key, errors);
            }
        }
        if (errors[key].length === 0) {
            delete errors[key];
        }
    }
    return ValidationResult(Object.keys(errors).length === 0, errors);
}
exports.validate = validate;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=index.js.map