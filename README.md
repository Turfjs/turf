geo.js
======

a node.js library for performing geospatial operations with geojson

    npm install geo.js

- - -

**Features**

- load
- point
- linestring
- polygon
- featurecollection
- extent
- center
- combine
- distance
- buffer
- nearest
- tin
- grid
- planepoint
- inside
- contour

**Planned Features**

Additional feature requests welcomed and encouraged. To request a feature, please add a [github issue](https://github.com/morganherlocker/geo.js/issues) with a description.

- tag
- centroid
- area
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

```javascript
var g = require('geo.js')
g.load('path/to/file/example.geojson', function(layer, err){
  if(err) throw err
  console.log(layer)
})
```

**point**

Creates a point feature based on an x and a y coordinate. Properties can be added optionally.

```javascript
var g = require('geo.js')
var point1 = g.point(-75.343, 39.984)
var point2 = g.point(-75.343, 39.984, {name: 'point 1', population: 5000})
console.log(point1)
console.log(point2)
```

**linestring**

Creates a linestring feature based on a coordinate array. Properties can be added optionally.

```javascript
var g = require('geo.js')
var linestring1 = g.linestring([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]])
var linestring2 = g.linestring([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]], 
  {name: 'line 1', distance: 145})
console.log(linestring1)
console.log(linestring2)
```

**polygon**

Creates a polygon feature based on a coordinate array. Properties can be added optionally.

```javascript
var g = require('geo.js')
var polygon1 = g.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]])
var polygon2 = g.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
  {name: 'line 1', distance: 145})
console.log(polygon1)
console.log(polygon2)
```


**extent**

Calculates the extent of all features and returns a bounding box.

```javascript
var g = require('geo.js')
g.load('path/to/file/example.geojson', function(err, features){
  if(err) throw err
  g.extent(features, function(extent){
    console.log(extent)
  })
})
```

**center**

Calculates the absolute center point of all features.

```javascript
var g = require('geo.js')
g.load('path/to/file/example.json', function(layer, err){
  if(err) throw err
  g.center(layer, function(center){
    console.log(center)
  })
})
```

**combine**

Combines an array of point, linestring, or polygon features into multipoint, multilinestring, or multipolygon features
    
```javascript
var g = require('geo.js')
var pt1 = g.point(50, 1)
var pt2 = g.point(100, 101)
g.combine([pt1, pt2], function(err, combined){
  if(err) throw err
  console.log(combined)
})
```

**inside**

Checks to see if a point is inside of a polygon. The polygon can be convex or concave.

```javascript
var poly = g.polygon([[[0,0], [50, 50], [0,100], [100,100], [100,0]]])
var pt = g.point(75, 75)
g.inside(pt, poly, function(err, isInside){
  if(err) throw err
  console.log(isInside) // true
})
```

**buffer**

Buffers a point feature to a given radius. Lines and Polygons support coming soon.


```javascript
var g = require('geo.js')
var pt = g.point(0, 0.5)
g.buffer(pt, 10, function(err, buffered){
  if(err) throw err
  console.log(buffered)
})
```

**distance**

Calculates the distance between two point features.

```javascript
var g = require('geo.js')
var point1 = g.point(-75.343, 39.984)
var point2 = g.point(-75.534, 39.123)
g.distance(point1, point2, 'miles', function(err, distance){
  if(err) throw err
  console.log(distance)
})
```

**nearest**

Returns the neares point feature.

```javascript
var g = require('geo.js')    
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
```

**tin**

Takes a set of points and the name of a z-value property and creates a tin (Triangulated Irregular Network). These are often used for developing elevation contour maps or stepped heat visualizations.

```javascript
var g = require('geo.js')
var z = 'elevation'
g.load('/path/to/pointsfeatures/Points3.geojson', function(err, points){
  g.tin(points, function(err, z, tin){
    if(err) throw err
    console.log(tin)
  })
})
```

**grid**

Takes a bounding box and a cell depth and outputs a feature collection of points in a grid.

```javascript
var g = require('geo.js')
g.grid([0,0,10,10], 5, function(err, grid){
  console.log(grid)
})
```

**planepoint**

Takes a trianglular plane and calculates the z value for a point on the plane.

```javascript
var g = require('geo.js')
var point = g.point(-75.3221, 39.529)
// triangle is a polygon with "a", "b", and "c" values representing the values of the coordinates in order.
var triangle = {
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-75.1221,39.57],[-75.58,39.18],[-75.97,39.86]]]
  },
  "properties": {
    "a": 11,
    "b": 122,
    "c": 44
  }
}
g.planepoint(point, triangle, function(err, zValue){
  if(err) throw err
  console.log(zValue)
})
```

**contour**

Takes a set of points with z values and generates contour polygons.

![Points](/img/points.tiff "Points")
![Contours](/img/contours.tiff "Contours")

- - -

***Development***

**Run Tests**

```shell
cd test 
mocha .
```

- - -

***Credits***

This library is built and maintained by @morganherlocker. If you would like to contribute, please do! :)

I have taken a "picasso" approach to building this library, borrowing from existing code when available and modifying it to meet coding styles and standards of geo.js. Here is a list of places I have pulled ideas and/or code from (all open source or public domain, as far as I know):

https://github.com/ironwallaby/delaunay

https://github.com/jasondavies/conrec.js

http://stackoverflow.com/a/839931/461015

http://en.wikipedia.org/wiki/Haversine_formula

http://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm 

https://github.com/mbloch/mapshaper

http://en.wikipedia.org/wiki/Delaunay_triangulation

http://svn.osgeo.org/grass/grass/branches/releasebranch_6_4/vector/v.overlay/main.c

http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule

https://github.com/substack/point-in-polygon/blob/master/index.js


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/morganherlocker/geo.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

