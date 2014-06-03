var test = require('tape')
var turf = require('./index.js')

test('turf', function(t){
  t.ok(turf, 'Initialized turf successfully')

  // check that each of the sub modules initializes as a function
  Object.keys(turf).forEach(function(module){
    t.ok(turf[module], module)
    t.equal(typeof turf[module], 'function', module + ' is a function')
  })

  t.end()
})