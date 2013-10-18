//http://math.stackexchange.com/questions/28043/finding-the-z-value-on-a-plane-with-x-y-values
var g = require('../index'),
    should = require('should'),
    fs = require('fs')

describe('planepoint', function(){
  it('should return the z value of a point on a plane', function(done){
    g.load('../test/testIn/Triangle.geojson', function(err, triangle){
      g.load('../test/testIn/PlanePoint.geojson', function(err, point){
        g.planepoint(point, triangle, function(err, z){
          z.should.be.ok
          done()
        })
      })
    })
  })
}) 