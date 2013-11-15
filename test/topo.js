var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('feature', function(){
  it('should take geojson and output topojson', function(done){
    t.load('./testOut/contours.geojson', function(err, polys){
      if(err) throw err
      polys.should.be.ok
      fs.writeFileSync('./testOut/topo.topojson', JSON.stringify(polys))
      done()
    })
  })
}) 