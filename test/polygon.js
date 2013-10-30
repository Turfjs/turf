var t = require('../index')

describe('polygon', function(){
  it('should create a polygon', function(done){
    var pt = t.point(0, 1, {name: 'test point'})
    pt.should.be.ok
    done()
  })
}) 