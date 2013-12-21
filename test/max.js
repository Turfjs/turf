var t = require('../index'),
  should = require('should')

describe('average', function(){
  it('should create an average of field for all points within a set of polygons', function(done){
    var poly1 = t.polygon([[[0,0],[10,0],[10,10], [0,10]]])
    var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
    var polyFC = t.featurecollection([poly1, poly2])
    var pt1 = t.point(5,5, {population: 200})
    var pt2 = t.point(1,3, {population: 600})
    var pt3 = t.point(14,2, {population: 100})
    var pt4 = t.point(13,1, {population: 200})
    var pt5 = t.point(19,7, {population: 300})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    t.max(polyFC, ptFC, 'population', 'pop_max', function(err, averaged){
      if(err) throw err
      averaged.should.be.ok
      averaged.features.should.be.ok
      averaged.features[0].geometry.type.should.equal('Polygon')
      averaged.features[0].properties.pop_max.should.equal(600)
      averaged.features[1].properties.pop_max.should.equal(300)
      done()
    })
  })
})