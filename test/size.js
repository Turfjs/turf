var t = require('../index'),
  should = require('should'),
  _ = require('_')


describe('size', function(){
  it('should double the size of a bbox at 0,0', function(done){
    var bbox = [0, 0, 10, 10]

    t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [-10, -10, 20, 20])
      done()
    })
  })
}) 