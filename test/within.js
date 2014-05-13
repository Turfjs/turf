var t = require('../index'),
  should = require('should')

describe('within', function(){
  it('should return all points that are within a set of polygons', function(done){
    var poly = t.polygon([[[0,0], [0,100], [100,100], [100,0]]])
    var pt = t.point(50, 50)
    var polyFC = t.featurecollection([poly])
    var ptFC = t.featurecollection([pt])

    var syncCounted = t.within(ptFC, polyFC, function(err, counted){
      if(err) throw err
      counted.should.be.ok
      counted.features.should.be.ok
      counted.features.length.should.equal(1)
    })

    if (typeof syncCounted === 'Error') {
      throw syncCounted;
    }

    syncCounted.should.be.ok;
    syncCounted.features.should.be.ok;
    syncCounted.features.length.should.equal(1);

    done();
  })
  it('should return all points that are within a set of polygons', function(done){
    var poly = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
    var polyFC = t.featurecollection([poly])
    var pt1 = t.point(1,1, {population: 500})
    var pt2 = t.point(1,3, {population: 400})
    var pt3 = t.point(14,2, {population: 600})
    var pt4 = t.point(13,1, {population: 500})
    var pt5 = t.point(19,7, {population: 200})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    var syncCounted = t.within(ptFC, polyFC, function(err, counted){
      if(err) throw err
      counted.should.be.ok
      counted.features.should.be.ok
      counted.features.length.should.equal(3)
    })

    if (typeof syncCounted === 'Error') {
      throw syncCounted;
    }

    syncCounted.should.be.ok;
    syncCounted.features.should.be.ok;
    syncCounted.features.length.should.equal(3);

    done();
  })
  it('should return all points that are within a set of polygons', function(done){
    var poly = t.polygon([[[0,0],[10,0],[10,10],[0,10]]])
    var polyFC = t.featurecollection([poly])
    var pt1 = t.point(1,1, {population: 500})
    var pt2 = t.point(1,3, {population: 400})
    var pt3 = t.point(14,2, {population: 600})
    var pt4 = t.point(13,1, {population: 500})
    var pt5 = t.point(19,7, {population: 200})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    var syncCounted = t.within(ptFC, polyFC, function(err, counted){
      if(err) throw err
      counted.should.be.ok
      counted.features.should.be.ok
      counted.features.length.should.equal(2)
    })

    if (typeof syncCounted === 'Error') {
      throw syncCounted;
    }

    syncCounted.should.be.ok;
    syncCounted.features.should.be.ok;
    syncCounted.features.length.should.equal(2);

    done();
  })
  it('should return all points that are within a set of polygons', function(done){
    var poly1 = t.polygon([[[0,0],[10,0],[10,10],[0,10]]])
    var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
    var polyFC = t.featurecollection([poly1, poly2])
    var pt1 = t.point(1,1, {population: 500})
    var pt2 = t.point(1,3, {population: 400})
    var pt3 = t.point(14,2, {population: 600})
    var pt4 = t.point(13,1, {population: 500})
    var pt5 = t.point(19,7, {population: 200})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    var syncCounted = t.within(ptFC, polyFC, function(err, counted){
      if(err) throw err
      counted.should.be.ok
      counted.features.should.be.ok
      counted.features.length.should.equal(5)
    })

    if (typeof syncCounted === 'Error') {
      throw syncCounted;
    }

    syncCounted.should.be.ok;
    syncCounted.features.should.be.ok;
    syncCounted.features.length.should.equal(5);

    done();
  })
})