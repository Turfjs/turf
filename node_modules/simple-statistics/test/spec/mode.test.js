var assert = require('chai').assert;
var ss = require('../../');

describe('mode', function() {
    it('the mode of a single-number array is that one number', function() {
        assert.equal(ss.mode([1]), 1);
    });

    it('the mode of a two-number array is that one number', function() {
        assert.equal(ss.mode([1, 1]), 1);
    });

    it('other cases', function() {
        assert.equal(ss.mode([1, 1, 2]), 1);
        assert.equal(ss.mode([1, 1, 2, 3]), 1);
        assert.equal(ss.mode([1, 1, 2, 3, 3]), 1);
        assert.equal(ss.mode([1, 1, 2, 3, 3, 3]), 3);
        assert.equal(ss.mode([1, 1, 2, 2, 2, 2, 3, 3, 3]), 2);
        assert.equal(ss.mode([1, 2, 3, 4, 5]), 1);
        assert.equal(ss.mode([1, 2, 3, 4, 5, 5]), 5);
    });

    it('the mode of an empty array is null', function() {
        assert.equal(ss.mode([]), null);
    });

    it('the mode of a three-number array with two same numbers is the repeated one', function() {
        assert.equal(ss.mode([1, 2, 2]), 2);
    });
});
