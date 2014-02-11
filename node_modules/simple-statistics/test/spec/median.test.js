var assert = require('assert');
var ss = require('../../');

describe('median', function() {
    it('can get the median of three numbers', function() {
        assert.equal(ss.median([1, 2, 3]), 2);
    });

    it('can get the median of two numbers', function() {
        assert.equal(ss.median([1, 2]), 1.5);
    });

    it('can get the median of four numbers', function() {
        assert.equal(ss.median([1, 2, 3, 4]), 2.5);
    });

    it('gives null for the median of an empty list', function() {
        assert.equal(ss.median([]), null);
    });

    it('sorts numbers numerically', function() {
        assert.equal(ss.median([8, 9, 10]), 9);
    });

    it('does not change the sorting order of its input', function() {
        var x = [1, 0];
        assert.equal(ss.median(x), 0.5);
        assert.equal(x[0], 1);
        assert.equal(x[1], 0);
    });
});
