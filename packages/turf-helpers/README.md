# @turf/helpers

# feature

Wraps a GeoJSON [Geometry](http://geojson.org/geojson-spec.html#geometry) in a GeoJSON [Feature](http://geojson.org/geojson-spec.html#feature-objects).

**Parameters**

-   `geometry` **[Geometry](http://geojson.org/geojson-spec.html#geometry)** input geometry
-   `properties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** properties

**Examples**

```javascript
var geometry = {
     "type": "Point",
     "coordinates": [
       67.5,
       32.84267363195431
     ]
   }

var feature = turf.feature(geometry);

//=feature
```

Returns **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** a FeatureCollection of input features

# point

Takes coordinates and properties (optional) and returns a new [Point](http://geojson.org/geojson-spec.html#point) feature.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** longitude, latitude position (each in decimal degrees)
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object that is used as the [Feature](http://geojson.org/geojson-spec.html#feature-objects)'s
    properties

**Examples**

```javascript
var pt1 = turf.point([-75.343, 39.984]);

//=pt1
```

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>** a Point feature

# polygon

Takes an array of LinearRings and optionally an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) with properties and returns a [Polygon](http://geojson.org/geojson-spec.html#polygon) feature.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>** an array of LinearRings
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a properties object

**Examples**

```javascript
var polygon = turf.polygon([[
 [-2.275543, 53.464547],
 [-2.275543, 53.489271],
 [-2.215118, 53.489271],
 [-2.215118, 53.464547],
 [-2.275543, 53.464547]
]], { name: 'poly1', population: 400});

//=polygon
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** throw an error if a LinearRing of the polygon has too few positions
    or if a LinearRing of the Polygon does not have matching Positions at the
    beginning & end.

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** a Polygon feature

# lineString

Creates a [LineString](http://geojson.org/geojson-spec.html#linestring) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** an array of Positions
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var linestring1 = turf.lineString([
  [-21.964416, 64.148203],
  [-21.956176, 64.141316],
  [-21.93901, 64.135924],
  [-21.927337, 64.136673]
]);
var linestring2 = turf.lineString([
  [-21.929054, 64.127985],
  [-21.912918, 64.134726],
  [-21.916007, 64.141016],
  [-21.930084, 64.14446]
], {name: 'line 1', distance: 145});

//=linestring1

//=linestring2
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** a LineString feature

# featureCollection

Takes one or more [Features](http://geojson.org/geojson-spec.html#feature-objects) and creates a [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects).

**Parameters**

-   `features` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Feature](http://geojson.org/geojson-spec.html#feature-objects)>** input features

**Examples**

```javascript
var features = [
 turf.point([-75.343, 39.984], {name: 'Location A'}),
 turf.point([-75.833, 39.284], {name: 'Location B'}),
 turf.point([-75.534, 39.123], {name: 'Location C'})
];

var fc = turf.featureCollection(features);

//=fc
```

Returns **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** a FeatureCollection of input features

# multiLineString

Creates a [Feature&lt;MultiLineString>](Feature<MultiLineString>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>** an array of LineStrings
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var multiLine = turf.multiLineString([[[0,0],[10,10]]]);

//=multiLine
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[MultiLineString](http://geojson.org/geojson-spec.html#multilinestring)>** a MultiLineString feature

# multiPoint

Creates a [Feature&lt;MultiPoint>](Feature<MultiPoint>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** an array of Positions
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var multiPt = turf.multiPoint([[0,0],[10,10]]);

//=multiPt
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[MultiPoint](http://geojson.org/geojson-spec.html#multipoint)>** a MultiPoint feature

# multiPolygon

Creates a [Feature&lt;MultiPolygon>](Feature<MultiPolygon>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>>** an array of Polygons
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);

//=multiPoly
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon)>** a multipolygon feature

# geometryCollection

Creates a [Feature&lt;GeometryCollection>](Feature<GeometryCollection>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `geometries` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;{Geometry}>** an array of GeoJSON Geometries
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var pt = {
    "type": "Point",
      "coordinates": [100, 0]
    };
var line = {
    "type": "LineString",
    "coordinates": [ [101, 0], [102, 1] ]
  };
var collection = turf.geometryCollection([pt, line]);

//=collection
```

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[GeometryCollection](http://geojson.org/geojson-spec.html#geometrycollection)>** a GeoJSON GeometryCollection Feature

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
$ npm install @turf/helpers
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
