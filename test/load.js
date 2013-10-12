var g = require('../index'),
    should = require('should')

describe('load', function(){
  describe('#index', function(){
    it('should load a geojson file ok', function(done){
      g.load('../test/testFiles/FeatureCollection.geojson', function(err, layer){
        if(err) throw err
        layer.should.be.ok
        done()
      })
    })
  })
})