var t = require('../index'),
  _ = require('lodash')

describe('combine', function(){
  it('should should combine two points into a MultiPoint', function(done){
    var p1 = t.point(50, 51)
    var p2 = t.point(100, 101)

    t.combine(t.featurecollection([p1, p2]), function(err, combined){
      if(err) throw err
      combined.should.be.ok
      combined.geometry.type.should.equal('MultiPoint')
      console.log(combined.geometry)
      _.isEqual(combined.geometry.coordinates, [[50, 51], [100, 101]]).should.be.true
      done()
    })
  })
  it('should should combine two LineStrings into a MultiLineString', function(done){
    var l1 = {
      "type": "LineString",
      "coordinates": [
        [
          102.0,
          -10.0
        ],
        [
          130.0,
          4.0
        ]
      ]
    }
    var l2 = {
      "type": "LineString",
      "coordinates": [
        [
          40.0,
          -20.0
        ],
        [
          150.0,
          18.0
        ]
      ]
    }
    t.combine(t.featurecollection([l1, l2]), function(err, combined){
      if(err) throw err
      combined.should.be.ok
      combined.geometry.type.should.equal('MultiLineString')
      _.isEqual(combined.geometry.coordinates, [[[102, -10], [130, 4]], [[40, -20], [150, 18]]]).should.be.true
      done()
    })
  })
  it('should should combine two Polygons into a MultiPolygon', function(done){
    var p1 = {
      "type": "Polygon",
      "coordinates": [
      [
        [
          20.0,
          0.0
        ],
        [
          101.0,
          0.0
        ],
        [
          101.0,
          1.0
        ],
        [
          100.0,
          1.0
        ],
        [
          100.0,
          0.0
        ]
      ]
    ]
    }
    var p2 = {
      "type": "Polygon",
      "coordinates": [
      [
        [
          30.0,
          0.0
        ],
        [
          102.0,
          0.0
        ],
        [
          103.0,
          1.0
        ]
      ]
    ]
    }
    t.combine(t.featurecollection([p1, p2]), function(err, combined){
      if(err) throw err
      combined.should.be.ok
      combined.geometry.type.should.equal('MultiPolygon')
      _.isEqual(combined.geometry.coordinates, 
        [[[[20,0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
        [[[30.0,0.0],[102.0,0.0],[103.0,1.0]]]]
        ).should.be.true
      done()
    })
  })
})



