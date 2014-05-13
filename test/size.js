var t = require('../index'),
  should = require('should'),
  _ = require('lodash')


describe('size', function(){
  it('should double the size of a bbox at 0,0', function(done){
    var bbox = [0, 0, 10, 10]

    var syncDoubled = t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [-10, -10, 20, 20])
    })

    if (typeof syncDoubled === 'Error') {
      throw syncDoubled;
    }

    syncDoubled.should.be.ok;
    _.isEqual(syncDoubled, [-20, -20, 10, 10]);

    done();
  })
  it('should double the size of a bbox at -10,-10', function(done){
    var bbox = [-10, -10, 0, 0]

    var syncDoubled = t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [-20, -20, 10, 10])
    })

    if (typeof syncDoubled === 'Error') {
      throw syncDoubled;
    }

    syncDoubled.should.be.ok;
    _.isEqual(syncDoubled, [-20, -20, 10, 10]);

    done();
  })
  it('should expand the size of a bbox by 50%', function(done){
    var bbox = [0, 0, 10, 10]

    var syncDoubled = t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [-5, -5, 15, 15])
    })

    if (typeof syncDoubled === 'Error') {
      throw syncDoubled;
    }

    syncDoubled.should.be.ok;
    _.isEqual(syncDoubled, [-20, -20, 10, 10]);

    done();
  })
  it('should shrink a bbox by 50%', function(done){
    var bbox = [0, 0, 10, 10]

    var syncDoubled = t.size(bbox, 2, function(err, doubled){
      if(err) throw err
      doubled.should.be.ok
      _.isEqual(doubled, [.25, .25, 7.5, 7.5])
    })

    if (typeof syncDoubled === 'Error') {
      throw syncDoubled;
    }

    syncDoubled.should.be.ok;
    _.isEqual(syncDoubled, [-20, -20, 10, 10]);

    done();
  })
}) 