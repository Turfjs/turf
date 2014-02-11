var assert = require('chai').assert;
var ss = require('../../');

describe('sample skewness', function() {

    it('the skewness of an empty sample is null', function() {
        var data = [];
        assert.equal(ss.sample_skewness(data), null);
    });

    it('the skewness of an sample with one number is null', function() {
        var data = [ 1 ];
        assert.equal(ss.sample_skewness(data), null);
    });

    it('the skewness of an sample with two numbers is null', function() {
        var data = [ 1, 2 ];
        assert.equal(ss.sample_skewness(data), null);
    });

    it('can calculate the skewness of SAS example 1', function() {
        // Data and answer taken from SKEWNESS function documentation at
        // http://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a000245947.htm
        var data = [0, 1, 1];
        assert.equal(ss.sample_skewness(data).toPrecision(10), -1.732050808);
    });

    it('can calculate the skewness of SAS example 2', function() {
        // Data and answer taken from SKEWNESS function documentation at
        // http://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a000245947.htm
        var data = [2, 4, 6, 3, 1];
        assert.equal(ss.sample_skewness(data).toPrecision(10), 0.5901286564);
    });

    it('can calculate the skewness of SAS example 3', function() {
        // Data and answer taken from SKEWNESS function documentation at
        // http://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a000245947.htm
        var data = [2, 0, 0];
        assert.equal(ss.sample_skewness(data).toPrecision(10), 1.732050808);
    });
});
