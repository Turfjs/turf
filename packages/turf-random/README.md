# turf-random

# random

Generates random [GeoJSON](GeoJSON) data, including [Points](Point) and [Polygons](Polygon), for testing
and experimentation.

**Parameters**

-   `type` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** type of features desired: 'points' or 'polygons' (optional, default `'point'`)
-   `count` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** how many geometries should be generated. (optional, default `1`)
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** options relevant to the feature desired. Can include:
    -   `options.bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** a bounding box inside of which geometries
        are placed. In the case of [Point](Point) features, they are guaranteed to be within this bounds,
        while [Polygon](Polygon) features have their centroid within the bounds.
    -   `options.num_vertices` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** options.vertices the number of vertices added
        to polygon features. (optional, default `10`)
    -   `options.max_radial_length` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** the total number of decimal
        degrees longitude or latitude that a polygon can extent outwards to
        from its center. (optional, default `10`)

**Examples**

```javascript
var points = turf.random('points', 100, {
  bbox: [-70, 40, -60, 60]
});

//=points

var polygons = turf.random('polygons', 4, {
  bbox: [-70, 40, -60, 60]
});

//=polygons
```

Returns **FeatureCollection** generated random features

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-random
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
