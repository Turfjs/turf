# turf-point-grid

# pointGrid

Takes a bounding box and a cell depth and returns a set of [points](Point) in a grid.

**Parameters**

-   `bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** extent in [minX, minY, maxX, maxY] order
-   `cellSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** the distance across each cell
-   `units` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** used in calculating cellWidth, can be degrees, radians, miles, or kilometers (optional, default `kilometers`)

**Examples**

```javascript
var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
var cellWidth = 3;
var units = 'miles';

var grid = turf.pointGrid(extent, cellWidth, units);

//=grid
```

Returns **FeatureCollection&lt;Point>** grid of points

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-point-grid
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
