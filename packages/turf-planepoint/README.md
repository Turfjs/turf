# turf-planepoint

# planepoint

Takes a triangular plane as a [Polygon](Polygon)
and a [Point](Point) within that triangle and returns the z-value
at that point. The Polygon needs to have properties `a`, `b`, and `c`
that define the values at its three corners.

**Parameters**

-   `point` **Feature&lt;Point>** the Point for which a z-value will be calculated
-   `triangle` **Feature&lt;Polygon>** a Polygon feature with three vertices

**Examples**

```javascript
var point = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-75.3221, 39.529]
  }
};
var point = turf.point([-75.3221, 39.529]);
// triangle is a polygon with "a", "b",
// and "c" values representing
// the values of the coordinates in order.
var triangle = {
  "type": "Feature",
  "properties": {
    "a": 11,
    "b": 122,
    "c": 44
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-75.1221, 39.57],
      [-75.58, 39.18],
      [-75.97, 39.86],
      [-75.1221, 39.57]
    ]]
  }
};

var features = {
  "type": "FeatureCollection",
  "features": [triangle, point]
};

var zValue = turf.planepoint(point, triangle);

//=features

//=zValue
```

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** the z-value for `interpolatedPoint`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-planepoint
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
