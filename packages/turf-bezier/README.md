# turf-bezier

# bezier

Takes a [line](LineString) and returns a curved version
by applying a [Bezier spline](http://en.wikipedia.org/wiki/B%C3%A9zier_spline)
algorithm.

The bezier spline implementation is by [Leszek Rybicki](http://leszek.rybicki.cc/).

**Parameters**

-   `line` **Feature&lt;LineString>** input LineString
-   `resolution` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** time in milliseconds between points (optional, default `10000`)
-   `sharpness` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** a measure of how curvy the path should be between splines (optional, default `0.85`)

**Examples**

```javascript
var line = {
  "type": "Feature",
  "properties": {
    "stroke": "#f00"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-76.091308, 18.427501],
      [-76.695556, 18.729501],
      [-76.552734, 19.40443],
      [-74.61914, 19.134789],
      [-73.652343, 20.07657],
      [-73.157958, 20.210656]
    ]
  }
};

var curved = turf.bezier(line);
curved.properties = { stroke: '#0f0' };

var result = {
  "type": "FeatureCollection",
  "features": [line, curved]
};

//=result
```

Returns **Feature&lt;LineString>** curved line

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-bezier
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
