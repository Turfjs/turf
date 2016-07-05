# turf-tag

# tag

Takes a set of [points](Point) and a set of [polygons](Polygon) and performs a spatial join.

**Parameters**

-   `points` **FeatureCollection&lt;Point>** input points
-   `polygons` **FeatureCollection&lt;Polygon>** input polygons
-   `field` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** property in `polygons` to add to joined Point features
-   `outField` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** property in `points` in which to store joined property from \`polygons

**Examples**

```javascript
var bbox = [0, 0, 10, 10];
// create a triangular grid of polygons
var triangleGrid = turf.triangleGrid(bbox, 50, 'miles');
triangleGrid.features.forEach(function(f) {
  f.properties.fill = '#' +
    (~~(Math.random() * 16)).toString(16) +
    (~~(Math.random() * 16)).toString(16) +
    (~~(Math.random() * 16)).toString(16);
  f.properties.stroke = 0;
  f.properties['fill-opacity'] = 1;
});
var randomPoints = turf.random('point', 30, {
  bbox: bbox
});
var both = turf.featurecollection(
  triangleGrid.features.concat(randomPoints.features));

//=both

var tagged = turf.tag(randomPoints, triangleGrid,
                      'fill', 'marker-color');

//=tagged
```

Returns **FeatureCollection&lt;Point>** points with `containingPolyId` property containing values from `polyId`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-tag
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
