var assert = require('chai').assert;
var ss = require('../../');

describe('interquartile range (iqr)', function() {
    // Data and results from
    // [Wikipedia](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
    it('can get proper iqr of an even-length list', function() {
        var even = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
        assert.equal(ss.quantile(even, 0.75) - ss.quantile(even, 0.25), ss.iqr(even));
    });

    it('can get proper iqr of an odd-length list', function() {
        var odd = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
        assert.equal(ss.quantile(odd, 0.75) - ss.quantile(odd, 0.25), ss.iqr(odd));
    });

    it('an iqr of a zero-length list produces null', function() {
        assert.equal(ss.iqr([]), null);
    });
});
