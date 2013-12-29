var t = require('../index'), fs = require('fs')

describe('buffer', function(){
  it('should buffer a Point', function(done){
    t.load('../test/testIn/Point1.geojson', function(err, pt){
      t.buffer(pt, 10, 'miles', function(err, buffered){
        fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
        done()
      })
    })
  })
  it('should buffer a LineString', function(done){
    t.load('../test/testIn/Point1.geojson', function(err, pt){
      t.buffer(pt, 10, 'miles', function(err, buffered){
        fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
        done()
      })
    })
  })
  it('should buffer a Polygon', function(done){
    t.load('../test/testIn/Point1.geojson', function(err, pt){
      t.buffer(pt, 10, 'miles', function(err, buffered){
        fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
        done()
      })
    })
  })
  it('should buffer a set of Points', function(done){
    t.load('../test/testIn/Point1.geojson', function(err, pt){
      t.buffer(pt, 10, 'miles', function(err, buffered){
        fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
        done()
      })
    })
  })
  it('should buffer a set of Points and union them', function(done){
    t.load('../test/testIn/Point1.geojson', function(err, pt){
      t.buffer(pt, 10, 'miles', function(err, buffered){
        fs.writeFileSync('./testOut/buffered.geojson',JSON.stringify(buffered))
        if(err) throw err
        done()
      })
    })
  })
}) 