var t = require('../index'),
    should = require('should')

describe('load', function(){
  it('should load a geojson file ok', function(done){
    t.load('../test/testIn/FeatureCollection.geojson', function(err, layer){
      if(err) throw err
      layer.should.be.ok
      done()
    })
  })
})