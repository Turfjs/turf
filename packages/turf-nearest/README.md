# turf-nearest

# nearest

Takes a reference [point](Point) and a FeatureCollection of Features
with Point geometries and returns the
point from the FeatureCollection closest to the reference. This calculation
is geodesic.

**Parameters**

-   `targetPoint` **Feature&lt;Point>** the reference point
-   `points` **FeatureCollection&lt;Point>** against input point set

**Examples**

```javascript
var point = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [28.965797, 41.010086]
  }
};
var against = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [28.973865, 41.011122]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [28.948459, 41.024204]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [28.938674, 41.013324]
      }
    }
  ]
};

var nearest = turf.nearest(point, against);
nearest.properties['marker-color'] = '#f00';

var resultFeatures = against.features.concat(point);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```

Returns **Feature&lt;Point>** the closest point in the set to the reference point

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-nearest
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
