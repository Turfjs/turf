var t = require('../index'),
  should = require('should')

describe('distance', function(){
  it('should return the distance between two points', function(done){
    t.load(__dirname+'/testIn/Point1.geojson', function(err, point1){
      if(err) throw err
      t.load(__dirname+'/testIn/Point2.geojson', function(err, point2){
        if(err) throw err
        var syncDistance = t.distance(point1, point2, 'miles', function(err, distance){
          if(err) throw err
          distance.should.be.ok
          distance.should.not.equal(0)
        })

        if (syncDistance instanceof Error) {
          throw syncDistance;
        }

        syncDistance.should.be.ok;
        syncDistance.should.not.equal(0);

        done();
      })
    })
  })
  it('should return the distance between two points vertically oriented', function(done){
    var point1 = t.point(0,0)
    var point2 = t.point(0,10)
    var syncDistance = t.distance(point1, point2, 'degrees', function(err, distance){
      if(err) throw err
      distance.should.be.ok
      distance.should.not.equal(0)
    })

    if (syncDistance instanceof Error) {
      throw syncDistance;
    }

    syncDistance.should.be.ok;
    syncDistance.should.not.equal(0);

    done();
  })
  it('should return the distance between two points horizontally oriented', function(done){
    var point1 = t.point(0,0)
    var point2 = t.point(10,0)
    var syncDistance = t.distance(point1, point2, 'degrees', function(err, distance){
      if(err) throw err
      distance.should.be.ok
      distance.should.not.equal(0)
    })

    if (syncDistance instanceof Error) {
      throw syncDistance;
    }

    syncDistance.should.be.ok;
    syncDistance.should.not.equal(0);

    done();
  })
}) 