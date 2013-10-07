geo.js
======

a node.js library for performing geospatial operations with geojson

    npm install geo.js

- - -

**Current Features**

- load
- extent
- center
- combine
- distance
- buffer (works on a Point; Lines and Polygons coming soon)

**Planned Features**

- contour
- convert
- filter
- intersect
- quantile
- reclass
- remove
- style
- union
- erase
- smooth

- - -

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

**combine**

    var p1 = {
        "type": "Point",
        "coordinates": [
          50,
          51
        ]
      }
      var p2 = {
        "type": "Point",
        "coordinates": [
          100,
          101
        ]
      }

      g.combine([p1, p2], function(err, combined){
        if(err) throw err
        console.log(combined)
      })

**buffer**

    var p = {
      "type": "Point",
      "coordinates": [
        0,
        0.05
      ]
    }
    g.buffer(p, 10, function(err, buffered){
      if(err) throw err
      console.log(buffered)
    })

**distance**

    var point1 = 
    { 
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-75.343, 39.984]}
    }

    var point2 = 
    { 
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-75.534, 39.123]}
    }
    
    g.distance(point1, point2, 'miles', function(err, distance){
      if(err) throw err
      console.log(distance)
    })

- - -

***Development***

**Run Tests**
mocha test/*