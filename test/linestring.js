var g = require('../index'),
    should = require('should')

describe('linestring', function(){
  it('should return a linestring', function(done){
    var line = g.linestring([[0,0], [1,1]])
    line.should.be.ok
    line.geometry.coordinates.should.be.ok
    line.geometry.type.should.equal('LineString')
    done()
  })
}) 