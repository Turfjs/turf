var assert = require('chai').assert;
var ss = require('../../');

describe('median absolute deviation (mad)', function() {
    it('median absolute deviation of an example on wikipedia', function() {
        assert.equal(ss.mad([1, 1, 2, 2, 4, 6, 9]), 1);
    });

    // wolfram alpha: median absolute deviation {0,1,2,3,4,5,6,7,8,9,10}
    it('median absolute deviation of 0-10', function() {
        assert.equal(ss.mad([0,1,2,3,4,5,6,7,8,9,10]), 3);
    });

    it('median absolute deviation of one number is zero', function() {
        assert.equal(ss.mad([1]), 0);
    });
});
