var assert = require('chai').assert;
var ss = require('../../');

describe('mixin', function() {
    it('can mix in', function() {
        ss.mixin();
        var even = [2, 4, 6, 8];
        assert.equal(even.sum(), 20);
        assert.equal(even.mean(), 5);
        assert.equal(even.max(), 8);
        assert.equal(even.min(), 2);
    });

    it('mixins can take arguments', function() {
        ss.mixin();
        var even = [2, 4, 6, 8];
        assert.equal(even.quantile(0.2), 2);
        assert.equal(even.quantile(0.8), 8);
    });
});
