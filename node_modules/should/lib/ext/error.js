/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('throw', function(message) {
    var fn = this.obj
      , err = {}
      , errorInfo = ''
      , ok = true;

    try {
      fn();
      ok = false;
    } catch(e) {
      err = e;
    }

    if(ok) {
      if('string' == typeof message) {
        ok = message == err.message;
      } else if(message instanceof RegExp) {
        ok = message.test(err.message);
      } else if('function' == typeof message) {
        ok = err instanceof message;
      }

      if(message && !ok) {
        if('string' == typeof message) {
          errorInfo = " with a message matching '" + message + "', but got '" + err.message + "'";
        } else if(message instanceof RegExp) {
          errorInfo = " with a message matching " + message + ", but got '" + err.message + "'";
        } else if('function' == typeof message) {
          errorInfo = " of type " + message.name + ", but got " + err.constructor.name;
        }
      } else {
        errorInfo = " (got " + i(err) + ")";
      }
    }

    this.params = { operator: 'to throw exception' + errorInfo };

    this.assert(ok);
  });

  Assertion.alias('throw', 'throwError');
};