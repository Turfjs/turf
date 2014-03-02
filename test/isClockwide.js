var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('isClockwise', function(){
  it('should take a ring and return clockwise true', function(done){
    var ring = [[0,0],[1,1],[1,0],[0,0]]
    var clockwise = t.isClockwise(ring)
    clockwise.should.equal(true)
    done()
  })
  it('should take a ring and return clockwise false', function(done){
    var ring = [[0,0],[1,0],[1,1],[0,0]]
    var clockwise = t.isClockwise(ring)
    clockwise.should.equal(false)
    done()
  })
})  