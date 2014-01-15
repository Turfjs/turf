var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('convex', function(){
  it('should take a set of points and return a convex hull polygon', function(done){
    t.load('../test/testIn/elevation1.geojson', function(err, points){
      t.convex(points, function(err, hull){
        if(err) throw err
        fs.writeFileSync('./testOut/convex.geojson', JSON.stringify(hull))
        hull.should.be.ok
        console.log(hull)
        //hull.features.should.be.ok
        done()
      })
    })
  })
})