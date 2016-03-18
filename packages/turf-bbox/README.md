# turf-bbox

[![build status](https://secure.travis-ci.org/Turfjs/turf-bbox.png)](http://travis-ci.org/Turfjs/turf-bbox)

turf bbox module


### `turf.bbox(input)`

Takes a set of features, calculates the bbox of all input features, and returns a bounding box.


### Parameters

| parameter | type                       | description    |
| --------- | -------------------------- | -------------- |
| `input`   | Feature\,FeatureCollection | input features |


### Example

```js
var input = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [114.175329, 22.2524]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [114.170007, 22.267969]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [114.200649, 22.274641]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [114.186744, 22.265745]
      }
    }
  ]
};

var bbox = turf.bbox(input);

var bboxPolygon = turf.bboxPolygon(bbox);

var resultFeatures = input.features.concat(bboxPolygon);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `Array.<number>`, the bounding box of `input` given as an array in WSEN order (west, south, east, north)

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-bbox
```

## Tests

```sh
$ npm test
```


