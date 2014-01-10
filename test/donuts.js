var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('donuts', function(){

  it('should take a set of polygons and return a set of donuts', function(done){
    t.load('../test/testIn/donutsIn.geojson', function(err, donutsIn){
      if(err) throw err
      t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        fs.writeFileSync('./testOut/donuts.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
        done()
      })
    })
  })
  it('should take a set of polygons and return a set of donuts', function(done){
    t.load('../test/testIn/donutsIn2.geojson', function(err, donutsIn){
      if(err) throw err
      t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        fs.writeFileSync('./testOut/donuts2.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
        done()
      })
    })
  })
  it('should take a set of polygons and return a set of donuts with a shared edge', function(done){
    t.load('../test/testIn/donutsIn3.geojson', function(err, donutsIn){
      if(err) throw err
      t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        fs.writeFileSync('./testOut/donuts3.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
        done()
      })
    })
  })
})