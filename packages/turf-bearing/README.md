# turf-bearing

[![build status](https://secure.travis-ci.org/Turfjs/turf-bearing.png)](http://travis-ci.org/Turfjs/turf-bearing)

turf bearing module


### `turf.bearing(start, end)`

Takes two Point|points and finds the geographic bearing between them.


### Parameters

| parameter | type               | description    |
| --------- | ------------------ | -------------- |
| `start`   | Feature\.\<Point\> | starting Point |
| `end`     | Feature\.\<Point\> | ending Point   |


### Example

```js
var point1 = {
  "type": "Feature",
  "properties": {
    "marker-color": '#f00'
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var point2 = {
  "type": "Feature",
  "properties": {
    "marker-color": '#0f0'
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.534, 39.123]
  }
};

var points = {
  "type": "FeatureCollection",
  "features": [point1, point2]
};

//=points

var bearing = turf.bearing(point1, point2);

//=bearing
```


**Returns** `Number`, bearing in decimal degrees

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-bearing
```

## Tests

```sh
$ npm test
```


