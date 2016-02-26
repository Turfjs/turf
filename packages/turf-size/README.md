# turf-size

[![build status](https://secure.travis-ci.org/Turfjs/turf-size.png)](http://travis-ci.org/Turfjs/turf-size)

turf size module


### `turf.size(bbox, factor)`

Takes a bounding box and returns a new bounding box with a size expanded or contracted
by a factor of X.


### Parameters

| parameter | type              | description                                 |
| --------- | ----------------- | ------------------------------------------- |
| `bbox`    | Array\.\<number\> | a bounding box                              |
| `factor`  | Number            | the ratio of the new bbox to the input bbox |


### Example

```js
var bbox = [0, 0, 10, 10]

var resized = turf.size(bbox, 2);

var features = {
  "type": "FeatureCollection",
  "features": [
    turf.bboxPolygon(bbox),
    turf.bboxPolygon(resized)
  ]
};

//=features
```


**Returns** `Array.<number>`, the resized bbox

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-size
```

## Tests

```sh
$ npm test
```


