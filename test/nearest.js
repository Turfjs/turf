var t = require('../index'),
  _ = require('lodash'),
  should = require('should')

describe('nearest', function(){
  it('should should return the nearest point', function(done){
    t.load(__dirname+'/testIn/Point1.geojson', function(err, inPoint){
      t.load(__dirname+'/testIn/Points3.geojson', function(err, inFeatures){
        var nearest = { 
          "type": "Feature",
          "geometry": {"type": "Point", "coordinates": [ -75.33, 39.44]},
          "properties": { 
            "name": "Location C",
            "category": "Office",
            "elevation": 76
          }
        }
        var syncOutPoint = t.nearest(inPoint, inFeatures, function(err, outPoint){
          if(err) throw err
          
          _.isEqual(outPoint, nearest).should.be.true
        })

        if (syncOutPoint instanceof Error) {
          throw syncOutPoint;
        }

        _.isEqual(syncOutPoint, nearest).should.be.true;
        done();
      })
    })
  })
}) 