var g = require('../index'),
  _ = require('lodash'),
  should = require('should')

describe('nearest', function(){
  it('should should return the nearest point', function(done){
    g.load('../test/testIn/Point1.geojson', function(err, inPoint){
      g.load('../test/testIn/Points3.geojson', function(err, inFeatures){
        g.nearest(inPoint, inFeatures, function(err, outPoint){
          if(err) throw err
          var nearest = { 
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [ -75.33, 39.44]},
            "properties": { 
              "name": "Location C",
              "category": "Office",
              "elevation": 76
            }
          }
          _.isEqual(outPoint, nearest).should.be.true
          done()
        })
      })
    })
  })
}) 