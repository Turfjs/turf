var t = require('../index'),
    should = require('should')

describe('filter', function(){
  it('should ', function(done){
    var trees = t.featurecollection([t.point(1,2, {species: 'oak'}), t.point(2,1, {species: 'birch'}), t.point(3,1, {species: 'oak'}), t.point(2,2, {species: 'redwood'}), t.point(2,3, {species: 'maple'}), t.point(4,2, {species: 'oak'})])
    var syncOaks = t.filter(trees, 'species', 'oak', function(err, oaks){
      if(err) throw err
      oaks.should.be.ok
      oaks.features.length.should.equal(3)
    })

    if (typeof syncOaks === 'Error') {
      throw syncOaks;
    }

    syncOaks.should.be.ok;
    syncOaks.features.length.should.equal(3);

    done();
  })
}) 