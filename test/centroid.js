var t = require('../index'),
  should = require('should'),
  _ = require('lodash')

describe('centroid', function(){
  it('should return the correct centroid for a square polygon', function(done){
    var poly = t.polygon([[[0,0], [0,10], [10,10] , [10,0]]])
    t.centroid(poly, function(err, centroid){
      if(err) throw err
      centroid.should.be.ok
      _.isEqual(centroid, t.point(5,5)).should.be.true
      done()
    })
  })
  it('should return the correct centroid for a featurecollection', function(done){
    var p1 = t.point(0,0),
        p2 = t.point(0,10),
        p3 = t.point(10,10),
        p4 = t.point(10,0)
    var fc = t.featurecollection([p1,p2,p3,p4])
    t.centroid(fc, function(err, centroid){
      if(err) throw err
      centroid.should.be.ok
      _.isEqual(centroid, t.point(5,5)).should.be.true
      done()
    })
  })
})