var t = require('../index'),
  should = require('should')

describe('deviation', function(){
  it('should create a standard deviation of field for all points within a set of polygons', function(done){
    var poly1 = t.polygon([[[0,0],[10,0],[10,10],[0,10]]])
    var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
    var polyFC = t.featurecollection([poly1, poly2])
    var pt1 = t.point(1,1, {population: 500})
    var pt2 = t.point(1,3, {population: 400})
    var pt3 = t.point(14,2, {population: 600})
    var pt4 = t.point(13,1, {population: 500})
    var pt5 = t.point(19,7, {population: 200})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    t.variance(polyFC, ptFC, 'population', 'population_variance', function(err, variancePolys){
      if(err) throw err
      variancePolys.should.be.ok
      variancePolys.features.should.be.ok
      variancePolys.features[0].properties.population_variance.should.be.ok
      console.log(variancePolys.features[0].properties.population_variance)
      done()
    })
  })
})