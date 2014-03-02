var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('isClockwise', function(){
  it('should take a ring and return clockwise true', function(done){
    var ring = [[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]]
    var clockwise = t.isClockwise(ring)
    clockwise.should.equal(true)
    done()
  })
})