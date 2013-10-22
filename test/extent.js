var g = require('../index'),
    should = require('should')

describe('extent', function(){
  it('should return the proper extent for a FeatureCollection', function(done){
    g.load('../test/testIn/FeatureCollection.geojson', function(err, layer){
      if(err) throw err
      g.extent(layer, function(err, extent){
        extent.should.be.ok
        extent[0].should.equal(20)
        extent[1].should.equal(-10)
        extent[2].should.equal(130)
        extent[3].should.equal(4)
        done()
      })
    })
  })
  it('should return the proper extent for a Point', function(done){
    g.load('../test/testIn/Point.geojson', function(err, layer){
      if(err) throw err
      g.extent(layer, function(err, extent){
        extent.should.be.ok
        extent[0].should.equal(102)
        extent[1].should.equal(0.5)
        extent[2].should.equal(102)
        extent[3].should.equal(0.5)
        done()
      })
    })
  })
  it('should return the proper extent for a Polygon', function(done){
    g.load('../test/testIn/Polygon.geojson', function(err, layer){
      if(err) throw err
      g.extent(layer, function(err, extent){
        extent.should.be.ok
        extent[0].should.equal(100)
        extent[1].should.equal(0)
        extent[2].should.equal(101)
        extent[3].should.equal(1)
        done()
      })
    })
  })
  it('should return the proper extent for a LineString', function(done){
    g.load('../test/testIn/LineString.geojson', function(err, layer){
      if(err) throw err
      g.extent(layer, function(err, extent){
        extent.should.be.ok
        extent[0].should.equal(102)
        extent[1].should.equal(-10)
        extent[2].should.equal(130)
        extent[3].should.equal(4)
        done()
      })
    })
  })
  it('should return the proper extent for a MultiLineString', function(done){
    g.load('../test/testIn/MultiLineString.geojson', function(err, layer){
      if(err) throw err
      g.extent(layer, function(err, extent){
        extent.should.be.ok
        extent[0].should.equal(100)
        extent[1].should.equal(0)
        extent[2].should.equal(103)
        extent[3].should.equal(3)
        done()
      })
    })
  })
  it('should return the proper extent for a MultiPolygon', function(done){
    g.load('../test/testIn/MultiPolygon.geojson', function(err, layer){
      if(err) throw err
      g.extent(layer, function(err, extent){
        extent.should.be.ok
        extent[0].should.equal(100)
        extent[1].should.equal(0)
        extent[2].should.equal(103)
        extent[3].should.equal(3)
        done()
      })
    })
  })
})