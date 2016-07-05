# turf-kinks

# kinks

Takes a [polygon](Polygon) and returns [points](Point) at all self-intersections.

**Parameters**

-   `polygon` **(Feature&lt;Polygon> | Polygon)** input polygon

**Examples**

```javascript
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-12.034835, 8.901183],
      [-12.060413, 8.899826],
      [-12.03638, 8.873199],
      [-12.059383, 8.871418],
      [-12.034835, 8.901183]
    ]]
  }
};

var kinks = turf.kinks(poly);

var resultFeatures = kinks.intersections.features.concat(poly);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```

Returns **FeatureCollection&lt;Point>** self-intersections

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-kinks
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
