var path = require('path'),
    fs = require('fs'),
    ext = '',
    layer

module.exports = function(file, done) {
  ext = path.extname(file);
  if(ext === '.json'){
    layer = require(file)
    done(layer)
  }
}