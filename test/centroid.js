var g = require('../index'),
  should = require('should'),
  _ = require('lodash')

describe('centroid', function(){
  it('should return the correct centroid for a square polygon', function(done){
    var poly = g.polygon([[[0,0], [0,10], [10,10] , [10,0]]])
    g.centroid(poly, function(err, centroid){
      if(err) throw err
      centroid.should.be.ok
      _.isEqual(centroid, g.point(5,5)).should.be.true
      done()
    })
  })
  it('should return the correct centroid for a featurecollection', function(done){
    var p1 = g.point(0,0),
        p2 = g.point(0,10),
        p3 = g.point(10,10),
        p4 = g.point(10,0)
    var fc = g.featurecollection([p1,p2,p3,p4])
    g.centroid(fc, function(err, centroid){
      if(err) throw err
      console.log(centroid)
      centroid.should.be.ok
      _.isEqual(centroid, g.point(5,5)).should.be.true
      done()
    })
  })
})