var t = require('../index'),
  should = require('should')

describe('flip', function(){
  it('should flip the x and ys of a point', function(done){
    var pt = t.point(1,0)
    var syncFlipped = t.flip(pt, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.geometry.coordinates[0].should.equal(0)
      flipped.geometry.coordinates[1].should.equal(1)
    })

    if (typeof syncFlipped === 'Error') {
      throw syncFlipped;
    }

    syncFlipped.should.be.ok;
    syncFlipped.geometry.coordinates[0].should.equal(0);
    syncFlipped.geometry.coordinates[1].should.equal(1);

    done();
  })
  it('should flip the x and ys of a linestring', function(done){
    var line = t.linestring([[1,0], [1,0]])
    var syncFlipped = t.flip(line, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.geometry.coordinates[0][0].should.equal(0)
      flipped.geometry.coordinates[0][1].should.equal(1)
      flipped.geometry.coordinates[1][0].should.equal(0)
      flipped.geometry.coordinates[1][1].should.equal(1)
    })

    if (typeof syncFlipped === 'Error') {
      throw syncFlipped;
    }

    syncFlipped.should.be.ok;
    syncFlipped.geometry.coordinates[0][0].should.equal(0);
    syncFlipped.geometry.coordinates[0][1].should.equal(1);
    syncFlipped.geometry.coordinates[1][0].should.equal(0);
    syncFlipped.geometry.coordinates[1][1].should.equal(1);

    done();
  })
  it('should flip the x and ys of a polygon', function(done){
    var poly = t.polygon([[[1,0], [1,0], [1,2]], [[.2,.2], [.3,.3],[.1,.2]]])
    var syncFlipped = t.flip(poly, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.geometry.coordinates[0][0][0].should.equal(0)
      flipped.geometry.coordinates[0][0][1].should.equal(1)
      flipped.geometry.coordinates[0][1][0].should.equal(0)
      flipped.geometry.coordinates[0][1][1].should.equal(1)
      flipped.geometry.coordinates[0][2][0].should.equal(2)
      flipped.geometry.coordinates[0][2][1].should.equal(1)
      flipped.geometry.coordinates[1][2][0].should.equal(.2)
      flipped.geometry.coordinates[1][2][1].should.equal(.1)
    })

    if (typeof syncFlipped === 'Error') {
      throw syncFlipped;
    }

    syncFlipped.should.be.ok;
    syncFlipped.geometry.coordinates[0][0][0].should.equal(0);
    syncFlipped.geometry.coordinates[0][0][1].should.equal(1);
    syncFlipped.geometry.coordinates[0][1][0].should.equal(0);
    syncFlipped.geometry.coordinates[0][1][1].should.equal(1);
    syncFlipped.geometry.coordinates[0][2][0].should.equal(2);
    syncFlipped.geometry.coordinates[0][2][1].should.equal(1);
    syncFlipped.geometry.coordinates[1][2][0].should.equal(.2);
    syncFlipped.geometry.coordinates[1][2][1].should.equal(.1);

    done();
  })
  it('should flip the x and ys of a featurecollection', function(done){
    var pt1 = t.point(1,0)
    var pt2 = t.point(1,0)
    var fc = t.featurecollection([pt1, pt2])
    var syncFlipped = t.flip(fc, function(err, flipped){
      if(err) throw err
      flipped.should.be.ok
      flipped.features[0].geometry.coordinates[0].should.equal(0)
      flipped.features[0].geometry.coordinates[1].should.equal(1)
      flipped.features[1].geometry.coordinates[0].should.equal(0)
      flipped.features[1].geometry.coordinates[1].should.equal(1)
    })

    if (typeof syncFlipped === 'Error') {
      throw syncFlipped;
    }

    syncFlipped.should.be.ok;
    syncFlipped.features[0].geometry.coordinates[0].should.equal(0);
    syncFlipped.features[0].geometry.coordinates[1].should.equal(1);
    syncFlipped.features[1].geometry.coordinates[0].should.equal(0);
    syncFlipped.features[1].geometry.coordinates[1].should.equal(1);

    done();
  })
}) 