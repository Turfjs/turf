# turf-isobands

[![build status](https://secure.travis-ci.org/Turfjs/turf-isobands.png)](http://travis-ci.org/Turfjs/turf-isobands)

turf isobands module


### `turf.isobands(points, z, breaks)`

Takes a `pointGrid` FeatureCollection of points with z values and an array of
value breaks and generates filled contour isobands. These are commonly
used to create elevation maps, but can be used for general data
interpolation as well.


### Parameters

| parameter    | type              | description                                          |
| ------------ | ----------------- | ---------------------------------------------------- |
| `points`     | FeatureCollection | - grid of points                                     |
| `z`          | string            | - a property name from which z values will be pulled |
| `breaks`     | Array.<number>    | - where to draw contours                             |


### Example

```js
// create a grid of points with random z-values in their properties
var bbox = [-70.823, -33.553, -69.823, -32.553];
var cellWidth = 5;
var pointGrid = turf.pointGrid(bbox, cellWidth);
for (var i = 0; i < pointGrid.features.length; i++) {
    pointGrid.features[i].properties.elevation = Math.random() * 10;
}
var breaks = [0, 2.8, 5, 8.5];
var isolined = turf.isobands(pointGrid, 'z', breaks);
//=isolined

```


**Returns** `FeatureCollection`, isolines (`MultiPolygons`)

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-isobands
```

## Tests

```sh
$ npm test
```

