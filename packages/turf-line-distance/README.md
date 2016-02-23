# turf-line-distance

[![build status](https://secure.travis-ci.org/Turfjs/turf-line-distance.png)](http://travis-ci.org/Turfjs/turf-line-distance)

turf-line-distance ---


### `turf.line-distance(line, units)`

Takes a LineString|line and measures its length in the specified units.


### Parameters

| parameter | type                    | description                                   |
| --------- | ----------------------- | --------------------------------------------- |
| `line`    | Feature\.\<LineString\> | line to measure                               |
| `units`   | String                  | can be degrees, radians, miles, or kilometers |


### Example

```js
var line = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-77.031669, 38.878605],
      [-77.029609, 38.881946],
      [-77.020339, 38.884084],
      [-77.025661, 38.885821],
      [-77.021884, 38.889563],
      [-77.019824, 38.892368]
    ]
  }
};

var length = turf.lineDistance(line, 'miles');

//=line

//=length
```


**Returns** `Number`, length of the input line

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-line-distance
```

## Tests

```sh
$ npm test
```


