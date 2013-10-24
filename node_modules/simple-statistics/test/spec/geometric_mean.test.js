var assert = require('chai').assert;
var ss = require('../../');

describe('geometric mean', function() {
    // From http://en.wikipedia.org/wiki/Geometric_mean
    it('can get the mean of two numbers', function() {
        assert.equal(ss.geometric_mean([2, 8]), 4);
        assert.equal(ss.geometric_mean([4, 1, 1/32]), 0.5);
        assert.equal(Math.round(ss.geometric_mean([2, 32, 1])), 4);
    });

    it('returns null for empty lists', function() {
        assert.equal(ss.geometric_mean([]), null);
    });

    it('returns null for lists with negative numbers', function() {
        assert.equal(ss.geometric_mean([-1]), null);
    });
});
