'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var isUrl$1 = _interopDefault(require('@pansy/is-url'));
var slash = _interopDefault(require('slash'));
var clearConsole = _interopDefault(require('@pansy/clear-console'));

/**
 * 检查字符串是否是一个Url
 * @param path
 */

function isUrl(path) {
  return isUrl$1(path);
}

/**
 * 将windows反斜杠路径转换为斜杠路径
 * @param path
 */

function winPath(path) {
  return slash(path);
}

/**
 * Make up the ending slash path （ /abc => /abc/ ）
 * @param path string
 */
function endWithSlash(path) {
  return path.slice(-1) !== '/' ? ''.concat(path, '/') : path;
}

exports.clearConsole = clearConsole;
exports.endWithSlash = endWithSlash;
exports.isUrl = isUrl;
exports.winPath = winPath;
