# turf-triangle-grid

# triangleGrid

Takes a bounding box and a cell depth and returns a set of triangular [polygons](Polygon) in a grid.

**Parameters**

-   `bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** extent in [minX, minY, maxX, maxY] order
-   `cellSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** dimension of each cell
-   `units` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** units to use for cellWidth

**Examples**

```javascript
var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
var cellWidth = 10;
var units = 'miles';

var triangleGrid = turf.triangleGrid(extent, cellWidth, units);

//=triangleGrid
```

Returns **FeatureCollection&lt;Polygon>** grid of polygons

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-triangle-grid
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
