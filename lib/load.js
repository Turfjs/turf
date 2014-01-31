var path = require('path'),
    fs = require('fs'),
    layer

module.exports = function(file, done) {
  fs.readFile(file, function(err, res){
    if (err) done(err)
    layer = JSON.parse(res)
    done(null, layer)
  })  
}
