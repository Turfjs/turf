# turf-intersect

# intersect

Takes two [polygons](Polygon) and finds their intersection. If they share a border, returns the border; if they don't intersect, returns undefined.

**Parameters**

-   `poly1` **Feature&lt;Polygon>** the first polygon
-   `poly2` **Feature&lt;Polygon>** the second polygon

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
      [-122.801742, 45.48565],
      [-122.801742, 45.60491],
      [-122.584762, 45.60491],
      [-122.584762, 45.48565],
      [-122.801742, 45.48565]
    ]]
  }
}
var poly2 = {
  "type": "Feature",
  "properties": {
    "fill": "#00f"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-122.520217, 45.535693],
      [-122.64038, 45.553967],
      [-122.720031, 45.526554],
      [-122.669906, 45.507309],
      [-122.723464, 45.446643],
      [-122.532577, 45.408574],
      [-122.487258, 45.477466],
      [-122.520217, 45.535693]
    ]]
  }
}

var polygons = {
  "type": "FeatureCollection",
  "features": [poly1, poly2]
};

var intersection = turf.intersect(poly1, poly2);

//=polygons

//=intersection
```

Returns **(Feature&lt;Polygon> | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) | Feature&lt;MultiLineString>)** if `poly1` and `poly2` overlap, returns a Polygon feature representing the area they overlap; if `poly1` and `poly2` do not overlap, returns `undefined`; if `poly1` and `poly2` share a border, a MultiLineString of the locations where their borders are shared

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-intersect
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
