var assert = require('chai').assert;
var ss     = require('../../');

describe('t test', function() {
    it('can compare a known value to the mean of samples', function() {
      var t = ss.t_test([1, 2, 3, 4, 5, 6], 3.385);
      assert.equal(t, 0.1649415480881466);
    });
});
