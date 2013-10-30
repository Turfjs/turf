//http://math.stackexchange.com/questions/28043/finding-the-z-value-on-a-plane-with-x-y-values
var t = require('../index'),
    should = require('should'),
    fs = require('fs')

describe('planepoint', function(){
  it('should return the z value of a point on a plane', function(done){
    t.load('../test/testIn/Triangle.geojson', function(err, triangle){
      t.load('../test/testIn/PlanePoint.geojson', function(err, point){
        t.planepoint(point, triangle, function(err, z){
          z.should.be.ok
          done()
        })
      })
    })
  })
}) 