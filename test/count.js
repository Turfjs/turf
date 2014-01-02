var t = require('../index'),
  should = require('should')

describe('count', function(){
  it('should create a count of field for all points within a set of polygons', function(done){
    var poly1 = t.polygon([[[0,0],[10,0],[10,10],[0,10]]])
    var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
    var polyFC = t.featurecollection([poly1, poly2])
    var pt1 = t.point(1,1, {population: 500})
    var pt2 = t.point(1,3, {population: 400})
    var pt3 = t.point(14,2, {population: 600})
    var pt4 = t.point(13,1, {population: 500})
    var pt5 = t.point(19,7, {population: 200})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    t.count(polyFC, ptFC, 'point_count', function(err, counted){
      if(err) throw err
      counted.should.be.ok
      counted.features.should.be.ok
      counted.features[0].properties.point_count.should.equal(2)
      counted.features[1].properties.point_count.should.equal(3)
      done()
    })
  })
})