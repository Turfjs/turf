# turf-combine

# combine

Combines a [FeatureCollection](FeatureCollection) of [Point](Point),
[LineString](LineString), or [Polygon](Polygon) features
into [MultiPoint](MultiPoint), [MultiLineString](MultiLineString), or
[MultiPolygon](MultiPolygon) features.

**Parameters**

-   `fc` **FeatureCollection&lt;(Point | LineString | Polygon)>** a FeatureCollection of any type

**Examples**

```javascript
var fc = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [19.026432, 47.49134]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [19.074497, 47.509548]
      }
    }
  ]
};

var combined = turf.combine(fc);

//=combined
```

Returns **FeatureCollection&lt;(MultiPoint | MultiLineString | MultiPolygon)>** a FeatureCollection of corresponding type to input

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-combine
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
