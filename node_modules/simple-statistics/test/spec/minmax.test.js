var assert = require('chai').assert;
var ss = require('../../');

describe('min', function() {
    it('can get the minimum of one number', function() {
        assert.equal(ss.min([1]), 1);
    });

    it('can get the minimum of three numbers', function() {
        assert.equal(ss.min([1, 7, -1000]), -1000);
    });
});

describe('max', function() {
    it('can get the maximum of three numbers', function() {
        assert.equal(ss.max([1, 7, -1000]), 7);
    });
});
