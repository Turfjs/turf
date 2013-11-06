var $ = require('jquery')
  , foo = require('./foo');

console.log('jquery version', $().jquery);
console.log('foo', foo());

// expose require in order to support testing
window.require = require;

module.exports = {
    getJqueryVersion: function () { return $().jquery; }
  , foo: foo()
};
