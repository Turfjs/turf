# turf-point-on-surface

# pointOnSurface

Takes a feature and returns a [Point](Point) guaranteed to be on the surface of the feature.

-   Given a [Polygon](Polygon), the point will be in the area of the polygon
-   Given a [LineString](LineString), the point will be along the string
-   Given a [Point](Point), the point will the same as the input

**Parameters**

-   `fc` **(Feature | FeatureCollection)** any feature or set of features

**Examples**

```javascript
// create a random polygon
var polygon = turf.random('polygon');

//=polygon

var pointOnPolygon = turf.pointOnSurface(polygon);

var resultFeatures = polygon.features.concat(pointOnPolygon);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```

Returns **Feature** a point on the surface of `input`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-point-on-surface
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
