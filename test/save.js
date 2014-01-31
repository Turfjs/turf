var t = require('../index'),
  should = require('should')

describe('save', function(){
  it('should save out a feature to geojson.', function(done){
    var path = __dirname+'/testOut/poly.geojson'
    var poly = t.polygon([[[0,0], [1,0], [1,1],[0,1]]])
    var type = 'geojson'
    t.save(path, poly, type, function(err, res){
      if(err) throw err
      res.should.be.ok
      done()
    })
  })
}) 