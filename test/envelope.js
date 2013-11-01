var t = require('../index'),
  should = require('should')

describe('envelope', function(){
  it('should return a polygon that represents the bbox around a feature or feature collection.', function(done){
    t.load('../test/testIn/FeatureCollection.geojson', function(err, features){
      t.envelope(features, function(err, poly){
        if(err) throw err
        poly.should.be.ok
        poly.geometry.type.should.equal('Polygon')
        poly.geometry.coordinates.should.be.ok
        done()
      })
    })
  })
}) 