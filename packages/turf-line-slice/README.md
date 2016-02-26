# turf-line-slice

[![build status](https://secure.travis-ci.org/Turfjs/turf-line-slice.png)](http://travis-ci.org/Turfjs/turf-line-slice)




### `turf.line-slice (Point, Point, Line)`

Slices a LineString at start and stop Points


### Parameters

| parameter | type       | description        |
| --------- | ---------- | ------------------ |
| `Point`   | Point      | to start the slice |
| `Point`   | Point      | to stop the slice  |
| `Line`    | LineString | to slice           |


### Example

```js
var line = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [
        -77.0316696166992,
        38.878605901789236
      ],
      [
        -77.02960968017578,
        38.88194668656296
      ],
      [
        -77.02033996582031,
        38.88408470638821
      ],
      [
        -77.02566146850586,
        38.885821800123196
      ],
      [
        -77.02188491821289,
        38.88956308852534
      ],
      [
        -77.01982498168944,
        38.89236892551996
      ]
    ]
  }
};
var start = turf.point([-77.02033996582031, 38.88408470638821]);
var stop = turf.point([-77.02033996582031, 38.88408470638821]);

var sliced = turf.lineSlice(start, stop, line);
//=sliced
```

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-line-slice
```

## Tests

```sh
$ npm test
```

