var t = require('../index'),
    should = require('should')

describe('extent', function(){
  it('should return the proper extent for a FeatureCollection', function(done){
    t.load(__dirname+'/testIn/FeatureCollection.geojson', function(err, layer){
      if(err) throw err
      t.extent(layer, function(err, extent){
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
    t.load(__dirname+'/testIn/Point.geojson', function(err, layer){
      if(err) throw err
      t.extent(layer, function(err, extent){
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
    t.load(__dirname+'/testIn/Polygon.geojson', function(err, layer){
      if(err) throw err
      t.extent(layer, function(err, extent){
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
    t.load(__dirname+'/testIn/LineString.geojson', function(err, layer){
      if(err) throw err
      t.extent(layer, function(err, extent){
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
    t.load(__dirname+'/testIn/MultiLineString.geojson', function(err, layer){
      if(err) throw err
      t.extent(layer, function(err, extent){
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
    t.load(__dirname+'/testIn/MultiPolygon.geojson', function(err, layer){
      if(err) throw err
      t.extent(layer, function(err, extent){
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