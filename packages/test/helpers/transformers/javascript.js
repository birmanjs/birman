const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [require.resolve('@birman/babel-preset-birman/node')],
  babelrc: false,
  configFile: false
});
