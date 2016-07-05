# turf-convex

# convex

Takes a set of [points](Point) and returns a
[convex hull](http://en.wikipedia.org/wiki/Convex_hull) polygon.

Internally this uses
the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that
implements a [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).

**Parameters**

-   `featurecollection` **FeatureCollection&lt;Point>** input points

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
        "coordinates": [10.195312, 43.755225]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.404052, 43.8424511]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.579833, 43.659924]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.360107, 43.516688]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.14038, 43.588348]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.195312, 43.755225]
      }
    }
  ]
};

var hull = turf.convex(points);

var resultFeatures = points.features.concat(hull);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```

Returns **Feature&lt;Polygon>** a convex hull

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-convex
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
