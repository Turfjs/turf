var t = require('../lib/filter')

describe('filter', function(){
  it('should ', function(done){
    var trees = t.featurecollection([t.point(1,2, {species: 'oak'}), t.point(2,1, {species: 'birch'}), t.point(3,1, {species: 'oak'}), t.point(2,2, {species: 'redwood'}), t.point(2,3, {species: 'maple'}), t.point(4,2, {species: 'oak'})])
    t.filter(trees, 'species', oak, function(err, oaks){
      if(err) throw err
      oaks.should.be.ok
      done()
    })
  })
}) 