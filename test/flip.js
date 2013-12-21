var t = require('../index'),
  should = require('should')

describe('flip', function(){
  it('should flip the x and ys of a point', function(done){
    var pt = t.point(1,0)
    t.flip(pt, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.geometry.coordinates[0].should.equal(0)
      flipped.geometry.coordinates[1].should.equal(1)
      done()
    })
  })
  it('should flip the x and ys of a linestring', function(done){
    var line = t.linestring([[1,0], [1,0]])
    t.flip(line, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.geometry.coordinates[0][0].should.equal(0)
      flipped.geometry.coordinates[0][1].should.equal(1)
      flipped.geometry.coordinates[1][0].should.equal(0)
      flipped.geometry.coordinates[1][1].should.equal(1)
      done()
    })
  })
  it('should flip the x and ys of a polygon', function(done){
    var poly = t.polygon([[[1,0], [1,0], [1,2]]])
    t.flip(line, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.geometry.coordinates[0][0].should.equal(0)
      flipped.geometry.coordinates[0][1].should.equal(1)
      flipped.geometry.coordinates[1][0].should.equal(0)
      flipped.geometry.coordinates[1][1].should.equal(1)
      flipped.geometry.coordinates[1][0].should.equal(2)
      flipped.geometry.coordinates[1][1].should.equal(1)
      done()
    })
  })
  it('should flip the x and ys of a featurecollection', function(done){
    
    done()
  })
}) 