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
  it('should double the size of a bbox at -10,-10', function(done){
    var bbox = [-10, -10, 0, 0]

    t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [-20, -20, 10, 10])
      done()
    })
  })
  it('should expand the size of a bbox by 50%', function(done){
    var bbox = [0, 0, 10, 10]

    t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [-5, -5, 15, 15])
      done()
    })
  })
  it('should shrink a bbox by 50%', function(done){
    var bbox = [0, 0, 10, 10]

    t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [.25, .25, 7.5, 7.5])
      done()
    })
  })
}) 