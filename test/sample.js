var t = require('../index'),
    should = require('should')

describe('sample', function(){
  it('should take a feature collection and a number and return a random sample of n length', function(done){
    var num = 10

    t.load(__dirname+'/testIn/Points3.geojson', function(err, pts){
      if(err) throw err
      pts.should.be.ok
      t.sample(pts, num, function(err, outPts){
        if(err) throw err
        outPts.should.be.ok
        outPts.features.length.should.equal(10)
        //t.save('./testOut/sample.geojson', outPts, 'geojson', function(){})
        done()
      })
    })
  })
})