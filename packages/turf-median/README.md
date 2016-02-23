# turf-median

[![build status](https://secure.travis-ci.org/Turfjs/turf-median.png)](http://travis-ci.org/Turfjs/turf-median)

turf median module


### `turf.median(polygons, points, inField, outField)`

Calculates the median value of a field for a set of Point|points within a set of Polygon|polygons.


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
          [18.400039, -33.970697],
          [18.400039, -33.818518],
          [18.665771, -33.818518],
          [18.665771, -33.970697],
          [18.400039, -33.970697]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [18.538742, -34.050383],
          [18.538742, -33.98721],
          [18.703536, -33.98721],
          [18.703536, -34.050383],
          [18.538742, -34.050383]
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
        "coordinates": [18.514022, -33.860152]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [18.48999, -33.926269]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [18.583374, -33.905755]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [18.591613, -34.024778]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [18.653411, -34.017949]
      }
    }
  ]
};

var medians = turf.median(
 polygons, points, 'population', 'median');

var resultFeatures = points.features.concat(
  medians.features);
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
$ npm install turf-median
```

## Tests

```sh
$ npm test
```


