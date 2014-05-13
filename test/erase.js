var t = require('../index'),
    should = require('should'),
    fs = require('fs')

describe('erase', function(){
  it('should return polygon 1 minus polygon 2', function(done){
    t.load(__dirname + '/testIn/Intersect1.geojson', function(err, polys1){
      t.load(__dirname + '/testIn/Intersect2.geojson', function(err, polys2){
        var syncErased = t.erase(polys1.features[0], polys2.features[0], function(err, erased){
          if(err) throw err
          erased.should.be.ok
          fs.writeFileSync(__dirname + '/testOut/erased1.geojson', JSON.stringify(erased))
        })

        if (typeof syncErased === 'Error') {
          throw syncErased;
        }

        syncErased.should.be.ok;

        done();
      })
    })
  })
  it('should return polygon 1 minus polygon 2 with 1 cut in half', function(done){
    t.load(__dirname + '/testIn/erasedFC.geojson', function(err, polys1){
      var syncErased = t.erase(polys1.features[0], polys1.features[1], function(err, erased){
        if(err) throw err
        erased.should.be.ok
        fs.writeFileSync(__dirname + '/testOut/erase2.geojson', JSON.stringify(erased))
      })

      if (typeof syncErased === 'Error') {
        throw syncErased;
      }

      syncErased.should.be.ok;

      done();
    })
  })
  it('should return polygon 1 minus polygon 2 with 1 having a hole', function(done){
    t.load(__dirname + '/testIn/erasedHole.geojson', function(err, polys1){
      var syncErased = t.erase(polys1.features[0], polys1.features[1], function(err, erased){
        if(err) throw err
        erased.should.be.ok
        fs.writeFileSync(__dirname + '/testOut/erase3.geojson', JSON.stringify(erased))
      })

      if (typeof syncErased === 'Error') {
        throw syncErased;
      }

      syncErased.should.be.ok;

      done();
    })
  })
  it('should return polygon 1 minus polygon 2 with 1 having a shared edge', function(done){
    t.load(__dirname + '/testIn/eraseOutside.geojson', function(err, polys1){
      t.load(__dirname + '/testIn/eraseInside.geojson', function(err, polys2){
        var syncErased = t.erase(polys1, polys1, function(err, erased){
          if(err) throw err
          erased.should.be.ok
          fs.writeFileSync(__dirname + '/testOut/erase3.geojson', JSON.stringify(erased))
        })

        if (typeof syncErased === 'Error') {
          throw syncErased;
        }
          
        syncErased.should.be.ok;

        done();
      })
    })
  })
}) 