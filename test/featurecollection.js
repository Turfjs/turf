var g = require('../index'),
  should = require('should')

describe('featurecollection', function(){
  it('should return a feature collection', function(done){
    var p1 = g.point(0,0),
        p2 = g.point(0,10),
        p3 = g.point(10,10),
        p4 = g.point(10,0)
    var fc = g.featurecollection([p1,p2,p3,p4])
    fc.should.be.ok
    fc.features.length.should.equal(4)
    done()
  })
}) 