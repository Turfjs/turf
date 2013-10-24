var g = require('../index'),
  should = require('should'),
  _ = require('lodash')

describe('explode', function(){
  it('should take a feature or feature collection and return all vertices', function(done){
    var poly = g.polygon([[[0,0], [0,10], [10,10] , [10,0]]])
    var p1 = g.point(0,0),
        p2 = g.point(0,10),
        p3 = g.point(10,10),
        p4 = g.point(10,0)
    var fc = g.featurecollection([p1,p2,p3,p4])

    g.explode(poly, function(err, vertices){
      if(err) throw err
        vertices.should.be.ok
      _.isEqual(vertices, fc).should.be.true

      done()
    })
  })
}) 