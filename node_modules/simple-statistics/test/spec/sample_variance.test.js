var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('sample variance', function() {
    it('can get the sample variance of a six-sided die', function() {
        assert.equal(rnd(ss.sample_variance([1, 2, 3, 4, 5, 6])), 3.5);
    });

    // confirmed in R
    //
    // > var(1:10)
    // [1] 9.166667
    it('can get the sample variance of numbers 1-10', function() {
        assert.equal(rnd(ss.sample_variance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])), 9.167);
    });

    it('the sample variance of two numbers that are the same is 0', function() {
        assert.equal(rnd(ss.sample_variance([1, 1])), 0);
    });

    it('the sample variance of one number is null', function() {
        assert.equal(ss.sample_variance([1]), null);
    });

    it('the sample variance of no numbers is null', function() {
        assert.equal(ss.sample_variance([]), null);
    });
});
