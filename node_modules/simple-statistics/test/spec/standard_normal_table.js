var assert = require('chai').assert;
var ss = require('../../');

describe('standard_normal_table', function() {
    it('all entries are numeric', function() {
        for (var i = 0; i < ss.standard_normal_table.length; i++) {
            assert.equal(typeof ss.standard_normal_table[i], 'number');
            assert.ok(ss.standard_normal_table[i] >= 0);
            assert.ok(ss.standard_normal_table[i] <= 1);
        }
    });
});
