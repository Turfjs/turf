# turf-union

# union

Takes two [polygons](Polygon) and returns a combined polygon. If the input polygons are not contiguous, this function returns a [MultiPolygon](MultiPolygon) feature.

**Parameters**

-   `poly1` **Feature&lt;Polygon>** input polygon
-   `poly2` **Feature&lt;Polygon>** another input polygon

**Examples**

```javascript
var poly1 = {
  "type": "Feature",
  "properties": {
    "fill": "#0f0"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-82.574787, 35.594087],
      [-82.574787, 35.615581],
      [-82.545261, 35.615581],
      [-82.545261, 35.594087],
      [-82.574787, 35.594087]
    ]]
  }
};
var poly2 = {
  "type": "Feature",
  "properties": {
    "fill": "#00f"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-82.560024, 35.585153],
      [-82.560024, 35.602602],
      [-82.52964, 35.602602],
      [-82.52964, 35.585153],
      [-82.560024, 35.585153]
    ]]
  }
};
var polygons = {
  "type": "FeatureCollection",
  "features": [poly1, poly2]
};

var union = turf.union(poly1, poly2);

//=polygons

//=union
```

Returns **Feature&lt;(Polygon | MultiPolygon)>** a combined [Polygon](Polygon) or [MultiPolygon](MultiPolygon) feature

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-union
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
