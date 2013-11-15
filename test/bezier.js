var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('bezier', function(){
  it('should take a line and return a smoothed version of the line', function(done){
    t.load('./testIn/bezierIn.geojson', function(err, lineIn){
      if(err) throw err
      t.bezier(lineIn, 5000, .85, function(err, lineOut){
        if(err) throw err
        lineOut.should.be.ok
        lineOut.geometry.coordinates.should.be.ok
        fs.writeFileSync('./testOut/bezier.geojson', JSON.stringify(lineOut))
        done()        
      })
    })
  })
})