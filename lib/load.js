var path = require('path'),
    fs = require('fs'),
    ext = '',
    layer

module.exports = function(file, done) {
  ext = path.extname(file);
  fs.readFile(file, function(err, res){
    layer = JSON.parse(res)
    done(null, layer)
  })  
}
