# turf-tin

# tin

Takes a set of [points](Point) and the name of a z-value property and
creates a [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
or a TIN for short, returned as a collection of Polygons. These are often used
for developing elevation contour maps or stepped heat visualizations.

This triangulates the points, as well as adds properties called `a`, `b`,
and `c` representing the value of the given `propertyName` at each of
the points that represent the corners of the triangle.

**Parameters**

-   `points` **FeatureCollection&lt;Point>** input points
-   `z` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** name of the property from which to pull z values
    This is optional: if not given, then there will be no extra data added to the derived triangles.

**Examples**

```javascript
// generate some random point data
var points = turf.random('points', 30, {
  bbox: [50, 30, 70, 50]
});
//=points
// add a random property to each point between 0 and 9
for (var i = 0; i < points.features.length; i++) {
  points.features[i].properties.z = ~~(Math.random() * 9);
}
var tin = turf.tin(points, 'z')
for (var i = 0; i < tin.features.length; i++) {
  var properties  = tin.features[i].properties;
  // roughly turn the properties of each
  // triangle into a fill color
  // so we can visualize the result
  properties.fill = '#' + properties.a +
    properties.b + properties.c;
}
//=tin
```

Returns **FeatureCollection&lt;Polygon>** TIN output

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-tin
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
