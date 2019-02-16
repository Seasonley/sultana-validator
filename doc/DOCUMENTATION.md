## Functions

<dl>
<dt><a href="#Blank">Blank(value)</a></dt>
<dd><p>Use to specify that the
  value of the key being
  validated must be equal to
  the empty string.</p>
<p>  This is a shortcut for saying
  Equals(&quot;&quot;).</p>
</dd>
<dt><a href="#Truthy">Truthy(value)</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must be truthy,
    i.e. would cause an if statement
    to evaluate to True.</p>
</dd>
<dt><a href="#Required">Required()</a></dt>
<dd><p>When added to a list of validations
    for a dictionary key indicates that
    the key must be present. This
    should not be called, just inserted
    into the list of validations.</p>
</dd>
<dt><a href="#Equals">Equals(obj)</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must be equal to
    the value that was passed
    to this validator.</p>
</dd>
<dt><a href="#Not">Not(validator)</a></dt>
<dd><p>Use to negate the requirement
    of another validator. Does not
    work with Required.</p>
</dd>
<dt><a href="#In">In(collection)</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must exist
    within the collection
    passed to this validator.</p>
</dd>
<dt><a href="#InstanceOf">InstanceOf(baseClass)</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must be an instance
    of the passed in base class
    or its subclasses.</p>
</dd>
<dt><a href="#SubclassOf">SubclassOf(baseClass)</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must be a subclass
    of the passed in base class.</p>
</dd>
<dt><a href="#Pattern">Pattern(reg)</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must match the
    pattern provided to the
    validator.</p>
</dd>
<dt><a href="#Range">Range(start, end, [inclusive])</a></dt>
<dd><p>Use to specify that the value of the
    key being validated must fall between
    the start and end values. By default
    the range is inclusive, though the
    range can be made excusive by setting
    inclusive to false.</p>
</dd>
<dt><a href="#GreaterThan">GreaterThan(lowerBound, [inclusive])</a></dt>
<dd><p>Use to specify that the value of the
    key being validated must be greater
    than a given value. By default the
    bound is exclusive, though the bound
    can be made inclusive by setting
    inclusive to true.</p>
</dd>
<dt><a href="#LessThan">LessThan(upperBound, [inclusive])</a></dt>
<dd><p>Use to specify that the value of the
    key being validated must be less
    than a given value. By default the
    bound is exclusive, though the bound
    can be made inclusive by setting
    inclusive to true.</p>
</dd>
<dt><a href="#Length">Length(minimum, [maximum])</a></dt>
<dd><p>Use to specify that the
    value of the key being
    validated must have at least
    <code>minimum</code> elements and optionally
    at most <code>maximum</code> elements.
    At least one of the parameters
    to this validator must be non-zero,
    and neither may be negative.</p>
</dd>
<dt><a href="#Contains">Contains(contained)</a></dt>
<dd><p>Use to ensure that the value of the key
    being validated contains the value passed
    into the Contains validator. Works with
    any type that supports the &#39;in&#39; syntax.</p>
</dd>
<dt><a href="#Then">Then(validation)</a></dt>
<dd><p>Special validator for use as
    part of the If rule.
    If the conditional part of the validation
    passes, then this is used to apply another
    set of dependent rules.</p>
</dd>
<dt><a href="#If">If(validator, thenClause)</a></dt>
<dd><p>Special conditional validator.
    If the validator passed as the first
    parameter to this function passes,
    then a second set of rules will be
    applied to the dictionary.</p>
</dd>
<dt><a href="#Each">Each(validations)</a></dt>
<dd><p>Each applies a set of validations to each
    element in a collection individually.
    If Each is specified with a list of validators,
    then it will apply each of the validators
    to each element in the collection to be validated.</p>
</dd>
<dt><a href="#Each">Each()</a></dt>
<dd><p>If Each is instead specified with a dictionary,
  Each treats it as a full validation to be applied
  to each element in the collection to be validated.</p>
</dd>
<dt><a href="#validate">validate(validation, dictionary)</a></dt>
<dd><p>Validate that a dictionary passes a set of
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
    to error messages.</p>
</dd>
</dl>

<a name="Blank"></a>

## Blank(value)
Use to specify that the
  value of the key being
  validated must be equal to
  the empty string.

  This is a shortcut for saying
  Equals("").

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

**Example**  
```js
var validations = {
    field: [Blank]
  }
  var passes = {field:''}
  var fails  = {field:'four'}
```
<a name="Truthy"></a>

## Truthy(value)
Use to specify that the
    value of the key being
    validated must be truthy,
    i.e. would cause an if statement
    to evaluate to True.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

**Example**  
```js
var validations = {
    field: [Truthy]
  }
  var passes = {field: 1}
  var fails  = {field: 0}
```
<a name="Required"></a>

## Required()
When added to a list of validations
    for a dictionary key indicates that
    the key must be present. This
    should not be called, just inserted
    into the list of validations.

**Kind**: global function  
**Example**  
```js
var validations = {
    "field": [Required, Equals(2)]
  }
```
<a name="Equals"></a>

## Equals(obj)
Use to specify that the
    value of the key being
    validated must be equal to
    the value that was passed
    to this validator.

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>\*</code> | 

**Example**  
```js
var validations = {
    "field": [Equals(1)]
  }
  var passes = {field:1}
  var fails  = {field:4}
}
```
<a name="Not"></a>

## Not(validator)
Use to negate the requirement
    of another validator. Does not
    work with Required.

**Kind**: global function  

| Param | Type |
| --- | --- |
| validator | <code>\*</code> | 

<a name="In"></a>

## In(collection)
Use to specify that the
    value of the key being
    validated must exist
    within the collection
    passed to this validator.

**Kind**: global function  

