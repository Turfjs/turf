var g = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('grid', function(){
  it('should create a 100x100 grid as a Point FeatureCollection', function(done){
    g.grid([0,0,10,10], 100, function(err, grid){
      if(err) throw err
      grid.should.be.ok
      grid.type.should.equal('FeatureCollection')
      grid.features[0].geometry.type.should.equal('Point')
      fs.writeFileSync('./testOut/grid.geojson',JSON.stringify(grid))
      done()
    })
  })
}) 