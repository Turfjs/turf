var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('standard_deviation', function() {
    it('can get the standard deviation of an example on wikipedia', function() {
        assert.equal(rnd(ss.standard_deviation([2, 4, 4, 4, 5, 5, 7, 9])), 2);
    });

    // confirmed with numpy
    // In [4]: numpy.std([1,2,3])
    // Out[4]: 0.81649658092772603
    it('can get the standard deviation of 1-3', function() {
        assert.equal(rnd(ss.standard_deviation([1, 2, 3])), 0.816);
    });

    // In [6]: numpy.std([0,1,2,3,4,5,6,7,8,9,10])
    // Out[6]: 3.1622776601683795
    it('can get the standard deviation of 1-10', function() {
        assert.equal(rnd(ss.standard_deviation([0,1,2,3,4,5,6,7,8,9,10])), 3.162);
    });

    it('the standard deviation of one number is zero', function() {
        assert.equal(rnd(ss.standard_deviation([1])), 0);
    });
});
