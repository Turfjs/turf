var t = require('../index')

describe('area', function(){
  xit('should return the area of a polygon', function(done){
    var poly = t.poly([[[0,0],[0,10],[10,10],10,0]])
    t.area(poly, function(err, areaResult){
      if(err) throw err
      areaResult.should.be.ok
      done()
    })
  })
})