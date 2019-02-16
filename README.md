# sultana-validator

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][npm-url]
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSeasonley%2Fsultana-validator.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FSeasonley%2Fsultana-validator?ref=badge_shield)

A library for validating as same as <a href="https://github.com/mansam/validator.py">validator.py</a>

# Documentation

This README has some basic usage information, but more detailed documentation may be found at <a href="https://github.com/Seasonley/validator.js/blob/master/doc/DOCMEnTATION">here</a>.

# Install

```bash
npm install sultana-vaidator
```

# Usage Example

```javascript
import {
  Required, Not, Truthy, Blank, Range, Equals, In, validate
} from 'sultana-validator'

// let's say that my dictionary needs to meet the following rules...
let rules = {
  foo: [Required, Equals(123)],
  bar: [Required, Truthy()],
  baz: [In(['spam', 'eggs', 'bacon'])],
  qux: [Not(Range(1, 100))], // by default, Range is inclusive
}

// then this following dict would pass:
let passes = {
  foo: 123,
  bar: true, // or a non-empty string, or a non-zero int, etc...
  baz: 'spam',
  qux: 101,
}
validate(rules, passes)
// [true, {}]

// but this one would fail
let fails = {
  foo: 321,
  bar: false, // or 0, or [], or an empty string, etc...
  baz: 'barf',
  qux: 99,
}
validate(rules, fails)
// (false,
//  {
//  foo: ["must be equal to '123'"],
//  bar: ['must be True-equivalent value'],
//  baz: ["must be one of ['spam', 'eggs', 'bacon']"],
//  qux: ['must not fall between 1 and 100']
//  })

```

# License

[MIT](https://github.com/Seasonley/validator.js/blob/master/LICENSE)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSeasonley%2Fsultana-validator.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FSeasonley%2Fsultana-validator?ref=badge_large)

# Change Log

<a href="https://github.com/Seasonley/validator.js/blob/master/doc/CHANGELOG.md">click here.</a>

[downloads-image]: http://img.shields.io/npm/dm/sultana-validator.svg
[npm-url]: https://npmjs.org/package/sultana-validator
[npm-image]: http://img.shields.io/npm/v/sultana-validator.svg

[travis-url]: https://travis-ci.org/Seasonley/validator.js
[travis-image]: http://img.shields.io/travis/Seasonley/validator.js.svg