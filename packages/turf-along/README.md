# turf-along

[![build status](https://secure.travis-ci.org/Turfjs/turf-along.png)](http://travis-ci.org/Turfjs/turf-along)




### `turf.along(line, distance, [units=miles])`

Takes a LineString|line and returns a Point|point at a specified distance along the line.


### Parameters

| parameter       | type                    | description                                               |
| --------------- | ----------------------- | --------------------------------------------------------- |
| `line`          | Feature\.\<LineString\> | input line                                                |
| `distance`      | Number                  | distance along the line                                   |
| `[units=miles]` | String                  | _optional:_ can be degrees, radians, miles, or kilometers |


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

var along = turf.along(line, 1, 'miles');

var result = {
  "type": "FeatureCollection",
  "features": [line, along]
};

//=result
```


**Returns** `Feature.<Point>`, Point `distance` `units` along the line

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-along
```

## Tests

```sh
$ npm test
```


