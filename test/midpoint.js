var t = require('../index'),
  should = require('should')

describe('midpoint', function(){
  it('should return the halfway point of a horizontal line starting off 0,0', function(done){
    var line = t.linestring([[0,0], [10,0]])
    var pt1 = t.point(0,0)
    var pt2 = t.point(10, 0)
    var expectedMidPoint = t.point(5, 0)
    t.midpoint(pt1, pt2, function(err, midpoint){
      if(err) throw err
      _.isEqual(midpoint, expectedMidPoint).should.be.true
      done()
    })
  })
  it('should return the halfway point of a vertical line starting off 0,0', function(done){
    var line = t.linestring([[0,0], [0,10]])
    var pt1 = t.point(0,0)
    var pt2 = t.point(0,10)
    var expectedMidPoint = t.point(0, 5)
    t.midpoint(pt1, pt2, function(err, midpoint){
      if(err) throw err
      _.isEqual(midpoint, expectedMidPoint).should.be.true
      done()
    })
  })
  it('should return the halfway point of a vertical line starting off 1,1', function(done){
    var line = t.linestring([[1,1], [1,11]])
    var pt1 = t.point(1,1)
    var pt2 = t.point(1, 11)
    var expectedMidPoint = t.point(1, 6)
    t.midpoint(pt1, pt2, function(err, midpoint){
      if(err) throw err
      _.isEqual(midpoint, expectedMidPoint).should.be.true
      done()
    })
  })
  it('should return the halfway point of a horizontal line starting off 1,1', function(done){
    var line = t.linestring([[1,1], [11,1]])
    var pt1 = t.point(1,1)
    var pt2 = t.point(11,1)
    var expectedMidPoint = t.point(6, 1)
    t.midpoint(pt1, pt2, function(err, midpoint){
      if(err) throw err
      _.isEqual(midpoint, expectedMidPoint).should.be.true
      done()
    })
  })
  it('should return the halfway point of a diagonal line starting off 0,0', function(done){
    var line = t.linestring([[0,0], [10,10]])
    var pt1 = t.point(0,0)
    var pt2 = t.point(10,10)
    var expectedMidPoint = t.point(5, 5)
    t.midpoint(pt1, pt2, function(err, midpoint){
      if(err) throw err
      _.isEqual(midpoint, expectedMidPoint).should.be.true
      done()
    })
  })
  it('should return the halfway point of a diagonal line starting off 1,1', function(done){
    var line = t.linestring([[1,1], [11,11]])
    var pt1 = t.point(1,1)
    var pt2 = t.point(11,11)
    var expectedMidPoint = t.point(6, 6)
    t.midpoint(pt1, pt2, function(err, midpoint){
      if(err) throw err
      _.isEqual(midpoint, expectedMidPoint).should.be.true
      done()
    })
  })
}) 