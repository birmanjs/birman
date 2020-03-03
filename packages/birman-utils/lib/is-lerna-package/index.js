'use strict';

function _react() {
  const data = _interopRequireDefault(require('react'));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.__esModule = true;

var fs_1 = require('fs');

var path_1 = require('path');

function default_1(root) {
  return fs_1.existsSync(path_1.join(root, 'lerna.json'));
}

exports['default'] = default_1;
