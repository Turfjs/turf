# turf-deviation

[![build status](https://secure.travis-ci.org/Turfjs/turf-deviation.png)](http://travis-ci.org/Turfjs/turf-deviation)

turf deviation module


### `turf.deviation(polygons, points, inField, outField)`

Calculates the standard deviation value of a field for a set of Point|points within a set of Polygon|polygons.


### Parameters

| parameter  | type                           | description                                              |
| ---------- | ------------------------------ | -------------------------------------------------------- |
| `polygons` | FeatureCollection\.\<Polygon\> | input polygons                                           |
| `points`   | FeatureCollection\.\<Point\>   | input points                                             |
| `inField`  | String                         | the field in `points` from which to aggregate            |
| `outField` | String                         | the field to append to `polygons` representing deviation |


### Example

```js
var polygons = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-97.807159, 30.270335],
          [-97.807159, 30.369913],
          [-97.612838, 30.369913],
          [-97.612838, 30.270335],
          [-97.807159, 30.270335]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-97.825698, 30.175405],
          [-97.825698, 30.264404],
          [-97.630691, 30.264404],
          [-97.630691, 30.175405],
          [-97.825698, 30.175405]
        ]]
      }
    }
  ]
};
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "population": 500
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.709655, 30.311245]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 400
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.766647, 30.345028]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.765274, 30.294646]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 500
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.753601, 30.216355]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.667083, 30.208047]
      }
    }
  ]
};

var inField = "population";
var outField = "pop_deviation";

var deviated = turf.deviation(
  polygons, points, inField, outField);

var resultFeatures = points.features.concat(
  deviated.features);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Polygon>`, polygons with appended field representing deviation

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-deviation
```

## Tests

```sh
$ npm test
```


