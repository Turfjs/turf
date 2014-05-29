var t = {}
var fs = require('fs')
t.topo = require('./topo')

module.exports = function(path, features, type, done){
  if(!type) type = 'geojson'
  switch(type) {
    case 'geojson':
      fs.writeFile(path, JSON.stringify(features), function(err){
        done(err, 1)
      })
      break
      
    case 'topojson':
      t.topo(features, function(err, topology){
        fs.writeFile(path, JSON.stringify(features), function(err){
          done(err, 1)
        })
      })
      break
  }
}
