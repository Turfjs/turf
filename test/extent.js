var g = require('../index'),
    should = require('should')

describe('load', function(){
  describe('#index', function(){
    it('should return the proper extent', function(done){
      g.load('../test/testFiles/varied.json', function(layer){
        g.extent(layer, function(extent){
          extent.should.be.ok
          extent[0].should.equal(20)
          extent[1].should.equal(-10)
          extent[2].should.equal(130)
          extent[3].should.equal(4)
          done()
        })
      })
    })
  })
})