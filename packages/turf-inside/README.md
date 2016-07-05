# turf-inside

# inside

Takes a [Point](Point) and a [Polygon](Polygon) or [MultiPolygon](MultiPolygon) and determines if the point resides inside the polygon. The polygon can
be convex or concave. The function accounts for holes.

**Parameters**

-   `point` **Feature&lt;Point>** input point
-   `polygon` **Feature&lt;(Polygon | MultiPolygon)>** input polygon or multipolygon

**Examples**

```javascript
var pt1 = {
  "type": "Feature",
  "properties": {
    "marker-color": "#f00"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-111.467285, 40.75766]
  }
};
var pt2 = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-111.873779, 40.647303]
  }
};
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-112.074279, 40.52215],
      [-112.074279, 40.853293],
      [-111.610107, 40.853293],
      [-111.610107, 40.52215],
      [-112.074279, 40.52215]
    ]]
  }
};

var features = {
  "type": "FeatureCollection",
  "features": [pt1, pt2, poly]
};

//=features

var isInside1 = turf.inside(pt1, poly);
//=isInside1

var isInside2 = turf.inside(pt2, poly);
//=isInside2
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-inside
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
