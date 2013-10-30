var t = require('../index'),
  _ = require('lodash'),
  should = require('should')

describe('nearest', function(){
  it('should should return the nearest point', function(done){
    t.load('../test/testIn/Point1.geojson', function(err, inPoint){
      t.load('../test/testIn/Points3.geojson', function(err, inFeatures){
        t.nearest(inPoint, inFeatures, function(err, outPoint){
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