# turf-midpoint

# midpoint

Takes two [points](Point) and returns a point midway between them.
The midpoint is calculated geodesically, meaning the curvature of the earth is taken into account.

**Parameters**

-   `from` **Feature&lt;Point>** first point
-   `to` **Feature&lt;Point>** second point

**Examples**

```javascript
var pt1 = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [144.834823, -37.771257]
  }
};
var pt2 = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [145.14244, -37.830937]
  }
};

var midpointed = turf.midpoint(pt1, pt2);
midpointed.properties['marker-color'] = '#f00';


var result = {
  "type": "FeatureCollection",
  "features": [pt1, pt2, midpointed]
};

//=result
```

Returns **Feature&lt;Point>** a point midway between `pt1` and `pt2`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-midpoint
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
