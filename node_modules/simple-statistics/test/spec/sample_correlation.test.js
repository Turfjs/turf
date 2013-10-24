var assert = require('chai').assert;
var ss = require('../../');

function rnd(x) {
    return Math.round(x * 1000) / 1000;
}

describe('sample correlation', function() {

    it('can get the sample correlation of identical arrays', function() {
        var data = [1, 2, 3, 4, 5, 6];
        assert.equal(rnd(ss.sample_correlation(data, data)), 1);
    });

    it('can get the sample correlation of different arrays', function() {
        var a = [1, 2, 3, 4, 5, 6];
        var b = [2, 2, 3, 4, 5, 60];
        assert.equal(rnd(ss.sample_correlation(a, b)), 0.691);
    });

});
