var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('tag', function(){
  it('should tag a point layer with a property from a polygon layer', function(done){
    t.load(__dirname+'/testIn/tagPoints.geojson', function(err, points){
      if(err) throw err
      t.load(__dirname+'/testIn/tagPolygons.geojson', function(err, polygons){
        if(err) throw err
        var syncTaggedPoints = t.tag(points, polygons, 'polyID', 'containingPolyID', function(err, taggedPoints){
          if(err) throw err
          taggedPoints.should.be.ok
          taggedPoints.features.should.be.ok
          //fs.writeFileSync('./testOut/taggedPoints.geojson', JSON.stringify(taggedPoints))
        })

        if (syncTaggedPoints instanceof Error) {
          throw syncTaggedPoints;
        }

        syncTaggedPoints.should.be.ok;
        syncTaggedPoints.features.should.be.ok;
        done();
      })
    })
  })
})