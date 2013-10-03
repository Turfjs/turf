var g = require('../index'),
    should = require('should')

describe('load', function(){
  describe('#index', function(){
    it('should return the proper extent', function(done){
      g.load('../test/testFiles/varied.json', function(layer){
        g.extent(layer, function(bbox){
          bbox.should.be.ok
          bbox[0].should.equal(20)
          bbox[1].should.equal(-10)
          bbox[2].should.equal(130)
          bbox[3].should.equal(4)
          done()
        })
      })
    })
  })
})