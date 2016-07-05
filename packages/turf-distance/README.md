# turf-distance

# distance

Calculates the distance between two [points](Point) in degrees, radians,
miles, or kilometers. This uses the
[Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)
to account for global curvature.

**Parameters**

-   `from` **Feature&lt;Point>** origin point
-   `to` **Feature&lt;Point>** destination point
-   `units` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** can be degrees, radians, miles, or kilometers (optional, default `kilometers`)

**Examples**

```javascript
var from = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var to = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-75.534, 39.123]
  }
};
var units = "miles";

var points = {
  "type": "FeatureCollection",
  "features": [from, to]
};

//=points

var distance = turf.distance(from, to, units);

//=distance
```

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** distance between the two points

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-distance
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
