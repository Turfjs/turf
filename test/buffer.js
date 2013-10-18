var g = require('../index'), fs = require('fs')

describe('buffer', function(){
  it('should buffer a Point', function(done){
    g.load('../test/testIn/Point1.geojson', function(err, pt){
      g.buffer(pt, 10, function(err, buffered){
        //fs.writeFileSync('./testOut/test.geojson',JSON.stringify(buffered))
        if(err) throw err
        done()
      })
    })
  })
}) 