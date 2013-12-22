var t = require('../index'),
  should = require('should')

describe('aggregate', function(){
  it('should take a set of polygons, a set of points, and an array of aggregations, then perform them', function(done){
    var poly1 = t.polygon([[[0,0],[10,0],[10,10],[0,10]]])
    var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
    var polyFC = t.featurecollection([poly1, poly2])
    var pt1 = t.point(5,5, {population: 200})
    var pt2 = t.point(1,3, {population: 600})
    var pt3 = t.point(14,2, {population: 100})
    var pt4 = t.point(13,1, {population: 200})
    var pt5 = t.point(19,7, {population: 300})
    var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])
    var aggregations = [
      {
        aggregation: 'sum',
        inField: 'population',
        outField: 'pop_sum'
      },
      {
        aggregation: 'average',
        inField: 'population',
        outField: 'pop_avg'
      },
      {
        aggregation: 'median',
        inField: 'population',
        outField: 'pop_median'
      },
      {
        aggregation: 'min',
        inField: 'population',
        outField: 'pop_min'
      },
      {
        aggregation: 'max',
        inField: 'population',
        outField: 'pop_max'
      }
    ]

    t.aggregate(polyFC, ptFC, aggregations, function(err, polys){
      if(err) throw err
      polys.should.be.ok
      polys.features.should.be.ok
      polys.features[0].properties.pop_sum.should.equal(800)
      polys.features[1].properties.pop_sum.should.equal(600)
      polys.features[0].properties.pop_avg.should.equal(400)
      polys.features[1].properties.pop_avg.should.equal(200)
      done()
    })
  })
}) 