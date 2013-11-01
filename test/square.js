var t = require('../index'),
  should = require('should'),
  _ = require('lodash')

describe('square', function(){
  it('should return a bbox representing the smallest square that contains the input vertical bbox', function(done){
    var bbox = [0,0,5,10]
    t.square(bbox, function(err, square){
      if(err) throw err
      square.should.be.ok
      _.isEqual(square,[-2.5, 0, 7.5, 10]).should.be.true
      done()
    })
  })
  it('should return a bbox representing the smallest square that contains the input horizontal bbox', function(done){
    var bbox = [0,0,10,5]
    t.square(bbox, function(err, square){
      if(err) throw err
      square.should.be.ok
      _.isEqual(square,[0, -2.5, 10, 7.5]).should.be.true
      done()
    })
  })
}) 