var t = require('../index'),
  should = require('should')

describe('tag', function(){
  it('should tag a point layer with a property from a polygon layer', function(done){
    t.load('./testIn/tagPoints.geojson', function(err, points){
      if(err) throw err
      t.load('./testIn/tagPolygons.geojson', function(err, polygons){
        if(err) throw err
        t.tag(points, polygons, 'polyID', function(err, taggedPoints){
          if(err) throw err
          taggedPoints.should.be.ok
          taggedPoints.features.should.be.ok
          done()
        })
      })
    })
  })
}) 