var t = require('../index'), 
    should = require('should')
  
describe('jenks', function(){
  it('should take a set of points and an array of percentiles and return a list of quantile breaks', function(done){
    var num = 10

    t.load(__dirname+'/testIn/Points3.geojson', function(err, pts){
      if(err) throw err
      pts.should.be.ok
      t.jenks(pts, 'elevation', num, function(err, breaks){
        if(err) throw err
        breaks.should.be.ok
        breaks.length.should.equal(11)
        done()
      })
    })
  })
})