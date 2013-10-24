var ss = require('../../');
var assert = require('chai').assert;

describe('bayes', function() {
    it('makes an easy call with one training round', function() {
        var bayes = ss.bayesian();
        bayes.train({ species: 'Cat' }, 'animal');
        assert(bayes.score({ species: 'Cat' }), { animal: 1 });
    });

    it('makes fify-fifty call', function() {
        var bayes = ss.bayesian();
        bayes.train({ species: 'Cat' }, 'animal');
        bayes.train({ species: 'Cat' }, 'chair');
        assert.deepEqual(bayes.score({ species: 'Cat' }), { animal: 0.5, chair: 0.5 });
    });

    it('makes seventy-five/twenty-five call', function() {
        var bayes = ss.bayesian();
        bayes.train({ species: 'Cat' }, 'animal');
        bayes.train({ species: 'Cat' }, 'animal');
        bayes.train({ species: 'Cat' }, 'animal');
        bayes.train({ species: 'Cat' }, 'chair');
        assert.deepEqual(bayes.score({ species: 'Cat' }), { animal: 0.75, chair: 0.25 });
    });

    it('classifies multiple things', function() {
        var bayes = ss.bayesian();
        bayes.train({ species: 'Cat' }, 'animal');
        bayes.train({ species: 'Dog' }, 'animal');
        bayes.train({ species: 'Dog' }, 'animal');
        bayes.train({ species: 'Cat' }, 'chair');
        assert.deepEqual(bayes.score({ species: 'Cat' }), { animal: 0.25, chair: 0.25 });
        assert.deepEqual(bayes.score({ species: 'Dog' }), { animal: 0.5, chair: 0 });
    });
});
