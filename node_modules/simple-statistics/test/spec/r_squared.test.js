var assert = require('chai').assert;
var ss = require('../../');

describe('r-squared', function() {
    it('says that the r squared of a two-point line is perfect', function() {
        var d = [[0, 0], [1, 1]];
        var l = ss.linear_regression().data(d);
        assert.equal(ss.r_squared(d, l.line()), 1);
    });

    it('says that the r squared of a three-point line is not perfect', function() {
        var d = [[0, 0], [0.5, 0.2], [1, 1]];
        var l = ss.linear_regression().data(d);
        assert.notEqual(ss.r_squared(d, l.line()), 1);
    });
});
