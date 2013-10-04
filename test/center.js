var g = require('../index'),
    should = require('should'),
    _ = require('underscore')

describe('center', function(){
  describe('#index', function(){
    it('should return the proper center for a FeatureCollection', function(done){
      g.load('../test/testFiles/FeatureCollection.json', function(layer){
        g.center(layer, function(center){
          center.should.be.ok
          _.isEqual(center.geometry.coordinates, [75, -3]).should.be.true
          done()
        })
      })
    })
  })
})