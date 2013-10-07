var g = require('../index')

describe('point', function(){
  describe('#index', function(){
    it('should create a point', function(done){
      var pt = g.point(0, 1, {name: 'test point'})
      pt.should.be.ok
      done()
    })
  })
}) 