var t = require('../index'),
    should = require('should'),
    _ = require('lodash')

describe('center', function(){
  it('should return the proper center for a FeatureCollection', function(done){
    t.load(__dirname+'/testIn/FeatureCollection.geojson', function(err, layer){
      if(err) throw err
      t.center(layer, function(center){
        center.should.be.ok
        _.isEqual(center.geometry.coordinates, [75, -3]).should.be.true
        done()
      })
    })
  })
})