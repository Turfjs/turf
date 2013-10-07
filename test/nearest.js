var g = require('../index'),
_ = require('lodash')

describe('nearest', function(){
  describe('#index', function(){
    it('should should return the nearest point', function(done){
      g.load('../test/testFiles/FeatureCollection.geojson', function(err, inPoint){
        g.load('../test/testFiles/FeatureCollection.geojson', function(err, inFeatures){
          g.nearest(inPoint, inFeatures, function(err, outPoint){
            if(error) throw err
            var nearest = { 
              "type": "Feature",
              "geometry": {"type": "Point", "coordinates": [ -75.33, 39.44]},
              "properties": { 
                "name": "Location C",
                "category": "Office"
              }
            }
            _.isEqual(outPoint, nearest).should.be.true
            done()
          })
        })
      })
    })
  })
}) 