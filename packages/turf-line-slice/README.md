# turf-line-slice

# lineSlice

Takes a [line](LineString), a start [Point](Point), and a stop point
and returns a subsection of the line in-between those points.
The start & stop points don't need to fall exactly on the line.

This can be useful for extracting only the part of a route between waypoints.

**Parameters**

-   `point1` **Feature&lt;Point>** starting point
-   `point2` **Feature&lt;Point>** stopping point
-   `line` **(Feature&lt;LineString> | LineString)** line to slice

**Examples**

```javascript
var line = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-77.031669, 38.878605],
      [-77.029609, 38.881946],
      [-77.020339, 38.884084],
      [-77.025661, 38.885821],
      [-77.021884, 38.889563],
      [-77.019824, 38.892368]
    ]
  }
};
var start = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-77.029609, 38.881946]
  }
};
var stop = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-77.021884, 38.889563]
  }
};

var sliced = turf.lineSlice(start, stop, line);

//=line

//=sliced
```

Returns **Feature&lt;LineString>** sliced line

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-line-slice
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
