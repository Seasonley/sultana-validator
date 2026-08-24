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
declare function Blank(value: string): value is "";
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
declare function Truthy(value: string): boolean;
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
declare function Required(field: string, dictionary: any): any;
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
declare function Equals(obj: any): (value: any) => boolean;
/**
* @function Not
* @param {*} validator
* @description  Use to negate the requirement
*    of another validator. Does not
*    work with Required.
*/
declare function Not(validator: any): {
    (value: any): boolean;
    isNot: boolean;
};
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
declare function In(collection: any): (value: any) => any;
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
declare function InstanceOf(baseClass: any): (value: any) => boolean;
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
declare function SubclassOf(baseClass: any): (subClass: any) => boolean;
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
declare function Pattern(reg: any): (value: any) => boolean;
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
declare function Range(start: number, end: number, inclusive?: boolean): (value: number) => boolean;
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
declare function GreaterThan(lowerBound: number, inclusive?: boolean): (value: number) => boolean;
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
declare function LessThan(upperBound: number, inclusive?: boolean): (value: number) => boolean;
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
declare function Length(minimum: number, maximum?: number): (value: string) => boolean;
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
declare function Contains(contained: string): (container: string[]) => boolean;
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
declare function Then(validation: any): (dictionary: any) => any[];
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
declare function If(validator: any, thenClause: any): (value: any, dictionary: any) => (boolean | Function)[];
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
declare function Each(validations: any): (container: any[]) => any;
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
declare function validate(validation: any, dictionary: any): any[];
export { In, Not, Range, GreaterThan, LessThan, Equals, Blank, Truthy, Required, InstanceOf, SubclassOf, Then, If, Length, Contains, Each, validate, Pattern, };