| Param | Type |
| --- | --- |
| collection | <code>\*</code> | 

**Example**  
```js
var validations = {
    "field": [In([1, 2, 3])]
  }
  var passes = {field:1}
  var fails  = {field:4}
}
```
<a name="InstanceOf"></a>

## InstanceOf(baseClass)
Use to specify that the
    value of the key being
    validated must be an instance
    of the passed in base class
    or its subclasses.

**Kind**: global function  

| Param | Type |
| --- | --- |
| baseClass | <code>\*</code> | 

**Example**  
```js
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
```
<a name="SubclassOf"></a>

## SubclassOf(baseClass)
Use to specify that the
    value of the key being
    validated must be a subclass
    of the passed in base class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| baseClass | <code>\*</code> | 

**Example**  
```js
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
```
<a name="Pattern"></a>

## Pattern(reg)
Use to specify that the
    value of the key being
    validated must match the
    pattern provided to the
    validator.

**Kind**: global function  

| Param | Type |
| --- | --- |
| reg | <code>RegExp</code> | 

**Example**  
```js
var validator = {
    test_pattern: [Not(Pattern(/\d\d%/))],
  }
  var passes = {field: "30%"}
  var fails  = {field: "30"}
```
<a name="Range"></a>

## Range(start, end, [inclusive])
Use to specify that the value of the
    key being validated must fall between
    the start and end values. By default
    the range is inclusive, though the
    range can be made excusive by setting
    inclusive to false.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| start | <code>Number</code> |  | 
| end | <code>Number</code> |  | 
| [inclusive] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
var validations = {
    field: [Range(0, 10)]
  }
  var passes = {field: 10}
  var fails = {field : 11}
```
<a name="GreaterThan"></a>

## GreaterThan(lowerBound, [inclusive])
Use to specify that the value of the
    key being validated must be greater
    than a given value. By default the
    bound is exclusive, though the bound
    can be made inclusive by setting
    inclusive to true.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| lowerBound | <code>Number</code> |  | 
| [inclusive] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
var validations = {
    field: [GreaterThan(10)]
  }
  var passes = {field: 11}
  var fails = {field : 10}
```
<a name="LessThan"></a>

## LessThan(upperBound, [inclusive])
Use to specify that the value of the
    key being validated must be less
    than a given value. By default the
    bound is exclusive, though the bound
    can be made inclusive by setting
    inclusive to true.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| upperBound | <code>Number</code> |  | 
| [inclusive] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
var validations = {
    field: [LessThan(10)]
  }
  var passes = {field: 9}
  var fails = {field : 10}
```
<a name="Length"></a>

## Length(minimum, [maximum])
Use to specify that the
    value of the key being
    validated must have at least
    `minimum` elements and optionally
    at most `maximum` elements.
    At least one of the parameters
    to this validator must be non-zero,
    and neither may be negative.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| minimum | <code>Number</code> |  | 
| [maximum] | <code>Number</code> | <code>0</code> | 

**Example**  
```js
var validations = {
    field: [Length(0,5)]
  }
  var passes = {field: 'hello'}
  var fails  = {field: 'hello world'}
```
<a name="Contains"></a>

## Contains(contained)
Use to ensure that the value of the key
    being validated contains the value passed
    into the Contains validator. Works with
    any type that supports the 'in' syntax.

**Kind**: global function  

| Param | Type |
| --- | --- |
| contained | <code>\*</code> | 

**Example**  
```js
var validations = {
    field: [Contains(3)]
  }
  var passes = {field: [1, 2, 3]}
  var fails  = {field: [4, 5, 6]}
```
<a name="Then"></a>

## Then(validation)
Special validator for use as
    part of the If rule.
    If the conditional part of the validation
    passes, then this is used to apply another
    set of dependent rules.

**Kind**: global function  

| Param | Type |
| --- | --- |
| validation | <code>\*</code> | 

**Example**  
```js
var validations = {
   foo: [If(Equals(1), Then({bar: [Equals(2)]}))]
  }
  var passes = {foo: 1, bar: 2}
  var also_passes = {foo: 2, bar: 3}
  var fails = {foo: 1, bar: 3}
```
<a name="If"></a>

## If(validator, thenClause)
Special conditional validator.
    If the validator passed as the first
    parameter to this function passes,
    then a second set of rules will be
    applied to the dictionary.

**Kind**: global function  

| Param | Type |
| --- | --- |
| validator | <code>\*</code> | 
| thenClause | <code>\*</code> | 

**Example**  
```js
var validations = {
  foo: [If(Equals(1), Then({bar: [Equals(2)]}))]
  }
  passes = {foo: 1, bar: 2}
  also_passes = {foo: 2, bar: 3}
  fails = {foo: 1, bar: 3}
```
<a name="Each"></a>

## Each(validations)
Each applies a set of validations to each
    element in a collection individually.
    If Each is specified with a list of validators,
    then it will apply each of the validators
    to each element in the collection to be validated.

**Kind**: global function  

| Param | Type |
| --- | --- |
| validations | <code>\*</code> | 

**Example**  
```js
var dictionary = {
    list_of_length_1: [1],
    list_of_lists_of_length_1: [[1], [1], [1]]
  }
  var validation = {
    list_of_length_1: [Length(1)],
    list_of_lists_of_length_1: [Each([Length(1)])]
  }
```
<a name="Each"></a>

## Each()
If Each is instead specified with a dictionary,
  Each treats it as a full validation to be applied
  to each element in the collection to be validated.

**Kind**: global function  
**Example**  
```js
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
```
<a name="validate"></a>

## validate(validation, dictionary)
Validate that a dictionary passes a set of
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

**Kind**: global function  

| Param | Type |
| --- | --- |
| validation | <code>\*</code> | 
| dictionary | <code>\*</code> | 

