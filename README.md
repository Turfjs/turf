geo.js
======

a node.js library for performing geospatial operations with geojson

Please note that this api is still a bit unstable. I expect most of the core stuff to be nailed down in the next couple weeks though. If you notice any bugs, please submit an issue.

    npm install geo.js

- - -

**Features**

- load
- point
- linestring
- polygon
- extent
- center
- combine
- distance
- buffer
- nearest
- tin

**Planned Features**

Additional feature requests welcomed and encouraged. To request a feature, please add a [github issue](https://github.com/morganherlocker/geo.js/issues) with a description.

- tag
- centroid
- area
- contour
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

Loads a feature collection or geometry from a file.

    var g = require('geo')
    g.load('path/to/file/example.json', function(layer, err){
      if(err) throw err
      console.log(layer)
    })

**point**

Creates a point feature based on an x and a y coordinate. Properties can be added optionally.

    var g = require('geo')
    var point1 = g.point(-75.343, 39.984)
    var point2 = g.point(-75.343, 39.984, {name: 'point 1', population: 5000})
    console.log(point1)
    console.log(point2)

**linestring**

Creates a linestring feature based on a coordinate array. Properties can be added optionally.

    var g = require('geo')
    var linestring1 = g.point([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]])
    var linestring2 = g.point([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]], 
      {name: 'line 1', distance: 145})
    console.log(linestring1)
    console.log(linestring2)

**polygon**

Creates a polygon feature based on a coordinate array. Properties can be added optionally.

    var g = require('geo')
    var polygon1 = g.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]])
    var polygon2 = g.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
      {name: 'line 1', distance: 145})
    console.log(polygon1)
    console.log(polygon2)


**extent**

Calculates the extent of all features and returns a bounding box.

    var g = require('geo')
    g.load('path/to/file/example.json', function(layer, err){
      if(err) throw err
      g.extent(layer, function(extent){
        console.log(extent)
      })
    })

**center**

Calculates the absolute center point of all features.

    var g = require('geo')
    g.load('path/to/file/example.json', function(layer, err){
      if(err) throw err
      g.center(layer, function(center){
        console.log(center)
      })
    })

**combine**

Combines an array of point, linestring, or polygon features into multipoint, multilinestring, or multipolygon features
    
    var g = require('geo')
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

Buffers a point feature to a given radius.

    var g = require('geo')
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

Calculates the distance between two point features.

    var g = require('geo')
    var point1 = { 
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-75.343, 39.984]}
    }
    var point2 = { 
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-75.534, 39.123]}
    }
    g.distance(point1, point2, 'miles', function(err, distance){
      if(err) throw err
      console.log(distance)
    })

**nearest**

Returns the neares point feature.

    var g = require('geo')    
    var inPoint = { 
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-75.4, 39.4]},
      "properties": { 
        "name": "Location A",
        "category": "Store"
      }
    }
    var inFeatures = { 
      "type": "FeatureCollection",
      "features": [
        { "type": "Feature",
          "geometry": {"type": "Point", "coordinates": [-75.343, 39.984]},
          "properties": { 
            "name": "Location A",
            "category": "Store"
          }
        },
        { "type": "Feature",
          "geometry": {"type": "Point", "coordinates": [-75.833, 39.284]},
          "properties": { 
            "name": "Location B",
            "category": "House"
          }
        },
        { "type": "Feature",
          "geometry": {"type": "Point", "coordinates": [ -75.534, 39.123]},
          "properties": { 
            "name": "Location C",
            "category": "Office"
          }
        }
      ]
    }
    g.nearest(inPoint, inFeatures, function(err, outPoint){
      if(err) throw err
      var nearest = { 
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [ -75.33, 39.44]},
        "properties": { 
          "name": "Location C",
          "category": "Office"
        }
      }
    })

**tin**

Takes a set of points and the name of a z-value property and creates a tin (Triangulated Irregular Network). These are often used for developing elevation contour maps or stepped heat visualizations.

    var g = require('geo')
    var z = 'elevation'
    g.load('/path/to/pointsfeatures/Points3.geojson', function(err, points){
      g.tin(points, function(err, z, tin){
        if(err) throw err
        console.log(tin)
      })
    })

- - -

***Development***

**Run Tests**
mocha test/*