# turf-point-on-line

# pointOnLine

Takes a [Point](Point) and a [LineString](LineString) and calculates the closest Point on the LineString.

**Parameters**

-   `line` **Feature&lt;LineString>** line to snap to
-   `point` **Feature&lt;Point>** point to snap from

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
var pt = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-77.037076, 38.884017]
  }
};

var snapped = turf.pointOnLine(line, pt);
snapped.properties['marker-color'] = '#00f'

var result = {
  "type": "FeatureCollection",
  "features": [line, pt, snapped]
};

//=result
```

Returns **Feature&lt;Point>** closest point on the `line` to `point`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-point-on-line
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
