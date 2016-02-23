# turf-point

[![build status](https://secure.travis-ci.org/Turfjs/turf-point.png)](http://travis-ci.org/Turfjs/turf-point)

turf point module


### `turf.point(coordinates, properties)`

Takes coordinates and properties (optional) and returns a new Point feature.


### Parameters

| parameter     | type              | description                                                    |
| ------------- | ----------------- | -------------------------------------------------------------- |
| `coordinates` | Array\.\<Number\> | longitude, latitude position (each in decimal degrees)         |
| `properties`  | Object            | _optional:_ an Object that is used as the Feature's properties |


### Example

```js
var pt1 = turf.point([-75.343, 39.984]);

//=pt1
```


**Returns** `Feature.<Point>`, a Point feature

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-point
```

## Tests

```sh
$ npm test
```


