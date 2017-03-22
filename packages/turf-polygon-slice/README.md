# @turf/polygon-slice

# polygonSlice

Takes a [Polygon](http://geojson.org/geojson-spec.html#polygon) and cuts it with a [Linestring](Linestring). Note the linestring must be a straight line (eg made of only two points).
Properties from the input polygon will be retained on output polygons. Internally uses [polyK](http://polyk.ivank.net/) to perform slice.

**Parameters**

-   `polygon` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** single Polygon Feature
-   `linestring` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** single LineString Feature
-   `debug` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Debug setting (optional, default `false`)

**Examples**

```javascript
var polygon = {
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
        [0, 0]
    ]]
  }
};

var linestring =  {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [5, 15],
        [5, -15]
      ]
    }
  }

var sliced = turf.slice(polygon, linestring);

//=sliced
```

Returns **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** FeatureCollection of Polygons

# convertLinestoPolygon

Merge Linestrings into Polygon - Lines must touch

**Parameters**

-   `line1` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString
-   `line2` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** GeoJSON Polygon

# closestSegment

Finds the closest 2 coordinate segement from two linestrings

**Parameters**

-   `source` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString
-   `target` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** LineString with 2 coordinates

# lineInsidePolygonSegment

Finds the first 2 coordinate segment that is inside the polygon

**Parameters**

-   `linestring` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString
-   `polygon` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** GeoJSON Polygon
-   `reverse` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Reverse linestring coordinates (optional, default `false`)

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** 2 coordinate LineString

# coordinateIndex

Builds a unique index of the GeoJSON coordinates, used to detect if point is a touching line

**Parameters**

-   `geojson` **GeoJSON&lt;any>** GeoJSON Feature/FeatureCollection

**Examples**

```javascript
{
  '130.341796875,-10.40137755454354': true,
  '120.05859375,-13.496472765758952': true,
  '110.21484375,-21.043491216803528': true,
  ...
}
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Pairs of coordinates in a dictionary

# polygonToLineString

Convert Polygon to LineString

**Parameters**

-   `polygon` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** GeoJSON Polygon
-   `position` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Used to get outer & inner coordinate position (optional, default `0`)

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON linestring

# intersects

Find a point that intersects two linestring

**Parameters**

-   `line1` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString - Point must be on this line (Must only have 2 segments)
-   `line2` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** GeoJSON LineString (Must only have 2 segments)

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>** intersecting GeoJSON Point

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
$ npm install @turf/polygon-slice
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
