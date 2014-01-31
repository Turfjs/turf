var t = require('../index'), 
    should = require('should')
  
describe('quantile', function(){
  it('should take a set of points and an array of percentiles and return a list of quantile breaks', function(done){
    t.load(__dirname+'/testIn/Points3.geojson', function(err, pts){
      if(err) throw err
      pts.should.be.ok
      t.quantile(pts, 'elevation', [10,30,40,60,80,90,99], function(err, quantiles){
        if(err) throw err
        quantiles.should.be.ok
        quantiles.length.should.equal(7)
        done()
      })
    })
  })
})