var t = {}
var _ = require('lodash'),
    ss = require('simple-statistics')
    explode = require('./explode'),
    point = require('./point'),
t.explode = explode
t.point = point

module.exports = function(features, done){
  t.explode(features, function(err, vertices){
    var averageX, 
        averageY, 
        xs = [], 
        ys = []
    
    _.each(vertices.features, function(v){
      xs.push(v.geometry.coordinates[0])
      ys.push(v.geometry.coordinates[1])
    })

    averageX = ss.mean(xs)
    averageY = ss.mean(ys)

    done(err, t.point(averageX, averageY))
  })
}