var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('topo', function(){
  it('should take geojson and output topojson', function(done){
    t.load('./testOut/contours.geojson', function(err, polys){
      if(err) throw err
      t.topo(polys, function(err, topoPolys){
        if(err) throw err
        topoPolys.should.be.ok
        fs.writeFileSync('./testOut/topo.topojson', JSON.stringify(topoPolys))
        done()
      })
    })
  })
  it('should take geojson and output topojson with shared arcs', function(done){
    var poly1 = t.polygon([[[0,0], [0,10], [10,10]]])
    var poly2 = t.polygon([[[0,0], [0,10], [-10,-10]]])
    var fc = t.featurecollection([poly1, poly2])
    t.topo(fc, function(err, topoPolys){
      if(err) throw err
      topoPolys.should.be.ok
      //fs.writeFileSync('./testOut/topo.topojson', JSON.stringify(topoPolys))
      done()
    })
  })
}) 