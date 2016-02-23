# turf-midpoint

[![build status](https://secure.travis-ci.org/Turfjs/turf-midpoint.png)](http://travis-ci.org/Turfjs/turf-midpoint)

turf midpoint module


### `turf.midpoint(pt1, pt2)`

Takes two Point|points and returns a point midway between them.


### Parameters

| parameter | type               | description  |
| --------- | ------------------ | ------------ |
| `pt1`     | Feature\.\<Point\> | first point  |
| `pt2`     | Feature\.\<Point\> | second point |


### Example

```js
var pt1 = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [144.834823, -37.771257]
  }
};
var pt2 = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [145.14244, -37.830937]
  }
};

var midpointed = turf.midpoint(pt1, pt2);
midpointed.properties['marker-color'] = '#f00';


var result = {
  "type": "FeatureCollection",
  "features": [pt1, pt2, midpointed]
};

//=result
```


**Returns** `Feature.<Point>`, a point midway between `pt1` and `pt2`

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-midpoint
```

## Tests

```sh
$ npm test
```


