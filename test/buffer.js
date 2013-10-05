var g = require('../index'), fs = require('fs')

describe('buffer', function(){
  describe('#index', function(){
    it('should ', function(done){
      var p = {
        "type": "Point",
        "coordinates": [
          0,
          5
        ]
      }
      g.buffer(p, 20, function(err, buffered){
        fs.writeFileSync('../test/test.geojson',JSON.stringify(buffered))
        done()
      })
    })
  })
}) 