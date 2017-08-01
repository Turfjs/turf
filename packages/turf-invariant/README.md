# @turf/invariant

# getCoord

Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.

**Parameters**

-   `obj` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)> | [Geometry](http://geojson.org/geojson-spec.html#geometry)&lt;[Point](http://geojson.org/geojson-spec.html#point)> | [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>)** Object

**Examples**

```javascript
var pt = turf.point([10, 10]);

var coord = turf.getCoord(pt);
//= [10, 10]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** coordinates

# getCoords

Unwrap coordinates from a Feature, Geometry Object or an Array of numbers

**Parameters**

-   `obj` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)> | [Geometry](http://geojson.org/geojson-spec.html#geometry) \| [Feature](http://geojson.org/geojson-spec.html#feature-objects))** Object

**Examples**

```javascript
var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);

var coord = turf.getCoords(poly);
//= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** coordinates

# containsNumber

Checks if coordinates contains a number

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any>** GeoJSON Coordinates

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if Array contains a number

# geojsonType

Enforce expectations about types of GeoJSON objects for Turf.

**Parameters**

-   `value` **[GeoJSON](http://geojson.org/geojson-spec.html#geojson-objects)** any GeoJSON object
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if value is not the expected type.

# featureOf

Enforce expectations about types of [Feature](http://geojson.org/geojson-spec.html#feature-objects) inputs for Turf.
Internally this uses [geojsonType](#geojsontype) to judge geometry types.

**Parameters**

-   `feature` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)** a feature with an expected geometry type
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** error if value is not the expected type.

# collectionOf

Enforce expectations about types of [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) inputs for Turf.
Internally this uses [geojsonType](#geojsontype) to judge geometry types.

**Parameters**

-   `featureCollection` **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** a FeatureCollection for which features will be judged
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if value is not the expected type.

# getGeom

Get Geometry from Feature or Geometry Object

**Parameters**

-   `geojson` **([Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** GeoJSON Feature or Geometry Object

**Examples**

```javascript
var point = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [110, 40]
  }
}
var geom = turf.getGeom(point)
//={"type": "Point", "coordinates": [110, 40]}
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if geojson is not a Feature or Geometry Object

Returns **([Geometry](http://geojson.org/geojson-spec.html#geometry) | null)** GeoJSON Geometry Object

# getGeomType

Get Geometry Type from Feature or Geometry Object

**Parameters**

-   `geojson` **([Feature](http://geojson.org/geojson-spec.html#feature-objects) \| [Geometry](http://geojson.org/geojson-spec.html#geometry))** GeoJSON Feature or Geometry Object

**Examples**

```javascript
var point = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [110, 40]
  }
}
var geom = turf.getGeom(point)
//="Point"
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if geojson is not a Feature or Geometry Object

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** GeoJSON Geometry Type

<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source file (likely index.js), and re-run
./scripts/generate-readmes in the turf project. -->

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/invariant
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
