var assert = require('chai').assert;
var ss = require('../../');

describe('mean', function() {
    it('can get the mean of two numbers', function() {
        assert.equal(ss.mean([1, 2]), 1.5);
    });
    it('can get the mean of one number', function() {
        assert.equal(ss.mean([1]), 1);
    });
    it('an empty list has no average', function() {
        assert.equal(ss.mean([]), null);
    });
});
