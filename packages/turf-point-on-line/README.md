# turf-point-on-line

[![build status](https://secure.travis-ci.org/Turfjs/turf-point-on-line.png)](http://travis-ci.org/Turfjs/turf-point-on-line)




### `turf.point-on-line (Line, Point)`

Takes a Point and a LineString and calculates the closest Point on the LineString


### Parameters

| parameter | type       | description  |
| --------- | ---------- | ------------ |
| `Line`    | LineString | to snap to   |
| `Point`   | Point      | to snap from |


### Example

```js
var line = turf.linestring([
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
    ]);
var pt = turf.point([-77.02544689178467,38.88689075977245]);

var snapped = turf.pointOnLine(line, pt);
//=snapped
```

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-point-on-line
```

## Tests

```sh
$ npm test
```

