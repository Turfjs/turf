var t = {}
var _ = require('lodash')
t.tag = require('./tag')

module.exports = function(polyFC, ptFC, field, outField, done){
  _.each(polyFC.features, function(poly, i){
    if(!poly.properties){
      poly.properties = {}
    }
    poly.properties.polyID = i
  })
  t.tag(ptFC, polyFC, 'polyID', 'polyID', function(err, taggedPts){
    //_.groupBy(taggedPts, outField)
    //console.log(JSON.stringify(taggedPts, null, 2))
    console.log('tagged')
  })
  done(new Error('not implemented'))
}