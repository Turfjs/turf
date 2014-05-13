var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('isobands', function(){
  it('should take a set of points with z values and output a set of contour polygons', function(done){
    t.load(__dirname+'/testIn/elevation1.geojson', function(err, points){
      var syncContours = t.isobands(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contours1.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (typeof syncContours === 'Error') {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;

      done();
    })
  })
  it('should take a set of points with z values and output a set of contour polygons with jenks breaks', function(done){
    t.load(__dirname+'/testIn/elevation1.geojson', function(err, points){
      var syncBreaks = t.jenks(points, 'elevation', 5, function(err, breaks){
        if(err) throw err
        t.isobands(points, 'elevation', 15, breaks, function(err, contours){
          if(err) throw err
          //fs.writeFileSync('./testOut/contours2.geojson', JSON.stringify(contours))
          contours.should.be.ok
          contours.features.should.be.ok
        })
      })

      if (typeof syncBreaks === 'Error') {
        throw syncBreaks;
      }

      var syncContours = t.isobands(points, 'elevation', 15, syncBreaks);

      if (typeof syncContours === 'Error') {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;

      done();
    })
  })
  it('should take a set of points with decimal z values and output a set of contour polygons', function(done){
    t.load(__dirname+'/testIn/elevation2.geojson', function(err, points){
      var syncContours = t.isobands(points, 'elevation', 15, [-1, 25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contours3.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (typeof syncContours === 'Error') {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;

      done();
    })
  })
  it('should take a set of points with negative z values and output a set of contour polygons', function(done){
    t.load(__dirname+'/testIn/elevation3.geojson', function(err, points){
      var syncContours = t.isobands(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contours4.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (typeof syncContours === 'Error') {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;

      done();
    })
  })
  it('should take a set of points lopsided edges and output a set of contour polygons', function(done){
    t.load(__dirname+'/testIn/openContourPoints.geojson', function(err, points){
      var syncContours = t.isobands(points, 'elevation', 15, [85,  95, 105, 120], function(err, contours){
        if(err) throw err
        //fs.writeFileSync(__dirname+'/testOut/contoursEdges.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (typeof syncContours === 'Error') {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;

      done();
    })
  })
  it('should take a set of points with internal valleys and output a set of contour polygons', function(done){
    t.load(__dirname+'/testIn/holeContourPoints.geojson', function(err, points){
      var syncContours = t.isobands(points, 'elevation', 10, [0, 5, 15, 15,40, 40, 80, 90], function(err, contours){
        if(err) throw err
        fs.writeFileSync(__dirname+'/testOut/contoursHoles.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (typeof syncContours === 'Error') {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;

      done();
    })
  })
  it('should take a set of points with internal valleys and output a set of contour polygons', function(done){
    t.load(__dirname+'/testIn/openIsoIn.geojson', function(err, points){
      t.quantile(points, 'elevation', [5,20, 60, 80, 95], function(err, breaks){
        var syncContours = t.isobands(points, 'elevation', 10, breaks, function(err, contours){
          if(err) throw err
          fs.writeFileSync(__dirname+'/testOut/openIsoOut.geojson', JSON.stringify(contours))
          contours.should.be.ok
          contours.features.should.be.ok
        })

        if (typeof syncContours === 'Error') {
          throw syncContours;
        }

        syncContours.should.be.ok;
        syncContours.features.should.be.ok;

        done();
      })
    })
  })
})