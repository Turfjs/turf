var g = require('../index'),
    should = require('should')

describe('inside', function(){
  it('should return true if the point is inside the polygon', function(done){
    g.load('../test/testIn/Concave.geojson', function(err, poly){
      var poly = g.polygon([[[0,0], [0,150], [150,150], 150,0], [0,0]])
      var pt = g.point(100.7, 0.7)
      g.inside(pt, poly, function(err, inside){
        if(err) throw err
        inside.should.be.true
        done()
      })
    })
  })
}) 