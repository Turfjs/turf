var t = require('../index'),
  should = require('should'),
  fs = require('fs')

describe('donuts', function(){
  it('should take a set of polygons and return a set of donuts', function(done){
    t.load(__dirname+'/testIn/donutBadRing.geojson', function(err, donutsIn){
      if(err) throw err
      var syncDonuts = t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        fs.writeFileSync(__dirname+'/testOut/donutsBadRing.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
      })

      if (typeof syncDonuts === 'Error') {
        throw syncDonuts;
      }

      syncDonuts.should.be.ok;
      syncDonuts.features.should.be.ok;
      syncDonuts.features[0].should.be.ok;

      done();
    })
  })
  it('should take a set of polygons and return a set of donuts', function(done){
    t.load(__dirname+'/testIn/donutsIn.geojson', function(err, donutsIn){
      if(err) throw err
      var syncDonuts = t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        //fs.writeFileSync('./testOut/donuts.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
      })

      if (typeof syncDonuts === 'Error') {
        throw syncDonuts;
      }

      syncDonuts.should.be.ok;
      syncDonuts.features.should.be.ok;
      syncDonuts.features[0].should.be.ok;

      done();
    })
  })
  it('should take a set of polygons and return a set of donuts', function(done){
    t.load(__dirname+'/testIn/donutsIn2.geojson', function(err, donutsIn){
      if(err) throw err
      var syncDonuts = t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        //fs.writeFileSync('./testOut/donuts2.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
      })

      if (typeof syncDonuts === 'Error') {
        throw syncDonuts;
      }

      syncDonuts.should.be.ok;
      syncDonuts.features.should.be.ok;
      syncDonuts.features[0].should.be.ok;

      done();
    })
  })
  it('should take a set of polygons and return a set of donuts with a shared edge', function(done){
    t.load(__dirname+'/testIn/donutHoles.geojson', function(err, donutsIn){
      if(err) throw err
      var syncDonuts = t.donuts(donutsIn, function(err, donuts){
        if(err) throw err
        fs.writeFileSync(__dirname+'/testOut/donuts3.geojson', JSON.stringify(donuts))
        donuts.should.be.ok
        donuts.features.should.be.ok
        donuts.features[0].should.be.ok
      })

      if (typeof syncDonuts === 'Error') {
        throw syncDonuts;
      }

      syncDonuts.should.be.ok;
      syncDonuts.features.should.be.ok;
      syncDonuts.features[0].should.be.ok;

      done();
    })
  })
})