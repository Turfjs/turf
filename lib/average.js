var t = {}
var _ = require('lodash')
t.tag = require('./tag')

module.exports = function(polyFC, ptFC, field, outField, polyID, done){
  console.log(ptFC)
  t.tag(ptFC, polyFC, polyID, field, function(err, taggedPts){
    //_.groupBy(taggedPts, outField)
  })
  done(new Error('not implemented'))
}