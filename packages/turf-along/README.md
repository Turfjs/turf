# turf-along

# along

Takes a [line](LineString) and returns a [point](Point) at a specified distance along the line.

**Parameters**

-   `line` **Feature&lt;LineString>** input line
-   `distance` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** distance along the line
-   `units` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** can be degrees, radians, miles, or kilometers (optional, default `miles`)

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

var along = turf.along(line, 1, 'miles');

var result = {
  "type": "FeatureCollection",
  "features": [line, along]
};

//=result
```

Returns **Feature&lt;Point>** Point `distance` `units` along the line

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-along
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
