# @turf/combine

# combine

Combines a [FeatureCollection](http://geojson.org/geojson-spec.html#featurecollection) of [Point](http://geojson.org/geojson-spec.html#point),
[LineString](http://geojson.org/geojson-spec.html#linestring), or [Polygon](http://geojson.org/geojson-spec.html#polygon) features
into [MultiPoint](http://geojson.org/geojson-spec.html#multipoint), [MultiLineString](http://geojson.org/geojson-spec.html#multilinestring), or
[MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon) features.

**Parameters**

-   `fc` **[FeatureCollection](http://geojson.org/geojson-spec.html#featurecollection)&lt;([Point](http://geojson.org/geojson-spec.html#point) \| [LineString](http://geojson.org/geojson-spec.html#linestring) \| [Polygon](http://geojson.org/geojson-spec.html#polygon))>** a FeatureCollection of any type

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

Returns **[FeatureCollection](http://geojson.org/geojson-spec.html#featurecollection)&lt;([MultiPoint](http://geojson.org/geojson-spec.html#multipoint) \| [MultiLineString](http://geojson.org/geojson-spec.html#multilinestring) \| [MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon))>** a FeatureCollection of corresponding type to input

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/combine
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
