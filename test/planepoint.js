//http://math.stackexchange.com/questions/28043/finding-the-z-value-on-a-plane-with-x-y-values
var t = require('../index'),
    should = require('should'),
    fs = require('fs')

describe('planepoint', function(){
  it('should return the z value of a point on a plane', function(done){
    t.load(__dirname+'/testIn/Triangle.geojson', function(err, triangle){
      t.load(__dirname+'/testIn/PlanePoint.geojson', function(err, point){
        t.planepoint(point, triangle, function(err, z){
          z.should.be.ok
          done()
        })
      })
    })
  })
  it('should return the z value of a point on a plane', function(done){
    var point = t.point(-75.3221, 39.529)
    // triangle is a polygon with "a", "b", and "c" values representing
    // the values of the coordinates in order.
    var triangle = t.polygon(
        [[[-75.1221,39.57],[-75.58,39.18],[-75.97,39.86]]], 
        {"a": 11, "b": 122, "c": 44}
      )

    t.planepoint(point, triangle, function(err, zValue){
      if(err) throw err
      zValue.should.be.ok
      done()
    })
  })
})