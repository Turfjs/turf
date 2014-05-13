var t = require('../index'),
    should = require('should'),
    _ = require('lodash')

describe('center', function(){
  it('should return the proper center for a FeatureCollection', function(done){
    t.load(__dirname+'/testIn/FeatureCollection.geojson', function(err, layer){
      if(err) throw err
      var syncCenter = t.center(layer, function(center){
        center.should.be.ok
        _.isEqual(center.geometry.coordinates, [75, -3]).should.be.true
      })

      if (typeof syncCenter === 'Error') {
        throw syncCenter;
      }

      syncCenter.should.be.ok;
      _.isEqual(syncCenter.geometry.coordinates, [75, -3]).should.be.true;

      done();
    })
  })
})