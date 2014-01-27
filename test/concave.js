var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('concave', function(){
  it('should take a set of points and return a concave hull polygon', function(done){
    var maxEdge = 2.5

    t.load('../test/testIn/concaveIn2.geojson', function(err, points){
      t.concave(points, maxEdge, function(err, hull){
        if(err) throw err
        fs.writeFileSync('./testOut/concave.geojson', JSON.stringify(hull))
        hull.should.be.ok
        done()
      })
    })
  })
})