/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util'),
  eql = require('../eql');

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('include', function(obj, description) {
    if(!Array.isArray(this.obj) && !util.isString(this.obj)) {
      this.params = { operator: 'to include an object equal to ' + i(obj), message: description };
      var cmp = {};
      for(var key in obj) cmp[key] = this.obj[key];
      this.assert(eql(cmp, obj));
    } else {
      this.params = { operator: 'to include ' + i(obj), message: description };

      this.assert(~this.obj.indexOf(obj));
    }
  });

  Assertion.add('includeEql', function(obj, description) {
    this.params = { operator: 'to include an object equal to ' + i(obj), message: description };

    this.assert(this.obj.some(function(item) {
      return eql(obj, item);
    }));
  });
};