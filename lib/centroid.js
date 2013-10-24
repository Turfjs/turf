var g = {}
var _ = require('lodash'),
    ss = require('simple-statistics')
    explode = require('./explode'),
    point = require('./point'),
g.explode = explode
g.point = point

module.exports = function(features, done){
  g.explode(features, function(err, vertices){
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

    console.log('')
    console.log(xs)
    console.log(ys)
    console.log(averageX)
    console.log(averageY)
    console.log('')

    done(err, g.point(averageX, averageY))
  })
}