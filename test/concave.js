var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('concave', function(){
  it('should create a concave polygon', function(done){
    t.load('../test/testIn/concaveIn.geojson', function(err, points){
      t.concave(points, 1, function(err, concaved){
        if(err) throw err
        concaved.should.be.ok
        concaved.features[0].geometry.type.should.equal('Polygon')
        concaved.features[0].geometry.coordinates.should.be.ok
        fs.writeFileSync(__dirname + '/testOut/concave1.geojson',JSON.stringify(concaved))
        done()  
      })
    })
  })
  it('should create a concave polygon with a hole', function(done){
    t.load('../test/testIn/concaveInHole.geojson', function(err, points){
      t.concave(points, 1, function(err, concaved){
        if(err) throw err
        concaved.should.be.ok
        concaved.features[0].geometry.type.should.equal('Polygon')
        concaved.features[0].geometry.coordinates.should.be.ok
        fs.writeFileSync(__dirname + '/testOut/concave2.geojson',JSON.stringify(concaved))
        done()
      })
    })
  })
})