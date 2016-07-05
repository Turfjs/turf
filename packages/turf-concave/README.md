# turf-concave

# concave

Takes a set of [points](Point) and returns a concave hull polygon.

Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.

**Parameters**

-   `points` **FeatureCollection&lt;Point>** input points
-   `maxEdge` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** the size of an edge necessary for part of the
    hull to become concave (in miles)
-   `units` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** used for maxEdge distance (miles or kilometers)

**Examples**

```javascript
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-63.601226, 44.642643]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-63.591442, 44.651436]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-63.580799, 44.648749]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-63.573589, 44.641788]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-63.587665, 44.64533]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-63.595218, 44.64765]
      }
    }
  ]
};

var hull = turf.concave(points, 1, 'miles');

var resultFeatures = points.features.concat(hull);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if maxEdge parameter is missing
-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if units parameter is missing

Returns **Feature&lt;Polygon>** a concave hull

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-concave
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
