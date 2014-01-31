var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('convex', function(){
  it('should take a set of points and return a convex hull polygon', function(done){
    t.load(__dirname+'/testIn/elevation1.geojson', function(err, points){
      t.convex(points, function(err, hull){
        if(err) throw err
        //fs.writeFileSync('./testOut/convex.geojson', JSON.stringify(hull))
        hull.should.be.ok
        done()
      })
    })
  })
  it('should take a set of points and return a convex hull polygon', function(done){
    t.load(__dirname+'/testIn/convexIn2.geojson', function(err, points){
      t.convex(points, function(err, hull){
        if(err) throw err
        //fs.writeFileSync('./testOut/convex2.geojson', JSON.stringify(hull))
        hull.should.be.ok
        done()
      })
    })
  })
})