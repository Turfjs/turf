var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('near', function(){
  xit('should take a set of points and return points from a second set that are within a specified distance', function(done){

    var distance = 1,
        units = 'miles'

    t.load(__dirname+'/testIn/nearIn.geojson', function(err, inPoints){
      t.load(__dirname+'/testIn/nearOut.geojson', function(err, outPoints){
        var syncNearByPoints = t.near(inPoints, outPoints, distance, unit, function(err, nearByPoints){
          if(err) throw err
          nearByPoints.features.should.be.ok
          done();
        })

        if (typeof syncNearByPoints === 'Error') {
          throw syncNearByPoints;
        }

        syncNearByPoints.features.should.be.ok;
        done();
      })
    })
  })
})