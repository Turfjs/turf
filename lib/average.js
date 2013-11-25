var t = {}
var _ = require('lodash')
t.tag = require('./tag')

module.exports = function(polyFC, PtFC, field, outField, polyID, done){
  t.tag(ptFC, polyFC, polyID, function(err, taggedPts){
    
  })
  done(new Error('not implemented'))
}