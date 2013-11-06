var os = require('os');

module.exports = function () {
  return 'requiring this module should not fail if "os" is ignored';
};
