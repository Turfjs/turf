var assert = require('chai').assert;
var ss = require('../../');

describe('cumulative_std_normal_probability', function() {
    // https://en.wikipedia.org/wiki/Standard_normal_table#Examples_of_use
    it('wikipedia test example works', function() {
        for (var i = 0; i < ss.standard_normal_table.length; i++) {
            assert.equal(ss.cumulative_std_normal_probability(0.4), 0.6554);
        }
    });
});
