var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('variance', function() {
    it('can get the variance of a six-sided die', function() {
        assert.equal(rnd(ss.variance([1, 2, 3, 4, 5, 6])), 2.917);
    });

    it('the variance of one number is zero', function() {
        assert.equal(rnd(ss.variance([1])), 0);
    });

    it('the variance of no numbers is null', function() {
        assert.equal(ss.variance([]), null);
    });
});
