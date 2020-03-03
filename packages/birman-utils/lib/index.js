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

var address = require('address');

exports.address = address;

var chokidar = require('chokidar');

exports.chokidar = chokidar;

var debug_1 = require('debug');

exports.createDebug = debug_1['default'];

var is_lerna_package_1 = require('./is-lerna-package');

exports.isLernaPackage = is_lerna_package_1['default'];
