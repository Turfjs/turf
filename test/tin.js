var g = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('tin', function(){
  it('should create a TIN from a set of points', function(done){
    g.load('../test/testFiles/Points3.geojson', function(err, points){
      g.tin(points, 'elevation', function(err, tin){
        if(err) throw err
        tin.should.be.ok
        tin.features[0].geometry.type.should.equal('Polygon')
        tin.features[0].geometry.coordinates.should.be.ok
        fs.writeFileSync('./testOut/tin.geojson',JSON.stringify(tin))
        done()  
      })
    })
  })
}) 