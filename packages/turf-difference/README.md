# turf-difference

# difference

Finds the difference between two [polygons](Polygon) by clipping the second
polygon from the first.

**Parameters**

-   `poly1` **Feature&lt;Polygon>** input Polygon feaure
-   `poly2` **Feature&lt;Polygon>** Polygon feature to difference from `poly1`

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
      [-46.738586, -23.596711],
      [-46.738586, -23.458207],
      [-46.560058, -23.458207],
      [-46.560058, -23.596711],
      [-46.738586, -23.596711]
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
      [-46.650009, -23.631314],
      [-46.650009, -23.5237],
      [-46.509246, -23.5237],
      [-46.509246, -23.631314],
      [-46.650009, -23.631314]
    ]]
  }
};

var differenced = turf.difference(poly1, poly2);
differenced.properties.fill = '#f00';

var polygons = {
  "type": "FeatureCollection",
  "features": [poly1, poly2]
};

//=polygons

//=differenced
```

Returns **Feature&lt;Polygon>** a Polygon feature showing the area of `poly1` excluding the area of `poly2`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-difference
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
