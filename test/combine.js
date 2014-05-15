var t = require('../index'),
  _ = require('lodash'),
  should = require('should')

describe('combine', function(){
  it('should should combine two points into a MultiPoint', function(done){
    var p1 = t.point(50, 51)
    var p2 = t.point(100, 101)

    var syncCombined = t.combine(t.featurecollection([p1, p2]), function(err, combined){
      if(err) throw err
      combined.should.be.ok
      combined.geometry.type.should.equal('MultiPoint')
      _.isEqual(combined.geometry.coordinates, [[50, 51], [100, 101]]).should.be.true
    })

    if (syncCombined instanceof Error) {
      throw syncCombined;
    }

    syncCombined.should.be.ok;
    syncCombined.geometry.type.should.equal('MultiPoint');
    _.isEqual(syncCombined.geometry.coordinates, [[50, 51], [100, 101]]).should.be.true;

    done();
  })
  it('should should combine two LineStrings into a MultiLineString', function(done){
    var l1 = t.linestring([
        [
          102.0,
          -10.0
        ],
        [
          130.0,
          4.0
        ]
      ])

    var l2 = t.linestring([
        [
          40.0,
          -20.0
        ],
        [
          150.0,
          18.0
        ]
      ])
    var syncCombined = t.combine(t.featurecollection([l1, l2]), function(err, combined){
      if(err) throw err
      combined.should.be.ok
      combined.geometry.type.should.equal('MultiLineString')
      _.isEqual(combined.geometry.coordinates, [[[102, -10], [130, 4]], [[40, -20], [150, 18]]]).should.be.true
    })

    if (syncCombined instanceof Error) {
      throw syncCombined;
    }

    syncCombined.should.be.ok;
    syncCombined.geometry.type.should.equal('MultiLineString');
    _.isEqual(syncCombined.geometry.coordinates, [[[102, -10], [130, 4]], [[40, -20], [150, 18]]]).should.be.true;
      
    done();
  })
  it('should should combine two Polygons into a MultiPolygon', function(done){
    var p1 = t.polygon( [
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
    ])
    var p2 = t.polygon([
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
    ])
    var syncCombined = t.combine(t.featurecollection([p1, p2]), function(err, combined){
      if(err) throw err
      combined.should.be.ok
      combined.geometry.type.should.equal('MultiPolygon')
      _.isEqual(combined.geometry.coordinates, 
        [[[[20,0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
        [[[30.0,0.0],[102.0,0.0],[103.0,1.0]]]]
        ).should.be.true
    })

    if (syncCombined instanceof Error) {
      throw syncCombined;
    }

    syncCombined.should.be.ok;
    syncCombined.geometry.type.should.equal('MultiPolygon');
    _.isEqual(syncCombined.geometry.coordinates, 
      [[[[20,0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
      [[[30.0,0.0],[102.0,0.0],[103.0,1.0]]]]
      ).should.be.true;

    done();
  })
})



