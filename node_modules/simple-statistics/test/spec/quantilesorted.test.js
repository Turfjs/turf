var assert = require('chai').assert;
var ss = require('../../');

describe('quantile_sorted', function() {
    // Data and results from
    // [Wikipedia](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
    it('can get proper quantiles of an even-length list', function() {
        var even = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
        assert.equal(ss.quantile_sorted(even, 0.25), 7);
        assert.equal(ss.quantile_sorted(even, 0.5), 9);
        assert.equal(ss.quantile_sorted(even, 0.75), 15);
    });
});
