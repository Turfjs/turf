# turf-hex-grid

# hexGrid

Takes a bounding box and a cell size in degrees and returns a [FeatureCollection](FeatureCollection) of flat-topped
hexagons ([Polygon](Polygon) features) aligned in an "odd-q" vertical grid as
described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).

**Parameters**

-   `bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** bounding box in [minX, minY, maxX, maxY] order
-   `cellSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** dimension of cell in specified units
-   `units` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** used in calculating cellWidth ('miles' or 'kilometers')
-   `triangles` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether to return as triangles instead of hexagons

**Examples**

```javascript
var bbox = [-96,31,-84,40];
var cellWidth = 50;
var units = 'miles';

var hexgrid = turf.hexGrid(bbox, cellWidth, units);

//=hexgrid
```

Returns **FeatureCollection&lt;Polygon>** a hexagonal grid

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-hex-grid
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
