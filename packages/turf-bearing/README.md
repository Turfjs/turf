# turf-bearing

# bearing

Takes two [points](Point) and finds the geographic bearing between them.

**Parameters**

-   `start` **Feature&lt;Point>** starting Point
-   `end` **Feature&lt;Point>** ending Point

**Examples**

```javascript
var point1 = {
  "type": "Feature",
  "properties": {
    "marker-color": '#f00'
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var point2 = {
  "type": "Feature",
  "properties": {
    "marker-color": '#0f0'
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.534, 39.123]
  }
};

var points = {
  "type": "FeatureCollection",
  "features": [point1, point2]
};

//=points

var bearing = turf.bearing(point1, point2);

//=bearing
```

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** bearing in decimal degrees

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-bearing
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
