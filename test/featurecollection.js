var g = require('../index'),
  should = require('should')

describe('feature', function(){
  it('should return a feature collection', function(done){
    var fc = g.featurecollection(null)
    fc.should.be.ok
    done()
  })
}) 