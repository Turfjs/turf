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

**Features**

[load](https://github.com/morganherlocker/turf/edit/master/README.md#load)

[save](https://github.com/morganherlocker/turf/edit/master/README.md#save)

[point](https://github.com/morganherlocker/turf/edit/master/README.md#point)

[linestring](https://github.com/morganherlocker/turf/edit/master/README.md#linestring)

[polygon](https://github.com/morganherlocker/turf/edit/master/README.md#polygon)

[featurecollection](https://github.com/morganherlocker/turf/edit/master/README.md#featurecollection)

[extent](https://github.com/morganherlocker/turf/edit/master/README.md#extent)

[square](https://github.com/morganherlocker/turf/edit/master/README.md#square)

[size](https://github.com/morganherlocker/turf/edit/master/README.md#size)

[center](https://github.com/morganherlocker/turf/edit/master/README.md#center)

[bboxPolygon](https://github.com/morganherlocker/turf/edit/master/README.md#bboxPolygon)

[envelope](https://github.com/morganherlocker/turf/edit/master/README.md#envelope)

[centroid](https://github.com/morganherlocker/turf/edit/master/README.md#centroid)

[explode](https://github.com/morganherlocker/turf/edit/master/README.md#explode)

[combine](https://github.com/morganherlocker/turf/edit/master/README.md#combine)

[remove](https://github.com/morganherlocker/turf/edit/master/README.md#remove)

[filter](https://github.com/morganherlocker/turf/edit/master/README.md#filter)

[distance](https://github.com/morganherlocker/turf/edit/master/README.md#distance)

[buffer](https://github.com/morganherlocker/turf/edit/master/README.md#buffer)

[nearest](https://github.com/morganherlocker/turf/edit/master/README.md#nearest)

[tin](https://github.com/morganherlocker/turf/edit/master/README.md#tin)

[grid](https://github.com/morganherlocker/turf/edit/master/README.md#grid)

[planepoint](https://github.com/morganherlocker/turf/edit/master/README.md#planepoint)

[inside](https://github.com/morganherlocker/turf/edit/master/README.md#inside)

[midpoint](https://github.com/morganherlocker/turf/edit/master/README.md#midpoint)

[quantile](https://github.com/morganherlocker/turf/edit/master/README.md#quantile)

[jenks](https://github.com/morganherlocker/turf/edit/master/README.md#jenks)

[reclass](https://github.com/morganherlocker/turf/edit/master/README.md#reclass)

[contour](https://github.com/morganherlocker/turf/edit/master/README.md#contour)

[sample](https://github.com/morganherlocker/turf/edit/master/README.md#sample)

[tag](https://github.com/morganherlocker/turf/edit/master/README.md#tag)

[bezier](https://github.com/morganherlocker/turf/edit/master/README.md#bezier)

[simplify](https://github.com/morganherlocker/turf/edit/master/README.md#simplify)

[average](https://github.com/morganherlocker/turf/edit/master/README.md#average)

[sum](https://github.com/morganherlocker/turf/edit/master/README.md#sum)

**Planned Features**

Additional feature requests welcomed and encouraged. To request a feature, please add a [github issue](https://github.com/morganherlocker/turf/issues) with a description.

- aggregate
- krige
- interval
- cluster
- interpolate
- area
- intersect
- union
- erase
- smooth

- - -

##Examples:

###load

Loads a Feature or FeaturCollection from a file.

```javascript
var t = require('turf')
geojsonFile = '/path/to/file/tress.geojson'

t.load(geoJsonFile, function(err, trees){
  if(err) throw err
  console.log(trees)
})
```


###save

Saves out a feature or feature collection. 'geojson' and 'topojson' are currently supported.

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


###point

Creates a geojson point Feature based on an x and a y coordinate. Properties can be added optionally.

```javascript
var t = require('turf')

var point1 = t.point(-75.343, 39.984)
var point2 = t.point(-75.343, 39.984, {name: 'point 1', population: 5000})
console.log(point1)
console.log(point2)
```


###linestring

Creates a geojson linestring Feature based on a coordinate array. Properties can be added optionally.

```javascript
var t = require('turf')

var linestring1 = t.linestring([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]])
var linestring2 = t.linestring([[102.0, -10.0], [103.0, 1.0], [104.0, 0.0], [130.0, 4.0]], 
  {name: 'line 1', distance: 145})
console.log(linestring1)
console.log(linestring2)
```


###polygon

Creates a geojson polygon Feature based on a coordinate array. Properties can be added optionally.

```javascript
var t = require('turf')

var polygon1 = t.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]])
var polygon2 = t.point([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]], 
  {name: 'line 1', distance: 145})
console.log(polygon1)
console.log(polygon2)
```


###featurecollection

Creates a geojson FeatureCollection based on an array of features.

```javascript
var t = require('turf')
var pt1 = t.point(-75.343, 39.984, {name: 'Location A'})
var pt2 = t.point(-75.833, 39.284, {name: 'Location B'})
var pt3 = t.point(-75.534, 39.123, {name: 'Location C'})

var fc = t.featurecollection([pt1, pt2, pt3])
console.log(fc)
```


###extent

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


###square

Calculates the minimum square bounding box for another bounding box.

```javascript
var t = require('turf')
var bbox = [0,0,5,10]]

t.square(bbox, function(err, square){
  if(err) throw err
  console.log(square) // [-2.5, 0, 7.5, 10]
})
```


###size

Takes a bbox and returns a new bbox with a size expanded or contracted by a factor of X.

```javascript
var bbox = [0, 0, 10, 10]

t.size(bbox, 2, function(err, doubled){
  if(err) throw err
  console.log(doubled) // [-10, -10, 20, 20]
})
```


###center

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


###bboxPolygon

Takes a bbox and returns the equivalent polygon feature.

```javascript
var t = require('turf')
var bbox = [0,0,10,10]

t.bboxPolygon(bbox, function(err, poly){
  if(err) throw err
  console.log(poly)
})
```


###envelope

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


###centroid

Calculates the centroid of a polygon Feature or FeatureCollection using the geometric mean of all vertices. This lessons the effect of small islands and artifacts when calculating the centroid of a set of polygons.

```javascript
var t = require('turf')
var poly = t.polygon([[[0,0], [0,10], [10,10] , [10,0]]])

t.centroid(poly, function(err, centroid){
  if(err) throw err
  console.log(centroid) // a point at 5, 5
})
```


###explode

Takes a Feature or FeatureCollection and return all vertices as a collection of points.

```javascript
var t = require('turf')
var poly = t.polygon([[[0,0], [0,10], [10,10] , [10,0]]])

t.explode(poly, function(err, vertices){
  if(err) throw err
  console.log(vertices)
})
```


###combine

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


###remove

Removes any features from a feature collection that match a property value.

```javascript
var t = require('turf')
var trees = t.featurecollection([t.point(1,2, {species: 'oak'}), 
                                 t.point(2,1, {species: 'dogwood'}), 
                                 t.point(3,1, {species: 'maple'})])

t.remove(points, 'species', 'dogwood', function(err, result) {
  if(err) throw err
  console.log(result)
})
```


###filter

Keeps any features from a feature collection that match a property value.

```javascript
var t = require('turf')
var trees = t.featurecollection([
  t.point(1,2, {species: 'oak'}),
  t.point(2,1, {species: 'birch'}), 
  t.point(3,1, {species: 'oak'}),
  t.point(2,2, {species: 'redwood'}), 
  t.point(2,3, {species: 'maple'}), 
  t.point(4,2, {species: 'oak'})
  ])

t.filter(trees, 'species', 'oak', function(err, oaks){
  if(err) throw err
  console.log(oaks)
})
```


###inside

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


###buffer

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


###distance

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


###nearest

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


###tin

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


###grid

Takes a bounding box and a cell depth and outputs a feature collection of points in a grid.

```javascript
var t = require('turf')
var depth = 15

t.grid([0,0,10,10], depth, function(err, grid){
  console.log(grid) // 15x15 grid of points in a FeatureCollection
})
```


###planepoint

Takes a trianglular plane and calculates the z value for a point on the plane.

```javascript
var t = require('turf')
var point = t.point(-75.3221, 39.529)
// triangle is a polygon with "a", "b", and "c" values representing
// the values of the coordinates in order.
var triangle = t.polygon(
    [[[-75.1221,39.57],[-75.58,39.18],[-75.97,39.86]]], 
    {"a": 11, "b": 122, "c": 44}
  )

t.planepoint(point, triangle, function(err, zValue){
  if(err) throw err
  console.log(zValue)
})
```


###midpoint

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


###quantile

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


###jenks

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


###reclass

Takes a feature collection, a in field, an out field, and an array of translations and outputs an identical feature collection with the out field property populated.

```javascript
var t = require('turf')
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


###contour

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


###sample

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


###tag

Performs a spatial join on a set of points from a set of polygons.

```javascript
var t = require('turf')

t.load('./testIn/tagPoints.geojson', function(err, points){
  t.load('./testIn/tagPolygons.geojson', function(err, polygons){
    t.tag(points, polygons, 'polyID', 'containingPolyID', function(err, taggedPoints){
      console.log(taggedPoints)
    })
  })
})
```


###bezier

Takes a linestring and outputs a curved version of the line.

```javascript
var t = require('turf')
var resolution = 5000
var intensity = .85
var lineIn = t.linestring([
      [
        -80.08724212646484,
        32.77428536643231
      ],
      [
        -80.03746032714844,
        32.84007757059952
      ],
      [
        -80.01548767089844,
        32.74512501406368
      ],
      [
        -79.95368957519531,
        32.850461360442424
      ]
    ])

t.bezier(lineIn, 5000, .85, function(err, lineOut){
  if(err) throw err
  console.log(lineOut)
})
```


###simplify

Takes a feature collection of polygons or linestrings and returns a simplified version, preserving topology of shared boundaries.

```javascript
var t = require('turf')
var quantization = 50
var minimumArea = 0

t.load('./path/to/complex.geojson', function(err, polys){
  t.simplify(polys, quantization, minimumArea, function(err, simplified){
    if(err) throw err
    console.log(simplified)
  })
})
```


###average

Calculates the average value of a field for points within a set of polygons.

```javascript
var t = require('turf')

var poly1 = t.polygon([[[0,0],[10,0],[10,10], [0,10]]])
var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
var polyFC = t.featurecollection([poly1, poly2])
var pt1 = t.point(5,5, {population: 200})
var pt2 = t.point(1,3, {population: 600})
var pt3 = t.point(14,2, {population: 100})
var pt4 = t.point(13,1, {population: 200})
var pt5 = t.point(19,7, {population: 300})
var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

t.average(polyFC, ptFC, 'population', 'pop_avg', function(err, averaged){
  if(err) throw err

  console.log(averaged.features[0].properties.pop_avg) // 400
  console.log(averaged.features[1].properties.pop_avg) // 200
})
```


###sum

Calculates the sum value of a field for points within a set of polygons.

```javascript
var t = require('turf')

var poly1 = t.polygon([[[0,0],[10,0],[10,10], [0,10]]])
var poly2 = t.polygon([[[10,0],[20,10],[20,20], [20,0]]])
var polyFC = t.featurecollection([poly1, poly2])
var pt1 = t.point(1,1, {population: 500})
var pt2 = t.point(1,3, {population: 400})
var pt3 = t.point(14,2, {population: 600})
var pt4 = t.point(13,1, {population: 500})
var pt5 = t.point(19,7, {population: 200})
var ptFC = t.featurecollection([pt1, pt2, pt3, pt4, pt5])

t.sum(polyFC, ptFC, 'population', 'pop_sum', function(err, averaged){
  if(err) throw err

  console.log(averaged.features[0].properties.pop_sum) // 900
  console.log(averaged.features[1].properties.pop_sum) // 1300
})
```


- - -


This library is built and maintained by [@morganherlocker](https://twitter.com/morganherlocker) :)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/morganherlocker/turf/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

