var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('isolines', function(){
  it('should take a set of points with z values and output a set of contour lines', function(done){
    t.load(__dirname+'/testIn/elevation1.geojson', function(err, points){
      var syncContours = t.isolines(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contours1.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (syncContours instanceof Error) {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;
      done();
    })
  })
  it('should take a set of points with z values and output a set of contour lines with jenks breaks', function(done){
    t.load(__dirname+'/testIn/elevation1.geojson', function(err, points){
      var syncBreaks = t.jenks(points, 'elevation', 5, function(err, breaks){
        if(err) throw err
        t.isolines(points, 'elevation', 15, breaks, function(err, contours){
          if(err) throw err
          //fs.writeFileSync('./testOut/contours2.geojson', JSON.stringify(contours))
          contours.should.be.ok
          contours.features.should.be.ok
        })
      })

      if (syncBreaks instanceof Error) {
        throw syncBreaks;
      }

      var syncContours = t.isolines(points, 'elevation', 15, syncBreaks);

      if (syncContours instanceof Error) {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;
      done();
    })
  })
  it('should take a set of points with decimal z values and output a set of contour lines', function(done){
    t.load(__dirname+'/testIn/elevation2.geojson', function(err, points){
      var syncContours = t.isolines(points, 'elevation', 15, [-2000,-20, -5, -1, 0, 2, 5, 10, 20, 30, 500 ], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contours3.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (syncContours instanceof Error) {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;
      done();
    })
  })
  it('should take a set of points with negative z values and output a set of contour lines', function(done){
    t.load(__dirname+'/testIn/elevation3.geojson', function(err, points){
      var syncContours = t.isolines(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contours4.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (syncContours instanceof Error) {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;
      done();
    })
  })
  it('should take a set of points lopsided edges and output a set of contour lines', function(done){
    t.load(__dirname+'/testIn/openContourPoints.geojson', function(err, points){
      var syncContours = t.isolines(points, 'elevation', 15, [5, 15, 40, 80, 90, 110], function(err, contours){
        if(err) throw err
        //fs.writeFileSync('./testOut/contoursEdges.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })

      if (syncContours instanceof Error) {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;
      done();
    })
  })
  it('should take a set of points with internal valleys and output a set of contour lines', function(done){
    t.load(__dirname+'/testIn/holeContourPoints.geojson', function(err, points){
      var syncContours = t.isolines(points, 'elevation', 15, [5, 15, 40, 80, 90, 110], function(err, contours){
        if(err) throw err
        //fs.writeFileSync(__dirname+'/testOut/isolines.geojson', JSON.stringify(contours))
        contours.should.be.ok
        contours.features.should.be.ok
      })
      
      if (syncContours instanceof Error) {
        throw syncContours;
      }

      syncContours.should.be.ok;
      syncContours.features.should.be.ok;
      done();
    })
  })
})