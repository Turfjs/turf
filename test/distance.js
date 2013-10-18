var g = require('../index'),
  should = require('should')

describe('distance', function(){
  it('should return the distance between two points', function(done){
    g.load('../test/testIn/Point1.geojson', function(err, point1){
      if(err) throw err
      g.load('../test/testIn/Point2.geojson', function(err, point2){
        if(err) throw err
        g.distance(point1, point2, 'miles', function(err, distance){
          if(err) throw err
          distance.should.be.ok
          distance.should.not.equal(0)
          done()
        })
      })
    })
  })
}) 