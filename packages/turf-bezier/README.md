# turf-bezier

[![build status](https://secure.travis-ci.org/Turfjs/turf-bezier.png)](http://travis-ci.org/Turfjs/turf-bezier)

generate a bezier curve from a linestring


### `turf.bezier(line, [resolution=10000], [sharpness=0.85])`

Takes a LineString|line and returns a curved version
by applying a [Bezier spline](http://en.wikipedia.org/wiki/B%C3%A9zier_spline)
algorithm.

The bezier spline implementation is by [Leszek Rybicki](http://leszek.rybicki.cc/).


### Parameters

| parameter            | type                    | description                                                           |
| -------------------- | ----------------------- | --------------------------------------------------------------------- |
| `line`               | Feature\.\<LineString\> | input LineString                                                      |
| `[resolution=10000]` | Number                  | _optional:_ time in milliseconds between points                       |
| `[sharpness=0.85]`   | Number                  | _optional:_ a measure of how curvy the path should be between splines |


### Example

```js
var line = {
  "type": "Feature",
  "properties": {
    "stroke": "#f00"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-76.091308, 18.427501],
      [-76.695556, 18.729501],
      [-76.552734, 19.40443],
      [-74.61914, 19.134789],
      [-73.652343, 20.07657],
      [-73.157958, 20.210656]
    ]
  }
};

var curved = turf.bezier(line);
curved.properties = { stroke: '#0f0' };

var result = {
  "type": "FeatureCollection",
  "features": [line, curved]
};

//=result
```


**Returns** `Feature.<LineString>`, curved line

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-bezier
```

## Tests

```sh
$ npm test
```


