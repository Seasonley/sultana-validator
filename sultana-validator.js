/*sultana-validator v0.0.2
A library for validating as same as validator.py
MIT License Copyright (c) 2018 seasonley
https://github.com/Seasonley/validator.js*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['sultana-validator'] = factory());
}(this, function () { 'use strict';

  function a() {
    return 'world';
  }

  function validator() {
    return "hello".concat(a());
  }

  return validator;

}));
