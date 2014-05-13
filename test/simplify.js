var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('simplify', function(){
  it('should simplify a featurecollection of complex polygon', function(done){
    t.load(__dirname+'/testIn/complexPolygons.geojson', function(err, geo){
      if(err) throw err
      geo.should.be.ok
      var syncSimplified = t.simplify(geo, 50, 0, function(err, simplified){
        if(err) throw err
        simplified.should.be.ok
        //fs.writeFileSync('./testOut/simplifiedPolygons.geojson', JSON.stringify(simplified))
      })

      if (typeof syncSimplified === 'Error') {
        throw syncSimplified;
      }

      syncSimplified.should.be.ok;

      done();
    })
  })
  it('should simplify a featurecollection of complex linestrings', function(done){
    t.load(__dirname+'/testIn/complexLines.geojson', function(err, geo){
      if(err) throw err
      geo.should.be.ok
      var syncSimplified = t.simplify(geo, 50, 0, function(err, simplified){
        if(err) throw err
        simplified.should.be.ok
        //fs.writeFileSync('./testOut/simplifiedLines.geojson', JSON.stringify(simplified))
      })

      if (typeof syncSimplified === 'Error') {
        throw syncSimplified;
      }

      syncSimplified.should.be.ok;

      done();
    })
  })
  it('should simplify a complex polygon', function(done){
    t.load(__dirname+'/testIn/complexPolygon.geojson', function(err, geo){
      if(err) throw err
      geo.should.be.ok
      var syncSimplified = t.simplify(geo, 50, 0, function(err, simplified){
        if(err) throw err
        simplified.should.be.ok
        //fs.writeFileSync('./testOut/simplifiedPolygon.geojson', JSON.stringify(simplified))
      })

      if (typeof syncSimplified === 'Error') {
        throw syncSimplified;
      }

      syncSimplified.should.be.ok;

      done();
    })
  })
  it('should simplify a complex linestring', function(done){
    t.load(__dirname+'/testIn/complexLine.geojson', function(err, geo){
      if(err) throw err
      geo.should.be.ok
      var syncSimplified = t.simplify(geo, 50, 0, function(err, simplified){
        if(err) throw err
        simplified.should.be.ok
        //fs.writeFileSync('./testOut/simplifiedLine.geojson', JSON.stringify(simplified))
      })

      if (typeof syncSimplified === 'Error') {
        throw syncSimplified;
      }

      syncSimplified.should.be.ok;

      done();
    })
  })
})