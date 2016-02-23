# turf-min

[![build status](https://secure.travis-ci.org/Turfjs/turf-min.png)](http://travis-ci.org/Turfjs/turf-min)

turf min module


### `turf.min(polygons, points, inField, outField)`

Calculates the minimum value of a field for a set of Point|points within a set of Polygon|polygons.


### Parameters

| parameter  | type                           | description                         |
| ---------- | ------------------------------ | ----------------------------------- |
| `polygons` | FeatureCollection\.\<Polygon\> | input polygons                      |
| `points`   | FeatureCollection\.\<Point\>   | input points                        |
| `inField`  | String                         | the field in input data to analyze  |
| `outField` | String                         | the field in which to store results |


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
          [72.809658, 18.961818],
          [72.809658, 18.974805],
          [72.827167, 18.974805],
          [72.827167, 18.961818],
          [72.809658, 18.961818]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [72.820987, 18.947043],
          [72.820987, 18.95922],
          [72.841243, 18.95922],
          [72.841243, 18.947043],
          [72.820987, 18.947043]
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
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [72.814464, 18.971396]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [72.820043, 18.969772]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [72.817296, 18.964253]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [72.83575, 18.954837]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [72.828197, 18.95094]
      }
    }
  ]
};

var minimums = turf.min(
  polygons, points, 'population', 'min');

var resultFeatures = points.features.concat(
  minimums.features);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Polygon>`, polygons with properties listed as `outField` values

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-min
```

## Tests

```sh
$ npm test
```


