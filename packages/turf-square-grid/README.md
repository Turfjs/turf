# turf-square-grid

[![build status](https://secure.travis-ci.org/Turfjs/turf-square-grid.png)](http://travis-ci.org/Turfjs/turf-square-grid)




### `turf.square-grid(extent, cellWidth, units)`

Takes a bounding box and a cell depth and returns a FeatureCollection of Polygon features in a grid.


### Parameters

| parameter   | type           | description                              |
| ----------- | -------------- | ---------------------------------------- |
| `extent`    | Array.<number> | extent in [minX, minY, maxX, maxY] order |
| `cellWidth` | Number         | width of each cell                       |
| `units`     | String         | units to use for cellWidth               |


### Example

```js
var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
var cellWidth = 10;
var units = 'miles';

var squareGrid = turf.squareGrid(extent, cellWidth, units);

//=squareGrid
```

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-square-grid
```

## Tests

```sh
$ npm test
```

