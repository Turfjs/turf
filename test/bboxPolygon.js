var t = require('../index'),
  should = require('should')

describe('bboxPolygon', function(){
  it('should take a bbox and return the equivalent polygon feature', function(done){
    t.bboxPolygon([0,0,10,10], function(err, poly){
      if(err) throw err
      poly.should.be.ok
      poly.geometry.type.should.equal('Polygon')
      poly.geometry.coordinates.should.be.ok
      done()
    })
  })
}) 