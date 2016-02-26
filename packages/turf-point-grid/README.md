# turf-point-grid

[![build status](https://secure.travis-ci.org/Turfjs/turf-point-grid.png)](http://travis-ci.org/Turfjs/turf-point-grid)




### `turf.point-grid(extent, cellWidth, units)`

Takes a bounding box and a cell depth and returns a set of Point|points in a grid.


### Parameters

| parameter   | type              | description                                             |
| ----------- | ----------------- | ------------------------------------------------------- |
| `extent`    | Array\.\<number\> | extent in [minX, minY, maxX, maxY] order                |
| `cellWidth` | Number            | the distance across each cell                           |
| `units`     | String            | used in calculating cellWidth ('miles' or 'kilometers') |


### Example

```js
var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
var cellWidth = 3;
var units = 'miles';

var grid = turf.pointGrid(extent, cellWidth, units);

//=grid
```


**Returns** `FeatureCollection.<Point>`, grid of points

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-point-grid
```

## Tests

```sh
$ npm test
```


