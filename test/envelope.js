var t = require('../index'),
  should = require('should')

describe('envelope', function(){
  it('should return a polygon that represents the bbox around a feature or feature collection.', function(done){
    t.load(__dirname+'/testIn/FeatureCollection.geojson', function(err, features){
      var syncPoly = t.envelope(features, function(err, poly){
        if(err) throw err
        poly.should.be.ok
        poly.geometry.type.should.equal('Polygon')
        poly.geometry.coordinates.should.be.ok
      })

      if (syncPoly instanceof Error) {
        throw syncPoly;
      }

      syncPoly.should.be.ok;
      syncPoly.geometry.type.should.equal('Polygon');
      syncPoly.geometry.coordinates.should.be.ok;

      done();
    })
  })
}) 