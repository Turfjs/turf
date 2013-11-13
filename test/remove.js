var t = require('../index')
  , should = require('should');

describe('remove', function(){
  it('should return 3', function(done){
    var points = t.featurecollection([t.point(1,2, {team: 'Red Sox'}), t.point(2,1, {team: 'Yankees'}), t.point(3,1, {team: 'Nationals'}), t.point(2,2, {team: 'Yankees'}), t.point(2,3, {team: 'Red Sox'}), t.point(4,2, {team: 'Yankees'})])
    t.remove(points, 'team', 'Yankees', function(err, newCol) {
      //throw new Error('not implemented')
      if(err) throw err
      //console.log(newCol.features[0].properties);
      console.log(newCol.features.length)
      newCol.features.length.should.equal(3)
      done()
    })
  })
})