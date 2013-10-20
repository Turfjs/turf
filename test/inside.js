var g = require('../index'),
    should = require('should')

describe('inside', function(){
  it('should return true if the point is inside the polygon', function(done){
    g.load('../test/testIn/Concave.geojson', function(err, poly){
      var poly = g.polygon([[[0,0], [0,100], [100,100], [100,0]]])
      var pt = g.point(50, 50)
      g.inside(pt, poly, function(err, inside){
        if(err) throw err
        inside.should.be.true
        done()
      })
    })
  })
}) 