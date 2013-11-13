turf
======
![turf](https://raw.github.com/morganherlocker/turf/master/img/turf.png)

***a node.js library for performing geospatial operations with geojson***

All features are written in a functional manner with no side effects. In nearly all cases, they accept objects created by the point, linestring, polygon, and featurecollection functions, but these are simply for convenience. Any valid geojson Feature of FeatureCollection will do.

```bash
npm install turf
```

Turf can also be run in a browser. To use it, download the [minified file](https://raw.github.com/morganherlocker/turf/master/turf.min.js), and include it in a script tag.

```html
<script src="turf.min.js"></script> 
```

It can also be installed using bower:

```bash
bower install turf
```


- - -

*note: This module is under active development and is in a pre-release form. The first official release is planned mid November 2013.  Most features are pretty stable, but expect some changes periodically up until then.*

- - -

**Features**

- load
- save
- point
- linestring
- polygon
- featurecollection
- extent
- square
- size
- center
- bboxPolygon
- envelope
- centroid
- explode
- combine
- distance
- buffer
- nearest
- tin
- grid
- planepoint
- inside
- midpoint
- quantile
- jenks
- reclass
- contour
- sample

**Planned Features**

Additional feature requests welcomed and encouraged. To request a feature, please add a [github issue](https://github.com/morganherlocker/turf/issues) with a description.

- krige
- interval
- cluster
- bezier
- interpolate
- tag
- area
- filter
- intersect
- union
- erase
- smooth
- simplify

- - -

***Examples:***

**load**

Loads a Feature or FeaturCollection from a file.

```javascript
var t = require('turf')
geojsonFile = '/path/to/file/example.geojson'

t.load(geoJsonFile, function(trees, err){
  if(err) throw err
  console.log(trees)
})
```


**save**

Saves out a feature or feature collection. 'geojson' is currently supported.

```javascript
var path = './testOut/poly.geojson'
var poly = t.polygon([[[0,0], [1,0], [1,1],[0,1]]])
var type = 'geojson'
t.save(path, poly, type, function(err, res){
  if(err) throw err
  console.log(res) // 1
  done()
})
```


**point**

Creates a geojson point Feature based on an x and a y coordinate. Properties can be added optionally.

```javascript
var t = require('turf')

var point1 = t.point(-75.343, 39.984)
var point2 = t.point(-75.343, 39.984, {name: 'point 1', population: 5000})
console.log(point1)
console.log(point2)
```

**linestring**

Creates a geojson linestring Feature based on a coordinate array. Properties can be added optionally.

```javascript
var t = require('turf')

var linestring1 = t.linestring([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]])
var linestring2 = t.linestring([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]], 
  {name: 'line 1', distance: 145})
console.log(linestring1)
console.log(linestring2)
```

**polygon**

Creates a geojson polygon Feature based on a coordinate array. Properties can be added optionally.

```javascript
var t = require('turf')

var polygon1 = t.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]])
var polygon2 = t.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
  {name: 'line 1', distance: 145})
console.log(polygon1)
console.log(polygon2)
```

**featurecollection**

Creates a geojson FeatureCollection based on an array of features.

```javascript
var t = require('turf')
var pt1 = t.point(-75.343, 39.984, {name: 'Location A'})
var pt2 = t.point(-75.833, 39.284, {name: 'Location B'})
var pt3 = t.point(-75.534, 39.123, {name: 'Location C'})

var fc = t.featurecollection([pt1, pt2, pt3])
console.log(fc)
```


**extent**

Calculates the extent of all features and returns a bounding box.

```javascript
var t = require('turf')

t.load('path/to/file/example.geojson', function(err, features){
  if(err) throw err
  t.extent(features, function(extent){
    console.log(extent) // [minX, minY, maxX, maxY]
  })
})
```

**square**

Calculates the minimum square bounding box for another bounding box.

```javascript
var t = require('turf')
var bbox = [0,0,5,10]
t.square(bbox, function(err, square){
  if(err) throw err
  console.log(square) // [-2.5, 0, 7.5, 10]
})
```


**size**

Takes a bbox and returns a new bbox with a size expanded or contracted by a factor of X.

```javascript
var bbox = [0, 0, 10, 10]

t.size(bbox, 2, function(err, doubled){
  if(err) throw err
  console.log(doubled) // [-10, -10, 20, 20]
})
```


**center**

Calculates the absolute center point of all features.

```javascript
var t = require('turf')

t.load('path/to/file/example.geojson', function(layer, err){
  if(err) throw err
  t.center(layer, function(center){
    console.log(center)
  })
})
```


**bboxPolygon**

Takes a bbox and returns the equivalent polygon feature.

```javascript
var t = require('turf')
var bbox = [0,0,10,10]

t.bboxPolygon(bbox, function(err, poly){
  if(err) throw err
  console.log(poly)
})
```


**envelope**

Takes a Feature or FeatureCollection and returns a rectangular polygon feature that encompasses all vertices.

```javascript
var t = require('turf')
var pt1 = t.point(-75.343, 39.984, {name: 'Location A'})
var pt2 = t.point(-75.833, 39.284, {name: 'Location B'})
var pt3 = t.point(-75.534, 39.123, {name: 'Location C'})
var fc = t.featurecollection([pt1, pt2, pt3])

t.envelope(fc, function(err, envelopePoly){
  if(err) throw err
  console.log(envelopePoly)
})
```


**centroid**

Calculates the centroid of a polygon Feature or FeatureCollection using the geometric mean of all vertices. This lessons the effect of small islands and artifacts when calculating the centroid of a set of polygons.

```javascript
var t = require('turf')
var poly = t.polygon([[[0,0], [0,10], [10,10] , [10,0]]])

t.centroid(poly, function(err, centroid){
  if(err) throw err
  console.log(centroid) // a point at 5, 5
})
```


**explode**

Takes a Feature or FeatureCollection and return all vertices as a collection of points.

```javascript
var t = require('turf')
var poly = t.polygon([[[0,0], [0,10], [10,10] , [10,0]]])

t.explode(poly, function(err, vertices){
  if(err) throw err
  console.log(vertices)
})
```

**combine**

Combines feature collection of point, linestring, or polygon features into multipoint, multilinestring, or multipolygon features.
    
```javascript
var t = require('turf')
var pt1 = t.point(50, 1)
var pt2 = t.point(100, 101)
var fc = t.featurecollection([pt1, pt2])

t.combine(fc, function(err, combined){
  if(err) throw err
  console.log(combined)
})
```

**inside**

Checks to see if a point is inside of a polygon. The polygon can be convex or concave.

```javascript
var t = require('turf')
var poly = t.polygon([[[0,0], [50, 50], [0,100], [100,100], [100,0]]])
var pt = t.point(75, 75)

t.inside(pt, poly, function(err, isInside){
  if(err) throw err
  console.log(isInside) // true
})
```

**buffer**

Buffers a point feature to a given radius. Lines and Polygons support coming soon. Unit selection coming soon too (degrees, miles, km).


```javascript
var t = require('turf')
var pt = t.point(0, 0.5)
var unit = 'miles'

t.buffer(pt, 10, unit, function(err, buffered){
  if(err) throw err
  console.log(buffered)
})
```

**distance**

Calculates the distance between two point features in degrees, radians, miles, or kilometers. This uses the haversine formula to account for global curvature.

```javascript
var t = require('turf')
var point1 = t.point(-75.343, 39.984)
var point2 = t.point(-75.534, 39.123)
var unit = 'miles' // or 'kilometers', 'degrees', 'radians'

t.distance(point1, point2, unit, function(err, distance){
  if(err) throw err
  console.log(distance)
})
```

**nearest**

Returns the nearest point feature.

```javascript
var t = require('turf')    
var inPoint = t.point(-75.4, 39.4, {name: 'Location A'})

var pt1 = t.point(-75.343, 39.984, {name: 'Location B'})
var pt2 = t.point(-75.833, 39.284, {name: 'Location C'})
var pt3 = t.point(-75.534, 39.123, {name: 'Location D'})
var inFeatures = t.featurecollection([pt1, pt2, pt3])

t.nearest(inPoint, inFeatures, function(err, closestPoint){
  if(err) throw err
  console.log(closestPoint)
})
```

**tin**

Takes a set of points and the name of a z-value property and creates a tin (Triangulated Irregular Network). These are often used for developing elevation contour maps or stepped heat visualizations.

```javascript
var t = require('turf')
var z = 'elevation'

t.load('/path/to/pointsfeatures/elevationPoints.geojson', function(err, points){
  t.tin(points, z, function(err, tin){
    if(err) throw err
    console.log(tin)
  })
})
```

**grid**

Takes a bounding box and a cell depth and outputs a feature collection of points in a grid.

```javascript
var t = require('turf')
var depth = 15

t.grid([0,0,10,10], depth, function(err, grid){
  console.log(grid) // 15x15 grid of points in a FeatureCollection
})
```

**planepoint**

Takes a trianglular plane and calculates the z value for a point on the plane.

```javascript
var t = require('turf')
var point = t.point(-75.3221, 39.529)
// triangle is a polygon with "a", "b", and "c" values representing
// the values of the coordinates in order.
var triangle = t.polygon(
  [[[-75.1221,39.57],[-75.58,39.18],[-75.97,39.86]]], 
  "properties": {"a": 11, "b": 122, "c": 44}
  )

t.planepoint(point, triangle, function(err, zValue){
  if(err) throw err
  console.log(zValue)
})
```

**midpoint**

Takes two point features and returns the mid point.

```javascript
var t = require('turf')
var pt1 = t.point(0,0)
var pt2 = t.point(10, 0)

t.midpoint(pt1, pt2, function(err, midpoint){
  if(err) throw err
  console.log(midpoint)
})

```


**quantile**

Takes a set of features, a property name, and a set of percentiles and outputs a quantile array. This can be passed as a break array to the contour function.

```javascript
var t = require('turf')
var propertyName = 'elevation'
var percentiles = [10,30,40,60,80,90,99]

t.load('./testIn/Points3.geojson', function(err, pts){
  if(err) throw err
  t.quantile(pts, propertyName, percentiles, function(err, quantiles){
    if(err) throw err
    console.log(quantiles) // [ 12, 25, 29, 52, 76, 99, 143 ]
  })
})
```


**jenks**

Takes a set of features, a property name, and the desired number of breaks and outputs an array of natural breaks. This classification can be used in the contour function or for theming.

```javascript
var t = require('turf')
var propertyName = 'elevation'
var num = 10

t.load('./testIn/Points3.geojson', function(err, pts){
  if(err) throw err
  t.jenks(pts, 'elevation', num, function(err, breaks){
    if(err) throw err
    done() // [ 11, 12, 18, 25, 29, 41, 50, 55, 76, 90, 143 ]
  })
})
```


**reclass**

Takes a feature collection, a in field, an out field, and an array of translations and outputs an identical feature collection with the out field property populated.

```javascript
var inField = 'elevation',
    outField = 'heightIndex',
    // 0 to 20 will map to 1, 20 to 40 will map to 2, etc.
    translations = [[0, 20, 1], [20, 40, 2], [40, 60 , 3], [60, Infinity, 4]]

t.load('./testIn/Points3.geojson', function(err, pts){
  if(err) throw err
  t.reclass(pts, inField, outField, translations, function(err, outPts){
    if(err) throw err
    console.log(outPts)
  })
})
```


**contour**

Takes a FeatureCollection of points with z values and an array of value breaks and generates contour polygons.  This is a great way to visualize interpolated density on a map.  It is often used for elevation maps, weather maps, and isocrones.  The main advantage over a heat map is that contours allow you to see definitive value boundaries, and the polygons can be used to aggregate data.  For example, you could get the 5000 ft elevation contour of a mountain and the 10000 ft elevation contour, then aggregate the number of trees in each to see how elevation affects tree survival.

```javascript
var t = require('turf')
var z = 'elevation'
var resolution = 15
var breaks = [.1, 22, 45, 55, 65, 85,  95, 105, 120, 180]

t.load('../path/to/points.geojson', function(err, points){
  t.contour(points, z, resolution, breaks, function(err, contours){
    if(err) throw err
    console.log(contours)
  })
})
```


**sample**

Takes a feature collection and returns N random features as a feature collection.

```javascript
var t = require('turf')
var num = 10

t.load('./testIn/Points3.geojson', function(err, pts){
  if(err) throw err
  t.sample(pts, num, function(err, outPts){
    if(err) throw err
    console.log(outPts)
  })
})
```

- - -

***Development***

**Run Tests**

```shell
cd test 
mocha .
```

**Build**

```shell
sh build
```

**Want to Contribute?**

Pull requests, feature requests, comments on issues, testing, documentation, or any other type of support is welcome and encouraged. This is a big project, and I appreciate any help I can get. Let's go build a better geospatial engine for the web! Not sure where to start? Shoot me an email at morgan.herlocker [at] gmail.com or [@morganherlocker](https://twitter.com/morganherlocker).

**A few notes before diving in:**

- The focus of the project is on building a core geospatial engine. Vendor specific stuff belongs in a seperate module.
- Geojson is the primary format. Topojson can be used as intermediate format. 
- No pull requests will be accepted that provide only style changes.
- Never add an external dependency unless you absolutely have to. Even then, please ask first, because there may be a work around.
- Do not make calls to web services. 
- Simplicity is the name of the game. Every feature should be a simple file in /lib with a corresponding file in /test. Reference the new module in index.js and you are done.
- Testing is absolutely required 100% of the time. Look at the existing tests for examples.
- This is a functional library. Ensure that your functions never have side effects, and avoid an OO style whenever possible.
- **Always create an issue before starting a new feature. This will allow us to discuss how something is being implemented and integrated. Turned down pull requests are no fun for anyone.**

- - -



This library is built and maintained by [@morganherlocker](https://twitter.com/morganherlocker) :)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/morganherlocker/turf/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

