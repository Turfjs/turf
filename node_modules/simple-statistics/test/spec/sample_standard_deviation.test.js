var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('sample_standard_deviation', function() {
    it('can get the standard deviation of an example on wikipedia', function() {
        assert.equal(rnd(ss.sample_standard_deviation([2, 4, 4, 4, 5, 5, 7, 9])), 2.138);
    });

    it('zero-length corner case', function() {
        assert.equal(rnd(ss.sample_standard_deviation([])), 0);
    });
});
