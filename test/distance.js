var g = require('../index')

describe('distance', function(){
  describe('#index', function(){
    it('should return the distance between two points', function(done){
      g.distance([], 'miles', function(err, distance){
        if(err) throw err
        done()
      })
    })
  })
}) 