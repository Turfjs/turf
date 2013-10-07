var g = require('../index')

describe('point', function(){
  describe('#index', function(){
    it('should create a polygon', function(done){
      var pt = g.point(0, 1, {name: 'test point'})
      pt.should.be.ok
      done()
    })
  })
}) 