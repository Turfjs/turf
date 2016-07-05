# turf-isolines

# isolines

Takes [points](Point) with z-values and an array of
value breaks and generates [isolines](http://en.wikipedia.org/wiki/Isoline).

**Parameters**

-   `points` **FeatureCollection&lt;Point>** input points
-   `z` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the property name in `points` from which z-values will be pulled
-   `resolution` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** resolution of the underlying grid
-   `breaks` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** where to draw contours

**Examples**

```javascript
// create random points with random
// z-values in their properties
var points = turf.random('point', 100, {
  bbox: [0, 30, 20, 50]
});
for (var i = 0; i < points.features.length; i++) {
  points.features[i].properties.z = Math.random() * 10;
}
var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var isolined = turf.isolines(points, 'z', 15, breaks);
//=isolined
```

Returns **FeatureCollection&lt;LineString>** isolines

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-isolines
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
