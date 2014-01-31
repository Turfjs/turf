var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('grid', function(){
  it('should create a 100x100 grid as a Point FeatureCollection', function(done){
    t.grid([0,0,10,10], 10, function(err, grid){
      if(err) throw err
      grid.should.be.ok
      grid.type.should.equal('FeatureCollection')
      grid.features[0].geometry.type.should.equal('Point')
      //fs.writeFileSync('./testOut/grid.geojson',JSON.stringify(grid))
      done()
    })
  })
  it('should work properly with a negative start value', function(done){
    t.grid([-20,-20,20,20], 10, function(err, grid){
      if(err) throw err
      grid.should.be.ok
      grid.type.should.equal('FeatureCollection')
      grid.features[0].geometry.type.should.equal('Point')
      grid.features[0].geometry.coordinates[0].should.equal(-20)
      grid.features[0].geometry.coordinates[0].should.equal(-20)
      //fs.writeFileSync('./testOut/grid.geojson',JSON.stringify(grid))
      done()
    })
  })
}) 