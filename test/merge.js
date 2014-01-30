var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('merge', function(){
  it('should take a set of polygons and merge them into a single polygon', function(done){
    t.load('../test/testIn/mergeIn.geojson', function(err, polygons){
      t.merge(polygons, function(err, mergeOut){
        if(err) throw err
        //fs.writeFileSync('./testOut/merge.geojson', JSON.stringify(mergeOut))
        mergeOut.should.be.ok
        done()
      })
    })
  })
  it('should take a set of polygons sharing a border and merge them into a single polygon', function(done){
    t.load('../test/testIn/mergeIn2.geojson', function(err, polygons){
      t.merge(polygons, function(err, mergeOut){
        if(err) throw err
        fs.writeFileSync('./testOut/merge2.geojson', JSON.stringify(mergeOut))
        mergeOut.should.be.ok
        done()
      })
    })
  })
  xit('should take a set of polygons for all countries and create a set of continents', function(done){
    t.load('../test/testIn/countries.geojson', function(err, polygons){
      t.merge(polygons, function(err, mergeOut){
        if(err) throw err
        fs.writeFileSync('./testOut/world.geojson', JSON.stringify(mergeOut))
        mergeOut.should.be.ok
        done()
      })
    })
  })
})