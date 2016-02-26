# turf-combine

[![build status](https://secure.travis-ci.org/Turfjs/turf-combine.png)](http://travis-ci.org/Turfjs/turf-combine)

turf combine module


### `turf.combine(fc)`

Combines a FeatureCollection of Point, LineString, or Polygon features into MultiPoint, MultiLineString, or MultiPolygon features.


### Parameters

| parameter | type                                            | description                     |
| --------- | ----------------------------------------------- | ------------------------------- |
| `fc`      | FeatureCollection\.\<Point|LineString|Polygon\> | a FeatureCollection of any type |


### Example

```js
var fc = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [19.026432, 47.49134]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [19.074497, 47.509548]
      }
    }
  ]
};

var combined = turf.combine(fc);

//=combined
```


**Returns** `FeatureCollection.<MultiPoint|MultiLineString|MultiPolygon>`, a FeatureCollection of corresponding type to input

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-combine
```

## Tests

```sh
$ npm test
```


