var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('simplify', function(){
  it('should simplify a complex polygon or linestring', function(done){
    t.load('./testOut/contours.geojson', function(err, polys){
      if(err) throw err
      polys.should.be.ok
      t.simplify(polys, 50, 0, function(err, simplified){
        if(err) throw err
        simplified.should.be.ok
        fs.writeFileSync('./testOut/simplified.geojson', JSON.stringify(simplified))
        done()
      })
    })
  })
}) 