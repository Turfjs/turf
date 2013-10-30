var t = require('../index')

describe('point', function(){
  it('should create a point', function(done){
    var pt = t.point(0, 1, {name: 'test point'})
    pt.should.be.ok
    done()
  })
}) 