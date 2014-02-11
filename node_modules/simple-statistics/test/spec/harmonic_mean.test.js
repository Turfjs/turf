var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('harmonic_mean', function() {
    // From http://en.wikipedia.org/wiki/Harmonic_mean
    it('can get the mean of two or more numbers', function() {
        assert.equal(ss.harmonic_mean([1, 1]), 1);
        assert.equal(rnd(ss.harmonic_mean([2, 3])), 2.4);
        assert.equal(ss.harmonic_mean([1, 2, 4]), 12/7);
    });

    it('returns null for empty lists', function() {
        assert.equal(ss.harmonic_mean([]), null);
    });

    it('returns null for lists with negative numbers', function() {
        assert.equal(ss.harmonic_mean([-1]), null);
    });
});
