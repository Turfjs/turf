var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('contour', function(){
  it('should take a set of points with z values and output a set of contour polygons', function(done){
    t.load('../test/testIn/Points3.geojson', function(err, points){
      t.contour(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        fs.writeFileSync('./testOut/contours.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
        done()
      })
    })
  })
  it('should take a set of points with decimal z values and output a set of contour polygons', function(done){
    t.load('../test/testIn/Points3.geojson', function(err, points){
      t.contour(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        fs.writeFileSync('./testOut/contours.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
        done()
      })
    })
  })
  it('should take a set of points with negative z values and output a set of contour polygons', function(done){
    t.load('../test/testIn/Points3.geojson', function(err, points){
      t.contour(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        fs.writeFileSync('./testOut/contours.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
        done()
      })
    })
  })
})