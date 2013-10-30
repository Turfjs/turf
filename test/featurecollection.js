var t = require('../index'),
  should = require('should')

describe('featurecollection', function(){
  it('should return a feature collection', function(done){
    var p1 = t.point(0,0),
        p2 = t.point(0,10),
        p3 = t.point(10,10),
        p4 = t.point(10,0)
    var fc = t.featurecollection([p1,p2,p3,p4])
    fc.should.be.ok
    fc.features.length.should.equal(4)
    done()
  })
}) 