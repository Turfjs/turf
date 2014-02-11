var assert = require('chai').assert,
    ss = require('../../');

describe('t test', function() {

    it('can compare a known value to the mean of samples', function() {
      var t = ss.t_test([1, 2, 3, 4, 5, 6], 3.385);
      assert.equal(t, 0.1649415480881466);
    });

    it('can test independency of two samples', function() {
      var t = ss.t_test_two_sample([1,2,3,4],[3,4,5,6], 0);
      assert.equal(t, -2.1908902300206643);
    });

    it('can test independency of two samples (mu == -2)', function() {
      var t = ss.t_test_two_sample([1,2,3,4],[3,4,5,6], -2);
      assert.equal(t, 0);
    });

    it('can test independency of two samples of different lengths', function() {
      var t = ss.t_test_two_sample([1,2,3,4],[3,4,5,6,1,2,0]);
      assert.equal(t, -0.4165977904505309);
    });

    it('has an edge case for one sample being of size zero', function() {
      assert.equal(ss.t_test_two_sample([1,2,3,4],[]), null);
      assert.equal(ss.t_test_two_sample([], [1,2,3,4]), null);
      assert.equal(ss.t_test_two_sample([], []), null);
    });

});
