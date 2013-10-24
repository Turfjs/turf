var assert = require('chai').assert;
var ss = require('../../');

describe('quantile', function() {
    // Data and results from
    // [Wikipedia](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
    it('can get proper quantiles of an even-length list', function() {
        var even = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
        assert.equal(ss.quantile(even, 0.25), 7);
        assert.equal(ss.quantile(even, 0.5), 9);
        assert.equal(ss.quantile(even, 0.75), 15);
    });

    it('can get proper quantiles of an odd-length list', function() {
        var odd = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
        assert.equal(ss.quantile(odd, 0.25), 7);
        assert.equal(ss.quantile(odd, 0.5), 9);
        assert.equal(ss.quantile(odd, 0.75), 15);
    });

    it('the median quantile is equal to the median', function() {
        var rand = [1, 4, 5, 8];
        assert.equal(ss.quantile(rand, 0.5), ss.median(rand));
        var rand2 = [10, 50, 2, 4, 4, 5, 8];
        assert.equal(ss.quantile(rand2, 0.5), ss.median(rand2));
    });

    it('a zero-length list produces null', function() {
        assert.equal(ss.quantile([], 0.5), null);
    });

    it('bad bounds produce null', function() {
        assert.equal(ss.quantile([1, 2, 3], 1), null);
        assert.equal(ss.quantile([1, 2, 3], 0), null);
    });
});
