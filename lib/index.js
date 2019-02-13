"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validator;

var _validator = _interopRequireDefault(require("./validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validator() {
  return "hello".concat((0, _validator.default)());
}