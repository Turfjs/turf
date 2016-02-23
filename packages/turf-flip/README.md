# turf-flip

[![build status](https://secure.travis-ci.org/Turfjs/turf-flip.png)](http://travis-ci.org/Turfjs/turf-flip)

turf flip module


### `turf.flip(input)`

Takes input features and flips all of their coordinates
from `[x, y]` to `[y, x]`.


### Parameters

| parameter | type                       | description    |
| --------- | -------------------------- | -------------- |
| `input`   | Feature\,FeatureCollection | input features |


### Example

```js
var serbia = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [20.566406, 43.421008]
  }
};

//=serbia

var saudiArabia = turf.flip(serbia);

//=saudiArabia
```


**Returns** `Feature,FeatureCollection`, a feature or set of features of the same type as `input` with flipped coordinates

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-flip
```

## Tests

```sh
$ npm test
```


