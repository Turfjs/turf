var g = require('../index'),
    should = require('should')

describe('load', function(){
  describe('#index', function(){
    it('should load a geojson file ok', function(done){
      g.load('../test/testFiles/FeatureCollection.json', function(layer){
        layer.should.be.ok
        done()
      })
    })
  })
})