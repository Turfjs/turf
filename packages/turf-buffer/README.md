# turf-buffer

# buffer

Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.

**Parameters**

-   `feature` **(Feature | FeatureCollection)** input to be buffered
-   `distance` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** distance to draw the buffer
-   `unit` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** any of the options supported by turf units

**Examples**

```javascript
var pt = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-90.548630, 14.616599]
  }
};
var unit = 'miles';

var buffered = turf.buffer(pt, 500, unit);
var result = turf.featurecollection([buffered, pt]);

//=result
```

Returns **(FeatureCollection&lt;Polygon> | FeatureCollection&lt;MultiPolygon> | Polygon | MultiPolygon)** buffered features

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-buffer
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
