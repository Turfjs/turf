var t = require('../index'), 
    fs = require('fs')

describe('buffer', function(){
  it('should buffer a Point', function(done){
    t.load(__dirname+'/testIn/Point1.geojson', function(err, pt){
      var syncBuffered = t.buffer(pt, 10, 'miles', function(err, buffered){
        //fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
      })

      if (syncBuffered instanceof Error) {
        throw syncBuffered;
      }

      done();
    })
  })
  it('should buffer a LineString', function(done){
    t.load(__dirname+'/testIn/bezierIn.geojson', function(err, pt){
      var syncBuffered = t.buffer(pt, 10, 'miles', function(err, buffered){
        //fs.writeFileSync('./testOut/bufferedLine.geojson',JSON.stringify(buffered))
        if(err) throw err
      })

      if (syncBuffered instanceof Error) {
        throw syncBuffered;
      }

      done();
    })
  })
  it('should buffer a Polygon', function(done){
    t.load(__dirname+'/testIn/bufferPolygonIn.geojson', function(err, pt){
      var syncBuffered = t.buffer(pt, 10, 'miles', function(err, buffered){
        //fs.writeFileSync('./testOut/bufferedPolygon.geojson',JSON.stringify(buffered))
        if(err) throw err
      })

      if (syncBuffered instanceof Error) {
        throw syncBuffered;
      }

      done();
    })
  })
  it('should buffer a set of Points', function(done){
    t.load(__dirname+'/testIn/Point1.geojson', function(err, pt){
      var syncBuffered = t.buffer(pt, 10, 'miles', function(err, buffered){
        //fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
      })

      if (syncBuffered instanceof Error) {
        throw syncBuffered;
      }

      done();
    })
  })
  it('should buffer a set of Points and union them', function(done){
    t.load(__dirname+'/testIn/elevation1.geojson', function(err, pts){
      var syncBuffered = t.buffer(pts, 10, 'miles', function(err, buffered){
        //fs.writeFileSync('./testOut/bufferedPoints.geojson',JSON.stringify(buffered))
        if(err) throw err
      })

      if (syncBuffered instanceof Error) {
        throw syncBuffered;
      }

      done();
    })
  })
}) 