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
}) 