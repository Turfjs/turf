var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('merge', function(){
  it('should take a set of polygons and merge them into a single polygon', function(done){
    t.load('../test/testIn/mergeIn.geojson', function(err, polygons){
      //console.log(JSON.stringify(polygons,null,2))
      //console.log('!!!!!!!!!!!!!!!!!')
      t.merge(polygons, function(err, mergeOut){
        if(err) throw err
        fs.writeFileSync('./testOut/merge.geojson', JSON.stringify(mergeOut))
        mergeOut.should.be.ok
        mergeOut.features.should.be.ok
        done()
      })
    })
  })
})