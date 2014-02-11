var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('sample covariance', function() {
    it('can get perfect negative covariance', function() {
        var x = [1, 2, 3, 4, 5, 6];
        var y = [6, 5, 4, 3, 2, 1];
        assert.equal(rnd(ss.sample_covariance(x, y)), -3.5);
    });

    it('covariance of something with itself is its variance', function() {
        var x = [1, 2, 3, 4, 5, 6];
        assert.equal(rnd(ss.sample_covariance(x, x)), 3.5);
    });

    it('covariance is zero for something with no correlation', function() {
        var x = [1, 2, 3, 4, 5, 6];
        var y = [1, 1, 2, 2, 1, 1];
        assert.equal(rnd(ss.sample_covariance(x, y)), 0);
    });

    it('zero-length corner case', function() {
        assert.equal(rnd(ss.sample_covariance([], [])), 0);
    });
});
