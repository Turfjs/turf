var t = require('../index'),
    should = require('should')

describe('inside', function(){
  it('should return true if the point is inside the polygon', function(done){
    var poly = t.polygon([[[0,0], [0,100], [100,100], [100,0]]])
    var pt = t.point(50, 50)
    t.inside(pt, poly, function(err, inside){
      if(err) throw err
      inside.should.be.true
      done()
    })
  })
  it('should return false if the point is outside the polygon', function(done){
    var poly = t.polygon([[[0,0], [0,100], [100,100], [100,0]]])
    var pt = t.point(140, 150)
    t.inside(pt, poly, function(err, inside){
      if(err) throw err
      inside.should.be.false
      done()
    })
  })
  it('should return false if the point is in a concave polygon', function(done){
    var poly = t.polygon([[[0,0], [50, 50], [0,100], [100,100], [100,0]]])
    var pt = t.point(75, 75)
    t.inside(pt, poly, function(err, inside){
      if(err) throw err
      inside.should.be.true
      done()
    })
  })
  it('should return false if the point is in the "cave" of a concave polygon', function(done){
    var poly = t.polygon([[[0,0], [50, 50], [0,100], [100,100], [100,0]]])
    var pt = t.point(25, 50)
    t.inside(pt, poly, function(err, inside){
      if(err) throw err
      inside.should.be.false
      done()
    })
  })
}) 