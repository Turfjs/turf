var t = require('../index'),
    should = require('should'),
    fs = require('fs')

describe('union', function(){
  it('should return the union of two polygons', function(done){
    t.load(__dirname + '/testIn/Intersect1.geojson', function(err, polys1){
      t.load(__dirname + '/testIn/Intersect2.geojson', function(err, polys2){
        t.union(polys1.features[0], polys2.features[0], function(err, unioned){
          if(err) throw err
          unioned.features[0].should.be.ok
          fs.writeFileSync(__dirname + '/testOut/unioned.geojson', JSON.stringify(unioned))
          done()
        })
      })
    })
  })
}) 