geo.js
======

a node.js library for performing gis operations



**Current Features**

- load
- extent
- center

**Planned Features**

- add features
- buffer
- contour
- convert
- distance
- filter
- intersect
- quantile
- reclass
- remove
- style
- union
- erase

***Examples:***

**load**

    var g = require('geo')
    g.load('path/to/file/example.json', function(layer, err){
      if(err) throw err
      console.log(layer)
    })

**extent**

    var g = require('geo')
    g.load('path/to/file/example.json', function(layer, err){
      if(err) throw err
      g.extent(layer, function(extent){
        console.log(extent)
      })
    })

**center**

    var g = require('geo')
    g.load('path/to/file/example.json', function(layer, err){
      if(err) throw err
      g.center(layer, function(center){
        console.log(center)
      })
    })


***Development***

**Run Tests**
cd tests & mocha .