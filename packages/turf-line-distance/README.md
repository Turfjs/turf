# turf-line-distance

# lineDistance

Takes a [line](LineString) and measures its length in the specified units.

**Parameters**

-   `line` **Feature&lt;LineString>** line to measure
-   `units` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** can be degrees, radians, miles, or kilometers (optional, default `kilometers`)

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

var length = turf.lineDistance(line, 'miles');

//=line

//=length
```

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** length of the input line

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-line-distance
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
