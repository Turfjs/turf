# turf-collect

# collect

Joins attributes FeatureCollection of polygons with a FeatureCollection of
points. Given an `inProperty` on points and an `outProperty` for polygons,
this finds every point that lies within each polygon, collects the `inProperty`
values from those points, and adds them as an array to `outProperty` on the
polygon.

**Parameters**

-   `polygons` **FeatureCollection&lt;Polygon>** polygons with values on which to aggregate
-   `points` **FeatureCollection&lt;Point>** points to be aggregated
-   `inProperty` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** property to be nested from
-   `outProperty` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** property to be nested into

**Examples**

```javascript
var poly1 = polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
var poly2 = polygon([[[10,0],[20,10],[20,20],[20,0],[10,0]]]);
var polyFC = featurecollection([poly1, poly2]);
var pt1 = point([5,5], {population: 200});
var pt2 = point([1,3], {population: 600});
var pt3 = point([14,2], {population: 100});
var pt4 = point([13,1], {population: 200});
var pt5 = point([19,7], {population: 300});
var ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5]);
var aggregated = aggregate(polyFC, ptFC, 'population', 'values');

aggregated.features[0].properties.values // => [200, 600]);
```

Returns **FeatureCollection&lt;Polygon>** polygons with properties listed based on `outField`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-collect
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
