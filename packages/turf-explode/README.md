# turf-explode

# explode

Takes a feature or set of features and returns all positions as
[points](Point).

**Parameters**

-   `geojson` **(Feature | FeatureCollection)** input features

**Examples**

```javascript
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [177.434692, -17.77517],
      [177.402076, -17.779093],
      [177.38079, -17.803937],
      [177.40242, -17.826164],
      [177.438468, -17.824857],
      [177.454948, -17.796746],
      [177.434692, -17.77517]
    ]]
  }
};

var points = turf.explode(poly);

//=poly

//=points
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if it encounters an unknown geometry type

Returns **FeatureCollection&lt;point>** points representing the exploded input features

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-explode
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
