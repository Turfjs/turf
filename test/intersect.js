var t = require('../index'),
    should = require('should'),
    fs = require('fs')

describe('intersect', function(){
  it('should return the overlap of two polygons', function(done){
    t.load(__dirname + '/testIn/Intersect1.geojson', function(err, polys1){
      t.load(__dirname + '/testIn/Intersect2.geojson', function(err, polys2){
        t.intersect(polys1, polys2, function(err, intersected){
          if(err) throw err
          intersected.features[0].should.be.ok
          fs.writeFileSync(__dirname + '/testOut/intersected1.geojson', JSON.stringify(intersected))
          done()
        })
      })
    })
  })
  it('should return the overlap of two polygons', function(done){
    t.load(__dirname + '/testIn/Intersect1.geojson', function(err, polys1){
      t.load(__dirname + '/testIn/Intersect3.geojson', function(err, polys2){
        t.intersect(polys1, polys2, function(err, intersected){
          if(err) throw err
          intersected.features[0].should.be.ok
          fs.writeFileSync(__dirname + '/testOut/intersected2.geojson', JSON.stringify(intersected))
          done()
        })
      })
    })
  })
}) 