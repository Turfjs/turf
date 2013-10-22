var g = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('contour', function(){
  it('should take a set of points with z values and output a set of contour polygons', function(done){
    g.load('../test/testIn/Points3.geojson', function(err, points){
      g.contour(points, 'elevation', [0, 1,2,3,4,5,6,7,8,9,10,20,40,60,80,100,120,140,160], function(err, contours){
        if(err) throw err
        contours.should.be.ok
        done()
      })
    })
  })
}) 