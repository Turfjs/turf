var t = require('../index'),
  should = require('should')

describe('sum', function(){
  it('should create a sum of field for all points within a set of polygons', function(done){
    var poly1 = t.polygon([[[0,0],[0,10],[10,10],10,0]])
    var poly2 = t.polygon([[[10,0],[10,10],[20,10],20,0]])
    var polyFC = t.featurecollection([poly1, poly2])
    var pt1 = t.point(1,1, {population: 100})
    var pt2 = t.point(1,3, {population: 100})
    var pt3 = t.point(14,2, {population: 100})
    var pt4 = t.point(13,1, {population: 100})
    var pt5 = t.point(19,7, {population: 100})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

    t.sum(polyFC, ptFC, 'population', function(err, summed){
      if(err) throw err
      summed.should.be.ok
      summed.features.should.be.ok
      summed.features[0].properties.population_sum.should.equal(200)
      summed.features[1].properties.population_sum.should.equal(400)
      done()
    })
  })
}) 